'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting potential overcrowding situations based on crowd density and velocity.
 *
 * - predictOvercrowding - A function that handles the prediction of overcrowding.
 * - PredictOvercrowdingInput - The input type for the predictOvercrowding function.
 * - PredictOvercrowdingOutput - The return type for the predictOvercrowding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictOvercrowdingInputSchema = z.object({
  zoneId: z.string().describe('The ID of the zone to analyze.'),
  currentDensity: z.number().describe('The current crowd density in the zone (people per square meter).'),
  crowdVelocity: z.number().describe('The average crowd velocity in the zone (meters per minute).'),
  capacityLimit: z.number().describe('The maximum capacity of the zone.'),
  historicalData: z.string().optional().describe('JSON string containing historical data of crowd density and velocity in the zone.'),
});

export type PredictOvercrowdingInput = z.infer<typeof PredictOvercrowdingInputSchema>;

const PredictOvercrowdingOutputSchema = z.object({
  isOvercrowdingPredicted: z.boolean().describe('Whether overcrowding is predicted in the zone.'),
  predictionConfidence: z.number().describe('The confidence level of the overcrowding prediction (0 to 1).'),
  timeToOvercrowding: z.number().optional().describe('The estimated time in minutes until overcrowding occurs.'),
  suggestedActions: z.array(z.string()).describe('A list of suggested actions to prevent overcrowding.'),
});

export type PredictOvercrowdingOutput = z.infer<typeof PredictOvercrowdingOutputSchema>;

export async function predictOvercrowding(input: PredictOvercrowdingInput): Promise<PredictOvercrowdingOutput> {
  return predictOvercrowdingFlow(input);
}

const predictOvercrowdingPrompt = ai.definePrompt({
  name: 'predictOvercrowdingPrompt',
  input: {schema: PredictOvercrowdingInputSchema},
  output: {schema: PredictOvercrowdingOutputSchema},
  prompt: `You are an expert in crowd management and safety.

  Analyze the current crowd density, velocity, and historical data to predict potential overcrowding in a specific zone.

  Current Zone ID: {{{zoneId}}}
  Current Density: {{{currentDensity}}} people per square meter
  Crowd Velocity: {{{crowdVelocity}}} meters per minute
  Zone Capacity Limit: {{{capacityLimit}}} people
  Historical Data (optional): {{{historicalData}}}

  Based on this information, determine if overcrowding is likely to occur.
  If overcrowding is predicted, estimate the time until it occurs and suggest actions to mitigate the risk.

  Consider factors such as:
  - Rate of increase in density
  - Crowd flow patterns
  - Proximity to capacity limit
  - Historical overcrowding events

  Return the following information:
  - isOvercrowdingPredicted: true if overcrowding is predicted, false otherwise.
  - predictionConfidence: A number between 0 and 1 indicating the confidence level of the prediction.
  - timeToOvercrowding (optional): The estimated time in minutes until overcrowding occurs.
  - suggestedActions: A list of suggested actions to prevent overcrowding (e.g., "Increase security presence", "Redirect crowd flow", "Close zone entrances").
  Remember to set isOvercrowdingPredicted to false if the zone is far from being overcrowded, and in that case, suggested actions should be an empty array.
`,
});

const predictOvercrowdingFlow = ai.defineFlow(
  {
    name: 'predictOvercrowdingFlow',
    inputSchema: PredictOvercrowdingInputSchema,
    outputSchema: PredictOvercrowdingOutputSchema,
  },
  async input => {
    const {output} = await predictOvercrowdingPrompt(input);
    return output!;
  }
);
