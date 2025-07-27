"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const generateChartData = () => [
  { name: "Jan", total: Math.floor(Math.random() * 2000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 2000) + 1200 },
  { name: "Mar", total: Math.floor(Math.random() * 2000) + 1500 },
  { name: "Apr", total: Math.floor(Math.random() * 2000) + 1300 },
  { name: "May", total: Math.floor(Math.random() * 2000) + 1800 },
  { name: "Jun", total: Math.floor(Math.random() * 2000) + 2200 },
];

const chartConfig = {
    total: {
        label: "Net Worth",
        color: "hsl(var(--chart-1))",
    },
}

export default function NetWorthGrowthChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateChartData());
  }, []);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value / 1000}k`}
            domain={['dataMin - 500', 'dataMax + 500']}
            hide
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                indicator="dot"
            />}
          />
          <Area
            dataKey="total"
            type="monotone"
            fill="url(#colorTotal)"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
