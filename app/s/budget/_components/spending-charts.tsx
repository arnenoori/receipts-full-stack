'use client'

import { camelCaseToTitleCase } from '@/lib/utils'
import { RouterOutputs } from '@/trpc/shared'
import {
  BadgeDelta,
  Card,
  DonutChart,
  Flex,
  Legend,
  List,
  ListItem,
  Select,
  SelectItem,
  Title,
} from '@tremor/react'
import { useEffect, useState } from 'react'

interface BudgetItem {
  name: string
  budget: number
  delta: string
  deltaType: string
}

export default function SpendingChart({
  receiptsData,
}: {
  receiptsData: RouterOutputs['receipts']['getMyReceipts']
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filteredData, setFilteredData] = useState<BudgetItem[]>([])

  const excludeKeys = ['userId', 'createdAt', 'updatedAt']

  const categoryToPurchasesMap: Record<string, number> = {}

  for (const receipt of receiptsData) {
    for (const purchase of receipt.purchases) {
      if (!purchase.category) continue
      if (categoryToPurchasesMap[purchase.category]) {
        categoryToPurchasesMap[purchase.category] += purchase.price
      } else {
        categoryToPurchasesMap[purchase.category] = purchase.price
      }
    }
  }

  useEffect(() => {
    const data = Object.entries(categoryToPurchasesMap)
      .filter(([key]) => !excludeKeys.includes(key))
      .map(([key, value]) => ({
        name: camelCaseToTitleCase(key),
        budget: Number(value), // Ensure the budget is a number
        delta: '0%', // You'll need to calculate this value based on your data
        deltaType: 'increase', // You'll need to determine this value based on your data
      }))
    setFilteredData(
      selectedCategory === 'all'
        ? data
        : data.filter((item) => item.name === selectedCategory)
    )
  }, [selectedCategory])

  const valueFormatter = (number: number) =>
    `$${Intl.NumberFormat('us').format(number).toString()}`

  return (
    <Card className="w-full mx-auto mt-10">
      <Flex className="space-x-8" justifyContent="start" alignItems="center">
        <Title>Spending</Title>
        <Select
          onValueChange={setSelectedCategory}
          placeholder="Category Selection"
        >
          <SelectItem key="all" value="all">
            All Categories
          </SelectItem>
          {Object.keys(categoryToPurchasesMap || {})
            .filter((category) => !excludeKeys.includes(category))
            .map((category) => (
              <SelectItem key={category} value={camelCaseToTitleCase(category)}>
                {camelCaseToTitleCase(category)}
              </SelectItem>
            ))}
        </Select>
      </Flex>
      <Legend
        categories={filteredData.map((item) => item.name)}
        className="mt-6"
      />
      <DonutChart
        data={filteredData}
        category="budget"
        index="name"
        valueFormatter={valueFormatter}
        className="mt-6"
      />
      <List className="mt-6">
        {filteredData.map((item: BudgetItem) => (
          <ListItem key={item.name}>
            {item.name}
            <BadgeDelta deltaType={item.deltaType} size="xs">
              {item.delta}
            </BadgeDelta>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}
