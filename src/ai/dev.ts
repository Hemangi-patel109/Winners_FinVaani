'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-financial-data.ts';
import '@/ai/flows/plan-financial-goals.ts';
import '@/ai/flows/categorize-expenses.ts';
import '@/ai/flows/get-financial-insights.ts';
