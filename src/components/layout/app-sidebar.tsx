
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Wallet,
  FileText,
  BotMessageSquare,
  Target,
  BarChartHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FinvaaniIcon } from '../finvaani-icon';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/expenses', icon: Wallet, label: 'Expenses' },
  { href: '/analyzer', icon: BotMessageSquare, label: 'AI Analyzer' },
  { href: '/insights', icon: BarChartHorizontal, label: 'AI Insights' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/reports', icon: FileText, label: 'Reports' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex flex-col p-6">
        <Link
          href="/dashboard"
          className="group mb-8 flex items-center gap-2 text-lg font-semibold"
        >
          <div className="bg-primary text-primary-foreground rounded-md p-2 flex items-center justify-center">
            <FinvaaniIcon className="h-6 w-6 transition-all group-hover:scale-110" />
          </div>
          <span className="font-bold text-xl font-headline">Finvaani</span>
        </Link>
        
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary',
                pathname.startsWith(item.href) && 'bg-muted text-primary font-semibold'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm font-semibold">User</p>
            </div>
            <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </aside>
  );
}
