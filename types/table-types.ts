import { z } from 'zod'

export const TableStateSchema = z.object({
  query: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
})
