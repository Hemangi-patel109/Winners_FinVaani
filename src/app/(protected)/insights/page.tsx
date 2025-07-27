
'use client'

import { useState } from "react"
import { BarChartHorizontal, BotMessageSquare, Lightbulb, UserCheck, Users, Wand2, Zap, Loader2, AlertTriangle, ShieldCheck, Scale } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getFinancialInsights, GetFinancialInsightsOutput } from "@/ai/flows/get-financial-insights"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransactions } from "@/context/transactions-context"
import { getFinancialDataExample } from "@/services/mcp"
import { cn } from "@/lib/utils"

const advisorPersonas = {
  friendly: {
    label: "Friendly",
    prompt: "You are a friendly and encouraging financial buddy. Use a conversational and positive tone.",
    icon: UserCheck
  },
  analytical: {
    label: "Analytical",
    prompt: "You are a data-driven financial analyst. Use a formal tone and focus on numbers and evidence.",
    icon: BotMessageSquare
  },
  strict: {
    label: "Strict",
    prompt: "You are a no-nonsense financial coach. Be direct, firm, and focus on discipline and tough love.",
    icon: ShieldCheck
  },
};

type AdvisorPersona = keyof typeof advisorPersonas;
type InsightType = GetFinancialInsightsOutput['insightType'];

export default function InsightsPage() {
  const [persona, setPersona] = useState<AdvisorPersona>('analytical');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState<InsightType | 'what-if-custom' | null>(null);
  const [result, setResult] = useState<GetFinancialInsightsOutput | null>(null);
  const { toast } = useToast();
  const { transactions } = useTransactions();
  const financialData = JSON.stringify({ ...getFinancialDataExample(), transactions }, null, 2);

  const handleQuery = async (insightType: InsightType, customQuery?: string) => {
    setIsLoading(customQuery ? 'what-if-custom' : insightType);
    setResult(null);

    let finalQuery = customQuery || query;
    if (insightType === 'anomaly') {
      finalQuery = "Did my credit card bill jump significantly compared to last month? Are there any signs of fraud?";
    } else if (insightType === 'risk') {
        finalQuery = "I have 80% of my savings in equity. Should I rebalance my portfolio?";
    } else if (insightType === 'benchmark') {
        finalQuery = "How does my spending on food compare to others in my age group?";
    }

    try {
      const res = await getFinancialInsights({
        financialData,
        query: finalQuery,
        personaPrompt: advisorPersonas[persona].prompt,
        insightType
      });
      setResult(res);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error Generating Insight",
        description: "The AI failed to generate an insight. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  }
  
  const quickInsights = [
    {
      title: "Detect Anomalies",
      description: "Check for unusual spending or potential fraud.",
      icon: AlertTriangle,
      insightType: "anomaly" as const,
      color: "border-yellow-500/50 bg-yellow-500/5"
    },
    {
      title: "Assess Risk",
      description: "Evaluate if your investment portfolio is well-balanced.",
      icon: ShieldCheck,
      insightType: "risk" as const,
       color: "border-blue-500/50 bg-blue-500/5"
    },
    {
      title: "Benchmark Spending",
      description: "Compare your spending habits with your peers.",
      icon: Scale,
      insightType: "benchmark" as const,
       color: "border-green-500/50 bg-green-500/5"
    }
  ]

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

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><BarChartHorizontal /> AI-Powered Insights</CardTitle>
          <CardDescription>
            Unlock deeper understanding of your financial health with advanced AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickInsights.map(insight => (
                  <Card key={insight.title} className={cn("hover:shadow-lg transition-shadow", insight.color)}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <insight.icon className="h-6 w-6" />
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                          <Button size="sm" variant="outline" onClick={() => handleQuery(insight.insightType)} disabled={!!isLoading}>
                            {isLoading === insight.insightType ? <Loader2 className="animate-spin" /> : <Zap className="mr-2" />}
                            Analyze Now
                          </Button>
                      </CardContent>
                  </Card>
              ))}
          </div>

          <Card className="border-dashed">
             <CardHeader>
                 <CardTitle>What-If Explorer & Forward-Looking Reasoning</CardTitle>
                 <CardDescription>Ask complex financial questions or explore hypothetical scenarios.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div>
                    <Textarea
                        placeholder="e.g., 'Can I retire by 50?', 'What if I switch my ₹10K SIP to Nifty50 instead of Small Cap?'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={4}
                    />
                 </div>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                     <div className="w-full sm:flex-1">
                         <label className="text-sm font-medium mb-2 block">Advisor Persona</label>
                         <Select value={persona} onValueChange={(v) => setPersona(v as AdvisorPersona)}>
                             <SelectTrigger>
                                 <SelectValue placeholder="Select advisor style" />
                             </SelectTrigger>
                             <SelectContent>
                                 {Object.entries(advisorPersonas).map(([key, value]) => (
                                     <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                 ))}
                             </SelectContent>
                         </Select>
                     </div>
                     <div className="w-full sm:w-auto self-end">
                        <Button onClick={() => handleQuery('what-if', query)} disabled={!!isLoading || !query.trim()} className="w-full">
                            {isLoading === 'what-if-custom' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Generate Analysis
                        </Button>
                     </div>
                 </div>
             </CardContent>
          </Card>
        </CardContent>
      </Card>
      
       {(isLoading || result) && (
            <div className="space-y-4">
                <Card className={cn(getSentimentClass(result?.sentiment))}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {result?.insightType === 'anomaly' && <AlertTriangle />}
                            {result?.insightType === 'risk' && <ShieldCheck />}
                            {result?.insightType === 'benchmark' && <Scale />}
                            {result?.insightType === 'what-if' && <Wand2 />}
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
                            {result?.analysis}
                        </div>
                        )}
                    </CardContent>
                </Card>

                {result && result.recommendations && result.recommendations.length > 0 && (
                    <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-300">
                                <Lightbulb />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                                {result.recommendations.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
    </div>
  )
}
