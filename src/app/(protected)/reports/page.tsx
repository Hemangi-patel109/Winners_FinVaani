
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowUpRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SpendingBreakdownChart from "@/components/reports/spending-breakdown-chart"
import { useTransactions } from "@/context/transactions-context"
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import { getSipData } from "@/services/mcp"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"


const sipData = getSipData();

function SipPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>SIP Performance</CardTitle>
                <CardDescription>Current performance of your investments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {sipData.map(sip => (
                    <div key={sip.name} className="flex justify-between items-center gap-2">
                        <div>
                            <p className="font-semibold text-sm md:text-base">{sip.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Invested: ₹{sip.invested.toLocaleString()}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="font-semibold text-base md:text-lg">₹{sip.current.toLocaleString()}</p>
                            <p className="text-sm text-green-500 flex items-center justify-end gap-1">
                                <ArrowUpRight className="h-4 w-4"/> {sip.returns.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function ReportsPage() {
    const { transactions } = useTransactions()

    return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-3">
                <CardHeader className="pb-4">
                    <CardTitle>Spending Breakdown</CardTitle>
                    <CardDescription>Top spending categories this month.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] md:h-[400px]">
                    <SpendingBreakdownChart />
                </CardContent>
            </Card>
            <div className="md:col-span-2">
                <SipPerformance />
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A complete list of your recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium pr-2">{transaction.description}</TableCell>
                                <TableCell className="px-2"><Badge variant="outline" className="whitespace-nowrap">{transaction.category}</Badge></TableCell>
                                <TableCell className="px-2 whitespace-nowrap">{format(new Date(transaction.date), "dd-MM-yy")}</TableCell>
                                <TableCell className={`text-right pl-2 font-semibold ${transaction.type === 'income' ? 'text-green-500' : ''}`}>
                                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
      </Card>

    </div>
  )
}
