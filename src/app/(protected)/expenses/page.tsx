
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Zap, Loader2 } from "lucide-react"
import { categorizeExpense } from "@/ai/flows/categorize-expenses"
import type { CategorizeExpenseOutput } from "@/ai/flows/categorize-expenses"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useTransactions } from '@/context/transactions-context'

export default function ExpensesPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CategorizeExpenseOutput | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast()
  const { transactions, addTransaction } = useTransactions();

  const processExpense = useCallback(async (text: string) => {
    if (!text.trim()) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await categorizeExpense({ voiceInput: text });
      setResult(res);
      addTransaction(res);
      toast({
        title: "Expense Logged!",
        description: `${res.description || res.category} for ₹${res.amount?.toLocaleString() || 'N/A'}`,
      });
    } catch (error) {
      console.error("AI Categorization Error:", error);
      toast({
        title: "AI Error",
        description: "Could not categorize the expense.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTranscribedText('');
    }
  }, [toast, addTransaction]);

  useEffect(() => {
    if (typeof window === 'undefined' || (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    
    rec.continuous = false;
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsRecording(true);
    };

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscribedText(transcript);
      processExpense(transcript);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Speech Recognition Error",
        description: `Could not recognize speech: ${event.error}`,
        variant: "destructive",
      });
      setIsRecording(false);
    };
    
    setRecognition(rec);
  }, [toast, processExpense]);


  const handleToggleRecording = () => {
    if (!recognition) {
        toast({
            title: "Browser Not Supported",
            description: "Your browser does not support speech recognition.",
            variant: "destructive",
        });
        return;
    }
    
    if (isRecording) {
      recognition.stop();
    } else {
      setResult(null);
      setTranscribedText('');
      recognition.start();
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Log Expense with Voice</CardTitle>
          <CardDescription>
            Click the button and speak your expense in English or Hindi. For example, "₹100 on milk" or "chai pe 20 rupay kharch kiye".
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            className={`rounded-full h-24 w-24 shadow-lg transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary'}`}
            onClick={handleToggleRecording}
            disabled={!recognition}
          >
             {isRecording ? <Loader2 className="h-10 w-10 animate-spin" /> : <Mic className="h-10 w-10" />}
          </Button>

          {isLoading && !result && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}

          {transcribedText && !isLoading && (
            <p className="text-lg font-medium text-center">You said: <br/><i>"{transcribedText}"</i></p>
          )}
          
          {result && !isLoading && (
            <Card className="w-full max-w-md bg-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent-foreground" />
                  Expense Categorized!
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-semibold">{result.description || 'N/A'}</p>
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{result.category}</p>
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{result.amount?.toLocaleString() || 'N/A'}</p>
                  </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Here are your recently logged expenses.</CardDescription>
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
                {transactions.map((expense) => (
                  <TableRow key={expense.id}>
                      <TableCell className="font-medium pr-2">{expense.description || 'N/A'}</TableCell>
                      <TableCell className="px-2"><Badge variant="outline" className="whitespace-nowrap">{expense.category}</Badge></TableCell>
                      <TableCell className="px-2 whitespace-nowrap">{format(new Date(expense.date), "dd-MM-yy")}</TableCell>
                      <TableCell className="text-right pl-2 font-semibold">₹{expense.amount?.toFixed(2) || '0.00'}</TableCell>
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
