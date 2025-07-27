
'use client'

import {
  AlertTriangle,
  Lightbulb,
  Info,
  ArrowUpRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NetWorthGrowthChart from "@/components/dashboard/net-worth-chart"
import IncomeVsExpensesChart from "@/components/dashboard/expense-chart"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { useTransactions } from "@/context/transactions-context"

function SipPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>SIP Performance</CardTitle>
                <CardDescription>Total Value: ₹41,700</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">SBI Bluechip Fund</p>
                        <p className="text-sm text-muted-foreground">Invested: ₹10,000</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg">₹12,500</p>
                        <p className="text-sm text-green-500 flex items-center justify-end gap-1">
                            <ArrowUpRight className="h-4 w-4"/> 25.00%
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Mirae Asset Large Cap</p>
                        <p className="text-sm text-muted-foreground">Invested: ₹7,500</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg">₹8,200</p>
                        <p className="text-sm text-green-500 flex items-center justify-end gap-1">
                             <ArrowUpRight className="h-4 w-4"/> 9.30%
                        </p>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Parag Parikh Flexi Cap</p>
                        <p className="text-sm text-muted-foreground">Invested: ₹15,000</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg">₹21,000</p>
                        <p className="text-sm text-green-500 flex items-center justify-end gap-1">
                             <ArrowUpRight className="h-4 w-4"/> 40.00%
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function LoanEmiTracker() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Loan EMI Tracker</CardTitle>
                 <CardDescription>Your active loan repayment status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <p className="font-semibold">Home Loan</p>
                        <p className="text-sm text-muted-foreground">24.0% paid</p>
                    </div>
                    <Progress value={24} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                         <span>Paid: ₹120,000</span>
                         <span>Total: ₹500,000</span>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Next EMI of ₹1500 on Jul 05</p>
                </div>
                 <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <p className="font-semibold">Car Loan</p>
                        <p className="text-sm text-muted-foreground">75.0% paid</p>
                    </div>
                    <Progress value={75} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                         <span>Paid: ₹15,000</span>
                         <span>Total: ₹20,000</span>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Next EMI of ₹400 on Jul 10</p>
                </div>
            </CardContent>
        </Card>
    );
}

function RecentTransactions() {
    const { transactions } = useTransactions();
    const recentTransactions = transactions.slice(0, 5);
    
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableBody>
                            {recentTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <p className="font-medium">{tx.description}</p>
                                        <p className="text-sm text-muted-foreground">{tx.category} &middot; {tx.date}</p>
                                    </TableCell>
                                    <TableCell className={`text-right font-semibold ${tx.type === 'income' ? 'text-green-500' : ''}`}>
                                        {tx.type === 'income' ? '+' : ''}₹{tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}


export default function Dashboard() {
  return (
    <div className="flex w-full flex-col">
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-xl md:text-2xl font-bold">₹1,250,000</p>
                    <p className="text-xs text-muted-foreground">+5.2%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Income (Jun)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-xl md:text-2xl font-bold">₹85,000</p>
                    <p className="text-xs text-muted-foreground">+2.1%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Expenses (Jun)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-xl md:text-2xl font-bold">₹42,500</p>
                    <p className="text-xs text-muted-foreground">-1.5%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-xl md:text-2xl font-bold text-green-500">780</p>
                    <p className="text-xs text-muted-foreground">Excellent</p>
                </CardContent>
            </Card>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>Net Worth Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] p-0">
              <NetWorthGrowthChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
            </CardHeader>
            <CardContent  className="h-[300px] p-0">
              <IncomeVsExpensesChart />
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1 md:col-span-2">
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                        <CardTitle className="text-lg">High Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">30% more on food this week.</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <Lightbulb className="h-6 w-6 text-blue-500" />
                        <CardTitle className="text-lg">Rebalance Tip</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">SBI SIP returned 2% less than market.</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <Info className="h-6 w-6 text-red-500" />
                        <CardTitle className="text-lg">EMI Due Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">Home Loan EMI due tomorrow.</p>
                    </CardContent>
                  </Card>
            </div>
            <SipPerformance />
            <LoanEmiTracker />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <RecentTransactions />
        </div>
    </div>
  )
}
