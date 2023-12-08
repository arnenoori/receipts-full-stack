// app/api/chat/route.ts

import { db } from '@/server/db'
import { CATEGORIES, budgets, purchases, receipts } from '@/server/db/schema'
import { auth } from '@clerk/nextjs'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { and, desc, eq, getTableColumns, sum } from 'drizzle-orm'
import OpenAI from 'openai'
import { ChatCompletionCreateParams } from 'openai/resources'

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'get_monthly_budget',
    description: 'Get the monthly budget for a category',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: CATEGORIES,
          description: 'The monthly budget for a category',
        },
        type: {
          type: 'string',
          enum: ['total', 'remaining'],
          description:
            'Should we retrieve the total budget or the amount remaining?',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_monthly_spend',
    description:
      'Get the amount the user has spent in the last month for a category',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: CATEGORIES,
          description: 'The category to retrieve the spend',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_purchases',
    description: 'Get the 10 most recent purchases in a category',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: CATEGORIES,
          description: 'The category to retrieve the spend',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_receipt',
    description: 'Get the receipt data for a given merchant name',
    parameters: {
      type: 'object',
      properties: {
        merchant: {
          type: 'string',
          description: 'The merchant name to retrieve the receipt for',
        },
      },
      required: ['merchant'],
    },
  },
  {
    name: 'calculate_sum',
    description:
      'Get the sum of a list of numbers, useful when calculating the total price of a receipt',
    parameters: {
      type: 'object',
      properties: {
        numbers: {
          type: 'array',
          items: {
            type: 'number',
          },
          description: 'The numbers to sum',
        },
      },
      required: ['numbers'],
    },
  },
]

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  const authData = auth()

  if (!authData.userId) {
    throw new Error('Not authenticated')
  }

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
    functions,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      // if you skip the function call and return nothing, the `function_call`
      // message will be sent to the client for it to handle
      if (name === 'get_monthly_budget') {
        const category = args.category as (typeof CATEGORIES)[number]
        const budget = await db.query.budgets.findFirst({
          columns: {
            [category]: true,
          },
          where: and(eq(budgets.userId, authData.userId)),
        })

        if (!budget) {
          throw new Error('No budget found')
        }

        if (args.type === 'remaining') {
          const result = await db
            .select({
              totalSpend: sum(purchases.price),
              category: purchases.category,
            })
            .from(purchases)
            .where(and(eq(purchases.category, category)))
            .innerJoin(
              receipts,
              and(
                eq(purchases.receiptId, receipts.id),
                eq(receipts.userId, authData.userId)
              )
            )
            .groupBy(purchases.category)

          if (!result[0]) throw new Error('No purchases found')

          const remaining =
            budget[category as keyof typeof budget] -
            parseFloat(result[0].totalSpend ?? '0')

          const newMessages = createFunctionCallMessages({
            total: budget[category as keyof typeof budget],
            remaining: remaining,
          })
          return openai.chat.completions.create({
            messages: [...messages, ...newMessages],
            stream: true,
            model: 'gpt-3.5-turbo-0613',
            // see "Recursive Function Calls" below
            functions,
          })
        }

        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = createFunctionCallMessages(budget ?? {})
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          // see "Recursive Function Calls" below
          functions,
        })
      }

      if (name === 'get_monthly_spend') {
        const category = args.category as (typeof CATEGORIES)[number]
        const result = await db
          .select({
            totalSpend: sum(purchases.price),
            category: purchases.category,
          })
          .from(purchases)
          .where(and(eq(purchases.category, category)))
          .innerJoin(
            receipts,
            and(
              eq(purchases.receiptId, receipts.id),
              eq(receipts.userId, authData.userId)
            )
          )
          .groupBy(purchases.category)

        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = createFunctionCallMessages(result ?? {})
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          // see "Recursive Function Calls" below
          functions,
        })
      }

      if (name === 'get_receipt') {
        const merchant = args.merchant as string
        const result = await db.query.receipts.findFirst({
          where: and(
            eq(receipts.merchant, merchant),
            eq(receipts.userId, authData.userId)
          ),
          orderBy: desc(receipts.createdAt),
          with: {
            purchases: true,
          },
        })

        const newMessages = createFunctionCallMessages(
          JSON.parse(JSON.stringify(result ?? { error: 'No receipt found' }))
        )
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          // see "Recursive Function Calls" below
          functions,
        })
      }

      if (name === 'get_purchases') {
        const category = args.category as (typeof CATEGORIES)[number]
        const result = await db
          .select({
            ...getTableColumns(purchases),
            receiptMerchant: receipts.merchant,
          })
          .from(purchases)
          .innerJoin(
            receipts,
            and(
              eq(purchases.receiptId, receipts.id),
              eq(receipts.userId, authData.userId)
            )
          )
          .where(and(eq(purchases.category, category)))
          .orderBy(desc(receipts.createdAt))
          .limit(10)

        const newMessages = createFunctionCallMessages(
          JSON.parse(JSON.stringify(result ?? { error: 'No purchases found' }))
        )
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          // see "Recursive Function Calls" below
          functions,
        })
      }

      if (name === 'calculate_sum') {
        const numbers = args.numbers as number[]
        console.log(numbers)
        const result = numbers.reduce((a, b) => a + b, 0)

        const newMessages = createFunctionCallMessages({ result })
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          // see "Recursive Function Calls" below
          functions,
        })
      }
    },
  })

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
