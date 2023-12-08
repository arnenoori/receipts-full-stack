'use server'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/trpc/server'
import BudgetChart from './_components/budget-charts'
import BudgetForm from './_components/budget-form'
import SpendingCharts from './_components/spending-charts'

export default async function Page({}: {}) {
  const budget = await api.budgets.getMyBudget.query()
  const receiptData = await api.receipts.getMyReceipts.query()

  return (
    <>
      <Tabs
        defaultValue="budget"
        className="w-full justify-center items-center flex flex-col"
      >
        <TabsList className="mx-auto">
          <TabsTrigger value="budget">Budget Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending Overview</TabsTrigger>
          <TabsTrigger value="update">Update Your Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="spending" className="max-w-3xl">
          <SpendingCharts receiptsData={receiptData} />
        </TabsContent>
        <TabsContent value="budget" className="max-w-3xl">
          <BudgetChart receiptsData={receiptData} />
        </TabsContent>
        <TabsContent value="update" className="w-full">
          <BudgetForm budget={budget} />
        </TabsContent>
      </Tabs>
    </>
  )
}
