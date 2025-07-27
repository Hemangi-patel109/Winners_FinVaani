"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", income: 18600, expenses: 8000 },
  { month: "Feb", income: 30500, expenses: 20000 },
  { month: "Mar", income: 23700, expenses: 12000 },
  { month: "Apr", income: 17300, expenses: 19000 },
  { month: "May", income: 20900, expenses: 13000 },
  { month: "Jun", income: 21400, expenses: 14000 },
]

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
    },
    expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-2))"
    }
}

export default function IncomeVsExpensesChart() {
  return (
     <div className="h-full w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="hsl(var(--muted-foreground))" />
             <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                hide
             />
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    indicator="dot"
                />}
            />
            <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <Area type="monotone" dataKey="income" strokeWidth={2} stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expenses" strokeWidth={2} stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorExpenses)" />
             <Legend wrapperStyle={{paddingTop: '20px'}} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
