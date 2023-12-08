import { CATEGORIES } from '@/server/db/schema'
import { ChatCompletionTool } from 'openai/resources'

export const receiptExtractionTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'extract_receipt_details',
      description:
        "Extract details from a receipt, including the merchant's name, a brief description, and an array of items purchased with their respective details such as price, warranty and return dates, category, and quantity.",
      parameters: {
        type: 'object',
        properties: {
          merchant: {
            type: 'string',
            description: "The merchant's name from the receipt.",
          },
          description: {
            type: 'string',
            description: 'A brief description of the receipt.',
          },
          purchases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                price: {
                  type: 'number',
                  description: 'The price of the item.',
                },
                item: {
                  type: 'string',
                  description: 'The name of the item.',
                },
                category: {
                  type: 'string',
                  enum: CATEGORIES,
                  description: 'The category of the item.',
                },
                quantity: {
                  type: 'number',
                  description: 'The quantity of the item purchased.',
                },
              },
              required: ['price', 'category', 'quantity'],
            },
          },
        },
        required: ['merchant', 'description', 'purchases'],
      },
    },
  },
]
