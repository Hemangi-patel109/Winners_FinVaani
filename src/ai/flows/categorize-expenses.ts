'use server';

/**
 * @fileOverview A flow for categorizing expenses from voice input in English or Hindi.
 *
 * - categorizeExpense - A function that takes voice input and categorizes the expense.
 * - CategorizeExpenseInput - The input type for the categorizeExpense function.
 * - CategorizeExpenseOutput - The return type for the categorizeExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseInputSchema = z.object({
  voiceInput: z
    .string()
    .describe('The voice input in English or Hindi to be transcribed and categorized.'),
});
export type CategorizeExpenseInput = z.infer<typeof CategorizeExpenseInputSchema>;

const CategorizeExpenseOutputSchema = z.object({
  category: z.string().describe('The category of the expense (e.g., Food, Transportation, Utilities).'),
  amount: z.number().optional().describe('The amount of the expense, if specified in the voice input.'),
  description: z.string().optional().describe('A description of the expense based on the voice input.'),
});
export type CategorizeExpenseOutput = z.infer<typeof CategorizeExpenseOutputSchema>;

export async function categorizeExpense(input: CategorizeExpenseInput): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: CategorizeExpenseInputSchema},
  output: {schema: CategorizeExpenseOutputSchema},
  prompt: `You are a personal finance assistant that categorizes expenses from voice inputs in English or Hindi. The transcribed audio may be imperfect, containing misspellings or unclear phrases. Do your best to interpret the user's intent.

  Analyze the following voice input and extract the expense category, amount (if specified), and a brief description.
  Respond in JSON format.

  Voice Input: {{{voiceInput}}}
  
  Here are the possible expense categories:
  - Food
  - Transportation
  - Utilities
  - Entertainment
  - Shopping
  - Travel
  - Education
  - Healthcare
  - Rent
  - Other

  If the amount is specified, extract it and include it in the output. If a specific category isn't obvious, select "Other" and include a description.
  `, 
});

const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: CategorizeExpenseInputSchema,
    outputSchema: CategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
