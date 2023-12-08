import { getOrderByFunc } from '@/lib/tables'
import {
  ReceiptExtractionSchema,
  purchases,
  receipts,
} from '@/server/db/schema'
import { trpcNotFoundError } from '@/trpc/shared'
import { TableStateSchema } from '@/types/table-types'
import { SQL, and, countDistinct, eq, getTableColumns, like } from 'drizzle-orm'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

import { receiptExtractionTools } from '@/lib/prompts'
import { randomUUID } from 'crypto'
import OpenAI from 'openai'

const openai = new OpenAI()

export const receiptsRouter = createTRPCRouter({
  getReceipts: protectedProcedure
    .input(TableStateSchema)
    .query(async ({ input, ctx }) => {
      const orderBy = getOrderByFunc(receipts, {
        sortByColumnOptions: ['createdAt', 'updatedAt', 'merchant'],
        defaultSortColumn: 'updatedAt',
        input,
      })

      const w: SQL[] = [eq(receipts.userId, ctx.auth.userId)]

      if (input.query) {
        w.push(like(receipts.merchant, `%${input.query}%`))
      }

      const items = await ctx.db
        .select({
          ...getTableColumns(receipts),
        })
        .from(receipts)
        .where(and(...w))
        .orderBy(orderBy)
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize)

      const total = await ctx.db
        .select({
          count: countDistinct(receipts.id),
        })
        .from(receipts)
        .where(and(...w))

      return {
        items,
        total: total[0] ? total[0].count : 0,
      }
    }),
  getReceiptById: protectedProcedure
    .input(
      z.object({
        receiptId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const item = await ctx.db.query.receipts.findFirst({
        where: and(
          eq(receipts.id, input.receiptId),
          eq(receipts.userId, ctx.auth.userId)
        ),
        with: {
          purchases: true,
        },
      })

      if (!item) {
        throw trpcNotFoundError("Couldn't find receipt")
      }

      return item
    }),
  hardDeleteReceipt: protectedProcedure
    .input(
      z.object({
        receiptId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(receipts)
        .where(
          and(
            eq(receipts.id, input.receiptId),
            eq(receipts.userId, ctx.auth.userId)
          )
        )

      return { successs: true }
    }),
  extractReceiptData: protectedProcedure
    .input(
      z.object({
        receiptId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const found = await ctx.db.query.receipts.findFirst({
        where: and(
          eq(receipts.id, input.receiptId),
          eq(receipts.userId, ctx.auth.userId)
        ),
      })

      if (!found) {
        throw trpcNotFoundError("Couldn't find receipt")
      }

      // OCR the receipt
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please write the contents of this receipt in Markdown. Make sure to include all key details.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: found.imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 4000,
      })

      const assistant = response.choices[0]

      if (!assistant || !assistant.message.content) {
        throw new Error('No assistant response')
      }

      console.log(assistant.message.content)

      // Extract the receipt details
      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        tools: receiptExtractionTools,
        tool_choice: {
          type: 'function',
          function: { name: 'extract_receipt_details' },
        },
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Here is my receipt in Markdown:\n<receipt>\n${assistant.message.content}\n</receipt>\n\nPlease extract the receipt details`,
              },
            ],
          },
        ],
      })

      if (!secondResponse.choices[0]) {
        throw new Error('No assistant response')
      }

      const responseMessage = secondResponse.choices[0].message
      const toolCalls = responseMessage.tool_calls

      if (!toolCalls) {
        throw new Error('No tool calls')
      }

      console.log(toolCalls)

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === 'extract_receipt_details') {
          const parsed = ReceiptExtractionSchema.safeParse(
            JSON.parse(toolCall.function.arguments)
          )
          if (!parsed.success) continue

          return parsed.data
        }
      }

      throw new Error('Failed to parse assistant response')
    }),
  updateReceipt: protectedProcedure
    .input(
      z.object({
        data: ReceiptExtractionSchema,
        receiptId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const found = await ctx.db.query.receipts.findFirst({
        where: and(
          eq(receipts.id, input.receiptId),
          eq(receipts.userId, ctx.auth.userId)
        ),
      })

      if (!found) {
        throw trpcNotFoundError("Couldn't find receipt")
      }

      await ctx.db
        .update(receipts)
        .set({
          merchant: input.data.merchant ?? 'Unknown Merchant',
          description: input.data.description,
        })
        .where(
          and(
            eq(receipts.id, input.receiptId),
            eq(receipts.userId, ctx.auth.userId)
          )
        )

      // delete all purchases
      await ctx.db
        .delete(purchases)
        .where(eq(purchases.receiptId, input.receiptId))

      // insert new purchases
      await ctx.db.insert(purchases).values(
        input.data.purchases.map((purchase) => ({
          id: randomUUID(),
          receiptId: input.receiptId,
          price: purchase.price,
          category: purchase.category,
          item: purchase.item,
          quantity: purchase.quantity,
        }))
      )

      return { success: true }
    }),
  getMyReceipts: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.receipts.findMany({
      where: eq(receipts.userId, ctx.auth.userId),
      with: {
        purchases: true,
      },
    })

    return data
  }),

})

