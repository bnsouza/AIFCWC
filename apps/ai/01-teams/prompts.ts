// ------------------------------------------------------------------------------------------------

import {openai} from "@ai-sdk/openai";
import {generateObject} from "ai";
import {logAIGeneration} from "utils/logger.js";
import {z} from "zod";

// ------------------------------------------------------------------------------------------------
// Generate clubs by confederation
export const generateClubsByConfederation = async (confederation: string, count: number) => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    `You are an expert in global football history and statistics. Your task is ` +
    `to provide exactly ${count} football clubs within the ${confederation} confederation, ` +
    `considering their historical impact, achievements, and significance.\n` +
    `You must strictly follow these rules:\n` +
    `  1. The total number of clubs must be **exactly ${count}**.\n` +
    `  2. The distribution must be balanced, ensuring representation from the greatest clubs.\n` +
    `  3. If the number of clubs exceeds ${count}, remove less significant clubs while maintaining diversity.\n` +
    `  4. If there are fewer than ${count}, add historically relevant teams until the number is correct.\n` +
    `  5. Provide structured data including:\n` +
    `    - Full club name\n` +
    `    - Short club name\n` +
    `    - Country\n` +
    `    - Continent\n` +
    `    - Confederation\n` +
    `Ensure that the response adheres strictly to these guidelines, and do not exceed or fall below ${count}.`;

  // User Prompt: Specifies the user's request
  const userPrompt =
    `Generate a structured list of **exactly ${count} football clubs** from the ` +
    `${confederation} confederation. For each club, include: Full club name; Short club name; Country; ` +
    `Continent and Confederation. Ensure that the total count **is exactly ${count} clubs**. If necessary, ` +
    `adjust the list by removing or adding clubs based on historical relevance, but always maintain a fair ` +
    `representation and their relevance to the sport.`;

  // Generate the object
  const result = await generateObject({
    model: openai("gpt-4.5-preview"),
    system: systemPrompt,
    schema: z.object({
      teams: z.array(
        z.object({
          name: z.string(),
          shortName: z.string(),
          country: z.string(),
          continent: z.string(),
          confederation: z.enum(["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"]),
        })
      ),
    }),
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `${confederation}-ClubsByConfederation`,
    system: systemPrompt,
    prompt: userPrompt,
    result: result.object.teams,
    response: {
      id: result.response?.id ?? "unknown",
      model: result.response?.modelId ?? "unknown",
      timestamp: result.response?.timestamp?.toISOString() ?? new Date().toISOString(),
      body: result.response?.body,
      headers: result.response?.headers,
    },
  });

  // Return the generated object
  return result.object.teams;
};

// ------------------------------------------------------------------------------------------------
