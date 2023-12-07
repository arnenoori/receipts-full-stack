import { createTRPCRouter } from '@/server/api/trpc'
import { budgetsRouter } from './routers/budgets'
import { pingRouter } from './routers/ping'
import { receiptsRouter } from './routers/receipts'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ping: pingRouter,
  budgets: budgetsRouter,
  receipts: receiptsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
