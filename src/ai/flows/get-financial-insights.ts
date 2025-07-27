
'use server';

/**
 * @fileOverview An AI agent for advanced financial reasoning and insights.
 *
 * - getFinancialInsights - A function that handles various financial insight queries.
 * - GetFinancialInsightsInput - The input type for the getFinancialInsights function.
 * - GetFinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InsightTypeSchema = z.enum(['anomaly', 'risk', 'benchmark', 'what-if']);

const GetFinancialInsightsInputSchema = z.object({
  financialData: z
    .string()
    .describe('The user\'s financial data in JSON format, including transactions, assets, liabilities, and investments.'),
  query: z.string().describe('The user\'s specific question or the context for the insight (e.g., "Check for anomalies").'),
  personaPrompt: z.string().describe('A prompt defining the AI\'s persona (e.g., Friendly, Analytical, Strict).'),
  insightType: InsightTypeSchema.describe('The type of insight being requested.')
});
export type GetFinancialInsightsInput = z.infer<typeof GetFinancialInsightsInputSchema>;

const GetFinancialInsightsOutputSchema = z.object({
  insightType: InsightTypeSchema.describe('The type of insight that was generated.'),
  analysis: z.string().describe('The detailed analysis provided by the AI.'),
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('The overall sentiment of the analysis.'),
  recommendations: z.array(z.string()).describe('A list of actionable recommendations for the user.'),
});
export type GetFinancialInsightsOutput = z.infer<typeof GetFinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: GetFinancialInsightsInput): Promise<GetFinancialInsightsOutput> {
  return getFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFinancialInsightsPrompt',
  input: {schema: GetFinancialInsightsInputSchema},
  output: {schema: GetFinancialInsightsOutputSchema},
  prompt: `
    {{personaPrompt}}

    You are an expert financial advisor. Analyze the provided financial data to answer the user's query. Your response should be tailored to the requested insight type.

    Financial Data:
    {{{financialData}}}

    User Query: "{{query}}"
    Insight Type: {{insightType}}

    Based on your analysis:
    1.  Provide a detailed 'analysis' of the situation.
    2.  Set the 'sentiment' of your analysis: 'positive' for good news or opportunities, 'negative' for risks or problems, and 'neutral' for informational insights.
    3.  Generate a list of 2-3 actionable 'recommendations'.
    4.  Set the 'insightType' field in your response to match the user's request.

    - For 'anomaly' detection: Look for significant deviations from past spending, unusual transactions, or potential signs of fraud.
    - For 'risk' assessment: Evaluate portfolio balance, debt levels, and emergency fund adequacy.
    - For 'benchmark' comparisons: Compare the user's financial habits (e.g., spending, saving) to general rules of thumb or demographic averages. You can invent plausible averages for the comparison.
    - For 'what-if' scenarios: Model the potential outcomes of hypothetical financial decisions, like changing investments or savings rates.
  `,
});

const getFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'getFinancialInsightsFlow',
    inputSchema: GetFinancialInsightsInputSchema,
    outputSchema: GetFinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
