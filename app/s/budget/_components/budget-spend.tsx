// app/s/budget/_components/budget-spend.tsx
/*
'use client'

import { RouterOutputs } from '@/trpc/shared'
import { useEffect, useState } from 'react'
import {
  Card,
  TabList,
  Tab,
  ProgressBar,
  Text,
  Flex,
  Button,
  Metric,
  BadgeDelta,
  AreaChart,
  TabGroup,
  TabPanels, // Add this
  TabPanel, // Add this
  DonutChart, // Add this
} from "@tremor/react";
import { api } from '@/trpc/react'

const valueFormatter = (number: number) => `$${Intl.NumberFormat("us").format(number).toString()}`;

export default function Example() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedLocation = selectedIndex === 0 ? "A" : "B";

  const budget = api.budgets.getMyBudget.useQuery();
  const spending = api.budgets.getMySpending.useQuery();

  const totalSales = spending.data?.total || 0;
  const totalBudget = budget.data?.total || 0;

  const sales = [
    {
      Month: "Current Month",
      Sales: totalSales,
    },
  ];

  const products = Object.entries(budget.data || {}).map(([title, value]) => ({
    title,
    value: (value / totalBudget) * 100,
    metric: `$ ${value}`,
    location: "A",
  }));

  return (
    <Card className="max-w-md mx-auto">
      <Flex alignItems="start">
        <Text>Total Sales</Text>
        <BadgeDelta deltaType="moderateIncrease">{((totalSales - totalBudget) / totalBudget) * 100}%</BadgeDelta>
      </Flex>
      <Flex justifyContent="start" alignItems="baseline" className="space-x-3 truncate">
        <Metric>{valueFormatter(totalSales)}</Metric>
        <Text>from {valueFormatter(totalBudget)}</Text>
      </Flex>
      <AreaChart
        className="mt-10 h-48"
        data={sales}
        index="Month"
        categories={["Sales"]}
        colors={["blue"]}
        showYAxis={false}
        showLegend={false}
        startEndOnly={true}
        valueFormatter={valueFormatter}
      />
      <TabGroup className="mt-4" index={selectedIndex} onIndexChange={setSelectedIndex}>
        <TabList>
          <Tab>Location A</Tab>
          <Tab>Location B</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DonutChart
              data={products}
              category="category"
              index="name"
              valueFormatter={valueFormatter}
              className="mt-6"
            />
          </TabPanel>
          <TabPanel>
            <DonutChart
              data={products}
              category="category"
              index="name"
              valueFormatter={valueFormatter}
              className="mt-6"
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  )
}
*/