'use server';

/**
 * @fileOverview An AI agent for financial goal planning.
 *
 * - planFinancialGoals - A function that handles the financial goal planning process.
 * - PlanFinancialGoalsInput - The input type for the planFinancialGoals function.
 * - PlanFinancialGoalsOutput - The return type for the planFinancialGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlanFinancialGoalsInputSchema = z.object({
  goalDescription: z
    .string()
    .describe('Description of the financial goal (e.g., Save $10,000 for a down payment).'),
  currentSavings: z.number().describe('The user\'s current savings amount.'),
  monthlyIncome: z.number().describe('The user\'s monthly income.'),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe('The user\'s risk tolerance (low, medium, or high).'),
  timeHorizonMonths: z
    .number()
    .describe('The number of months the user has to achieve the goal.'),
});
export type PlanFinancialGoalsInput = z.infer<typeof PlanFinancialGoalsInputSchema>;

const PlanFinancialGoalsOutputSchema = z.object({
  savingsPlan: z.string().describe('Detailed savings plan to achieve the goal.'),
  investmentStrategy: z
    .string()
    .describe('Recommended investment strategy based on risk tolerance and time horizon.'),
  estimatedTimeToGoal: z.string().describe('Estimated time to achieve the goal.'),
  additionalTips: z.array(z.string()).describe('Additional tips for achieving the financial goal.'),
});

export type PlanFinancialGoalsOutput = z.infer<typeof PlanFinancialGoalsOutputSchema>;

export async function planFinancialGoals(
  input: PlanFinancialGoalsInput
): Promise<PlanFinancialGoalsOutput> {
  return planFinancialGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'planFinancialGoalsPrompt',
  input: {schema: PlanFinancialGoalsInputSchema},
  output: {schema: PlanFinancialGoalsOutputSchema},
  prompt: `You are a financial advisor helping users to achieve their financial goals.

  Based on the user's goal, current savings, income, risk tolerance and time horizon, provide a detailed savings plan, an investment strategy, an estimated time to achieve the goal, and any additional tips.

  Goal Description: {{{goalDescription}}}
  Current Savings: {{{currentSavings}}}
  Monthly Income: {{{monthlyIncome}}}
  Risk Tolerance: {{{riskTolerance}}}
  Time Horizon (Months): {{{timeHorizonMonths}}}
  `,
});

const planFinancialGoalsFlow = ai.defineFlow(
  {
    name: 'planFinancialGoalsFlow',
    inputSchema: PlanFinancialGoalsInputSchema,
    outputSchema: PlanFinancialGoalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
