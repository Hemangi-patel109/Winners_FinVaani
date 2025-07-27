'use server';

/**
 * @fileOverview An AI agent for analyzing financial data.
 *
 * - analyzeFinancialData - A function that handles the financial data analysis process.
 * - AnalyzeFinancialDataInput - The input type for the analyzeFinancialData function.
 * - AnalyzeFinancialDataOutput - The return type for the analyzeFinancialData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFinancialDataInputSchema = z.object({
  financialData: z
    .string()
    .describe('The user financial data in JSON format.'),
  query: z.string().describe('The question about the financial data.'),
});
export type AnalyzeFinancialDataInput = z.infer<typeof AnalyzeFinancialDataInputSchema>;

const AnalyzeFinancialDataOutputSchema = z.object({
  analysisResult: z.string().describe('The analysis result of the financial data.'),
  sentiment: z
    .enum(['positive', 'neutral', 'negative'])
    .describe(
      'The sentiment of the analysis result. "positive" for affordable/good, "negative" for not affordable/bad, "neutral" for informational.'
    ),
  tips: z.array(z.string()).describe('A list of actionable tips for the user based on the analysis. This should contain 2-3 short, helpful tips.')
});
export type AnalyzeFinancialDataOutput = z.infer<typeof AnalyzeFinancialDataOutputSchema>;

export async function analyzeFinancialData(input: AnalyzeFinancialDataInput): Promise<AnalyzeFinancialDataOutput> {
  return analyzeFinancialDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFinancialDataPrompt',
  input: {schema: AnalyzeFinancialDataInputSchema},
  output: {schema: AnalyzeFinancialDataOutputSchema},
  prompt: `You are a financial advisor AI. Your goal is to provide clear analysis and actionable advice.

Analyze the financial data provided to answer the user's question. Based on your analysis:
1.  Set the sentiment: "positive" for good financial health/affordable, "negative" for poor financial health/unaffordable, or "neutral" for informational queries.
2.  Generate 2-3 concise, actionable tips based on the analysis. The tips should be helpful and directly related to the user's query and financial data.

Financial Data: {{{financialData}}}

Question: {{{query}}}
`,
});

const analyzeFinancialDataFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialDataFlow',
    inputSchema: AnalyzeFinancialDataInputSchema,
    outputSchema: AnalyzeFinancialDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
