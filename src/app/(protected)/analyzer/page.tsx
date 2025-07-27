
'use client'

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { analyzeFinancialData, AnalyzeFinancialDataOutput } from "@/ai/flows/analyze-financial-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Mic, Sparkles, Wand2, Lightbulb } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransactions } from "@/context/transactions-context"
import { cn } from "@/lib/utils"
import { getFinancialDataExample } from "@/services/mcp"

const getSentimentClass = (sentiment: 'positive' | 'neutral' | 'negative' | undefined) => {
    switch (sentiment) {
        case 'positive':
            return 'bg-green-500/10 border-green-500/20';
        case 'negative':
            return 'bg-red-500/10 border-red-500/20';
        case 'neutral':
        default:
            return 'bg-blue-500/10 border-blue-500/20';
    }
}


function AskAiTab() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeFinancialDataOutput | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast()
  const { transactions } = useTransactions();

  const handleAnalysis = useCallback(async (currentQuery: string) => {
    if (!currentQuery.trim()) return;
    setIsLoading(true)
    setResult(null)
    try {
      const res = await analyzeFinancialData({
        financialData: JSON.stringify({ ...getFinancialDataExample(), transactions }, null, 2),
        query: currentQuery,
      })
      setResult(res)
    } catch (e) {
      console.error(e)
      toast({
        title: "Error Analyzing Data",
        description: "The AI failed to analyze your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, transactions]);

  useEffect(() => {
    if (typeof window === 'undefined' || (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))) {
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => setIsRecording(true);
    rec.onend = () => setIsRecording(false);
    rec.onerror = (event) => {
      toast({ title: "Speech Error", description: event.error, variant: "destructive" });
    };
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleAnalysis(transcript);
    };
    setRecognition(rec);
  }, [toast, handleAnalysis]);

  const handleToggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      setQuery('');
      setResult(null);
      recognition.start();
    }
  };

  return (
    <div className="space-y-6">
        <Card className="border-none shadow-none">
            <CardHeader className="p-0">
                <CardTitle>Ask the AI</CardTitle>
                <CardDescription>Ask any question about your finances and get an instant analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                 <div className="space-y-2">
                    <Textarea
                    placeholder="e.g., What is my net worth?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handleAnalysis(query)} disabled={isLoading || !query.trim()}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Analyze
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleToggleRecording} disabled={!recognition}>
                         {isRecording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>

        {(isLoading || result) && (
            <div className="space-y-4">
                <Card className={cn(getSentimentClass(result?.sentiment))}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        AI Analysis Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Generating insights...</span>
                        </div>
                        ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
                            {result?.analysisResult}
                        </div>
                        )}
                    </CardContent>
                </Card>

                {result && result.tips && result.tips.length > 0 && (
                    <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-300">
                                <Lightbulb />
                                Actionable Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                                {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
    </div>
  )
}


function LoanAffordabilityTab() {
    const [formState, setFormState] = useState({
        loanAmount: '',
        interestRate: '',
        loanTerm: '',
        monthlyIncome: '',
        monthlyExpenses: '',
        existingLoanPayments: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeFinancialDataOutput | null>(null);
    const { toast } = useToast();
    const { transactions } = useTransactions();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    }

    const handleAnalysis = async () => {
        setIsLoading(true);
        setResult(null);

        const query = `Based on my financial data, can I afford a loan of ₹${formState.loanAmount} at ${formState.interestRate}% interest rate for ${formState.loanTerm} years? My monthly income is ₹${formState.monthlyIncome}, my monthly expenses are roughly ₹${formState.monthlyExpenses}, and my existing loan payments are ₹${formState.existingLoanPayments}. Please provide a detailed analysis of affordability, including a projected debt-to-income ratio.`;

        try {
            const res = await analyzeFinancialData({
                financialData: JSON.stringify({ ...getFinancialDataExample(), transactions }, null, 2),
                query,
            });
            setResult(res);
        } catch (e) {
            console.error(e);
            toast({
                title: "Error Analyzing Data",
                description: "The AI failed to analyze your data. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-none">
                <CardHeader className="p-0">
                    <CardTitle>Can I afford this loan?</CardTitle>
                    <CardDescription>Enter the details of a potential loan to see if it fits your budget.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="loanAmount">Loan Amount</Label>
                            <Input id="loanAmount" value={formState.loanAmount} onChange={handleInputChange} placeholder="e.g., 5000000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="interestRate">Interest Rate (%)</Label>
                            <Input id="interestRate" value={formState.interestRate} onChange={handleInputChange} placeholder="e.g., 8.5" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                            <Input id="loanTerm" value={formState.loanTerm} onChange={handleInputChange} placeholder="e.g., 30" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="monthlyIncome">Monthly Income</Label>
                            <Input id="monthlyIncome" value={formState.monthlyIncome} onChange={handleInputChange} placeholder="e.g., 75000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                            <Input id="monthlyExpenses" value={formState.monthlyExpenses} onChange={handleInputChange} placeholder="e.g., 30000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="existingLoanPayments">Existing Loan Payments</Label>
                            <Input id="existingLoanPayments" value={formState.existingLoanPayments} onChange={handleInputChange} placeholder="e.g., 15000" />
                        </div>
                    </div>
                    <Button onClick={handleAnalysis} disabled={isLoading}>
                         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Analyze Affordability
                    </Button>
                </CardContent>
            </Card>
            {(isLoading || result) && (
                <div className="space-y-4">
                    <Card className={cn(getSentimentClass(result?.sentiment))}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            AI Analysis Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Generating insights...</span>
                            </div>
                            ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
                                {result?.analysisResult}
                            </div>
                            )}
                        </CardContent>
                    </Card>

                    {result && result.tips && result.tips.length > 0 && (
                        <Card className="bg-yellow-500/10 border-yellow-500/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-300">
                                    <Lightbulb />
                                    Actionable Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                                    {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState("loan-affordability");

  return (
    <div className="flex flex-col space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="loan-affordability">Loan Affordability</TabsTrigger>
                <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
            </TabsList>
            <TabsContent value="loan-affordability" className="mt-6">
                <LoanAffordabilityTab />
            </TabsContent>
            <TabsContent value="ask-ai" className="mt-6">
                <AskAiTab />
            </TabsContent>
        </Tabs>
    </div>
  )
}
