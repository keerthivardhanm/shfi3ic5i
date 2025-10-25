'use server';

/**
 * @fileOverview Generates a summary of events in a specific zone during a specific time period.
 *
 * - generateZoneSummary - A function that generates the zone summary.
 * - GenerateZoneSummaryInput - The input type for the generateZoneSummary function.
 * - GenerateZoneSummaryOutput - The return type for the generateZoneSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateZoneSummaryInputSchema = z.object({
  zoneId: z.string().describe('The ID of the zone to summarize.'),
  startTime: z.string().describe('The start time for the summary period (ISO format).'),
  endTime: z.string().describe('The end time for the summary period (ISO format).'),
});

export type GenerateZoneSummaryInput = z.infer<typeof GenerateZoneSummaryInputSchema>;

const GenerateZoneSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of events in the specified zone during the specified time period.'),
});

export type GenerateZoneSummaryOutput = z.infer<typeof GenerateZoneSummaryOutputSchema>;

export async function generateZoneSummary(input: GenerateZoneSummaryInput): Promise<GenerateZoneSummaryOutput> {
  return generateZoneSummaryFlow(input);
}

const generateZoneSummaryPrompt = ai.definePrompt({
  name: 'generateZoneSummaryPrompt',
  input: {schema: GenerateZoneSummaryInputSchema},
  output: {schema: GenerateZoneSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing events within a specific zone during a given time period.

  Zone ID: {{{zoneId}}}
  Start Time: {{{startTime}}}
  End Time: {{{endTime}}}

  Provide a concise summary of notable events, including crowd density fluctuations, SOS incidents, and any other relevant occurrences within the specified zone and time frame. `,
});

const generateZoneSummaryFlow = ai.defineFlow(
  {
    name: 'generateZoneSummaryFlow',
    inputSchema: GenerateZoneSummaryInputSchema,
    outputSchema: GenerateZoneSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateZoneSummaryPrompt(input);
    return output!;
  }
);
