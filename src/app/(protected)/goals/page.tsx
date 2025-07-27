
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import type { PlanFinancialGoalsOutput } from "@/ai/flows/plan-financial-goals"
import { planFinancialGoals } from "@/ai/flows/plan-financial-goals"
import { Loader2, Sparkles, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import GoalProgress from "@/components/dashboard/goal-progress"

const formSchema = z.object({
  goalDescription: z.string().min(10, {
    message: "Please describe your goal in at least 10 characters.",
  }),
  currentSavings: z.coerce.number().min(0),
  monthlyIncome: z.coerce.number().min(1, { message: "Monthly income must be positive." }),
  riskTolerance: z.enum(["low", "medium", "high"]),
  timeHorizonMonths: z.coerce.number().min(1, { message: "Time horizon must be at least 1 month." }),
})

export default function GoalsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<PlanFinancialGoalsOutput | null>(null)
  const { toast } = useToast();

  useEffect(() => {
    const savedPlan = localStorage.getItem('financialGoalPlan');
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalDescription: "",
      currentSavings: 0,
      monthlyIncome: 50000,
      riskTolerance: "medium",
      timeHorizonMonths: 12,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setPlan(null)
    localStorage.removeItem('financialGoalPlan');
    try {
      const result = await planFinancialGoals(values)
      setPlan(result);
      localStorage.setItem('financialGoalPlan', JSON.stringify(result));
    } catch (e) {
      console.error(e)
      toast({
        title: "Error Generating Plan",
        description: "The AI failed to generate a financial plan. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Plan a New Financial Goal</CardTitle>
          <CardDescription>
            Let our AI assistant help you create a roadmap to achieve your financial dreams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="goalDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Save for a trip to Japan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="currentSavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Savings (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Income (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Tolerance</FormLabel>
                       <Select onValuechange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your risk tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeHorizonMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Horizon (Months)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div>
        {isLoading && (
            <Card className="flex h-full min-h-[400px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                    <p className="mt-4 font-semibold">Crafting your financial plan...</p>
                    <p className="text-sm">Our AI is analyzing your details.</p>
                </div>
            </Card>
        )}
        {plan && !isLoading && (
          <Card className="bg-gradient-to-br from-card to-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Custom Financial Plan</CardTitle>
              <CardDescription>Estimated time to goal: {plan.estimatedTimeToGoal}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-lg">Savings Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{plan.savingsPlan}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-lg">Investment Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{plan.investmentStrategy}</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Lightbulb /> Additional Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5">
                    {plan.additionalTips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
        {!isLoading && !plan && (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <CardTitle className="font-headline text-2xl">No Active Goal Plan</CardTitle>
                    <CardDescription>Use the form above to create a new financial goal.</CardDescription>
                </div>
            </Card>
        )}
      </div>
    </div>
  )
}
