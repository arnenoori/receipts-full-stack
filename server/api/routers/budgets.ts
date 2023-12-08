import { InsertBudgetSchema, NewBudget, budgets} from '@/server/db/schema'
import { trpcBadRequestError } from '@/trpc/shared'
import { eq } from 'drizzle-orm'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const budgetsRouter = createTRPCRouter({
  getMyBudget: protectedProcedure.query(async ({ ctx }) => {
    let found = await ctx.db.query.budgets.findFirst({
      where: eq(budgets.userId, ctx.auth.userId),
    })

    if (!found) {
      const newBudget: NewBudget = {
        userId: ctx.auth.userId,
      }

      await ctx.db.insert(budgets).values(newBudget)

      found = await ctx.db.query.budgets.findFirst({
        where: eq(budgets.userId, ctx.auth.userId),
      })
    }

    if (!found) {
      throw trpcBadRequestError('Budget not found')
    }

    return found
  }),
  updateBudget: protectedProcedure
    .input(InsertBudgetSchema.omit({ userId: true }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(budgets)
        .set(input)
        .where(eq(budgets.userId, ctx.auth.userId))

      return {
        success: true,
      }
    }),
})
