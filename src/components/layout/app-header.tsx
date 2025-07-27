
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  PanelLeft,
  Home,
  Wallet,
  Target,
  BotMessageSquare,
  FileText,
  Settings,
  User,
  Download,
  BarChartHorizontal,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../theme-toggle';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTransactions } from '@/context/transactions-context';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { getLoanData, getSipData } from '@/services/mcp';
import { FinvaaniIcon } from '../finvaani-icon';


const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/expenses', icon: Wallet, label: 'Expenses' },
    { href: '/goals', icon: Target, label: 'Goals' },
    { href: '/analyzer', icon: BotMessageSquare, label: 'AI Analyzer' },
    { href: '/insights', icon: BarChartHorizontal, label: 'AI Insights' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

const sipData = getSipData();
const loanData = getLoanData();

function PageTitle({ pathname }: { pathname: string }) {
    const pageInfo = navItems.find(item => pathname.startsWith(item.href));
    
    if (!pageInfo || !pageInfo.label) {
        return null;
    }
    
    return <h1 className="flex-1 text-xl md:text-2xl font-bold font-headline tracking-tight whitespace-nowrap">{pageInfo.label}</h1>;
}

function ExportButtons() {
    const { transactions } = useTransactions();
    const pathname = usePathname();

    const handleExport = (format: 'pdf' | 'csv') => {
        if (pathname === '/expenses') {
            if (format === 'csv') {
                const csv = Papa.unparse(transactions.map(t => ({
                    Date: t.date,
                    Description: t.description,
                    Category: t.category,
                    Amount: t.amount,
                    Type: t.type
                })));
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "transactions.csv");
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else if (format === 'pdf') {
                const doc = new jsPDF();
                (doc as any).autoTable({
                    head: [['Date', 'Description', 'Category', 'Amount', 'Type']],
                    body: transactions.map(t => [t.date, t.description, t.category, t.amount, t.type]),
                });
                doc.save('transactions.pdf');
            }
        } else if (pathname === '/reports') {
            const spendingSummary = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                if (!acc[t.category]) {
                    acc[t.category] = 0;
                }
                acc[t.category] += t.amount || 0;
                return acc;
            }, {} as Record<string, number>);

            const spendingData = Object.entries(spendingSummary).map(([category, amount]) => ({ category, amount }));
            
            const investmentData = sipData.map(sip => ({
                name: sip.name,
                currentValue: sip.current,
                investment: sip.invested,
                gainLoss: sip.current - sip.invested
            }));
            
            const loanBreakdownData = loanData.map(loan => ({
                loan: loan.name,
                outstanding: loan.outstanding,
                nextEmiDate: loan.emiDate,
                emiAmount: loan.emiAmount
            }));
            
            if (format === 'pdf') {
                const doc = new jsPDF();
                doc.text("Financial Report", 14, 16);
                
                autoTable(doc, {
                    startY: 22,
                    head: [['Category', 'Amount (INR)']],
                    body: spendingData.map(d => [d.category, d.amount.toFixed(2)]),
                    didDrawPage: (data) => {
                        if (data.pageNumber === 1) {
                            doc.text("Spending Summary", 14, data.cursor!.y + 15);
                        }
                    }
                });

                autoTable(doc, {
                    startY: (doc as any).lastAutoTable.finalY + 20,
                    head: [['SIP Name', 'Current Value', 'Total Investment', 'Gain/Loss']],
                    body: investmentData.map(d => [d.name, `₹${d.currentValue}`, `₹${d.investment}`, `₹${d.gainLoss.toFixed(2)}`]),
                    didDrawPage: (data) => {
                        doc.text("Investment Summary", 14, (doc as any).lastAutoTable.finalY + 15);
                    }
                });

                autoTable(doc, {
                    startY: (doc as any).lastAutoTable.finalY + 10,
                    head: [['Loan', 'Outstanding', 'Next EMI Date', 'EMI Amount']],
                    body: loanBreakdownData.map(d => [d.loan, `₹${d.outstanding}`, d.nextEmiDate, `₹${d.emiAmount}`]),
                });

                doc.save("financial_report.pdf");

            } else if (format === 'csv') {
                const spendingCsv = Papa.unparse(spendingData);
                const investmentCsv = Papa.unparse(investmentData);
                const loanCsv = Papa.unparse(loanBreakdownData);

                const combinedCsv = `Spending Summary\n${spendingCsv}\n\nInvestment & Loan Summary\n${investmentCsv}\n\n${loanCsv}`;
                
                const blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "financial_report.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };
    
    const showButtons = pathname === '/expenses' || pathname === '/reports';

    if (!showButtons) return null;

    if (pathname === '/expenses') {
         return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                        Download as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                        Download as PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="mr-2 h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}><Download className="mr-2 h-4 w-4" /> CSV</Button>
        </div>
    );
}

export function AppHeader() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-background">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              onClick={() => setIsSheetOpen(false)}
              className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <FinvaaniIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Finvaani</span>
            </Link>
            {navItems.map((item) => (
               <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSheetOpen(false)}
                className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <PageTitle pathname={pathname} />
      <div className="relative flex-grow flex justify-end items-center gap-2">
        <ExportButtons />
        <ThemeToggle />
      </div>
    </header>
  );
}
