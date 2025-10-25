import { config } from 'dotenv';
config();

import '@/ai/flows/predict-overcrowding.ts';
import '@/ai/flows/generate-zone-summary.ts';