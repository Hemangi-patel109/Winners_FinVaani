
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FinvaaniIcon } from '@/components/finvaani-icon';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <FinvaaniIcon className="h-8 w-8" />
                </div>
            </div>
            <CardTitle className="font-headline text-3xl">Welcome to Finvaani</CardTitle>
            <CardDescription>Your AI-powered financial companion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Sign in to manage your finances, track your goals, and get AI-powered insights.
            </p>
            <Link href="/dashboard" passHref>
              <Button className="w-full font-bold" size="lg">
                Enter Dashboard
              </Button>
            </Link>
             <p className="text-center text-xs text-muted-foreground pt-4">
              This is a demo application. No authentication is required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
