
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { useTransactions } from "@/context/transactions-context"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function SpendingBreakdownChart() {
  const { transactions } = useTransactions();

  const categorySpending = React.useMemo(() => {
    const spending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category || 'Other';
        const amount = transaction.amount || 0;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(spending).map(([name, value]) => ({ name, value }));
  }, [transactions]);
  
  const chartConfig = categorySpending.reduce((acc, entry, index) => {
    acc[entry.name] = {
      label: entry.name,
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as any);


  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                nameKey="name"
                hideLabel
            />}
          />
          <Pie
            data={categorySpending}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            fill="hsl(var(--chart-1))"
          >
            {categorySpending.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center" />}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{paddingTop: '20px'}}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
