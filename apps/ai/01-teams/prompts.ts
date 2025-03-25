// ------------------------------------------------------------------------------------------------

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { logAIGeneration } from "utils/logger.js";
import { z } from "zod";

// ------------------------------------------------------------------------------------------------
// Generate the selection of football clubs based on their historical impact and relevance worldwide
export const generateClubsSelection = async () => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    "You are an expert in global football history and statistics. Your task is to provide the " +
    "exact quantity of solicited teams, considering their historical impact, achievements, and " +
    "significance. The list must be balanced and representative of the most important clubs in the world.";

  // User Prompt: Specifies the user's request
  const userPrompt =
    "Ensure you provide a list of exactly 128 different football clubs, considering their historical " +
    "impact, achievements, and worldwide diversity. Include at least two clubs from each confederation.\n\n" +
    "You must strictly follow these rules:\n" +
    "1. The total number of clubs must be **exactly 128**.\n" +
    "2. No club can be repeated.\n" +
    "3. Each confederation can have a maximum of 60 clubs.\n" +
    "4. Ensure at least four clubs from each continental confederation.\n" +
    "5. Balance the distribution to maintain worldwide diversity and accurately represent significant clubs.\n" +
    "6. If the number of clubs exceeds 128, remove less significant clubs while maintaining diversity.\n" +
    "7. If there are fewer than 128, add historically relevant teams until the number is correct.\n" +
    "8. Provide the data in a structured JSON format including:\n" +
    "  - Rank\n" +
    "  - Full club name\n" +
    "  - Short club name\n" +
    "  - Country\n" +
    "  - Continent\n" +
    "  - Confederation\n" +
    "  - Explanation of significance\n\n" +
    "Ensure that the response strictly adheres to these guidelines, with no more and no fewer than 128 clubs.";

  // Generate the object
  const result = await generateObject({
    model: openai("o1"),
    system: systemPrompt,
    schema: z.object({
      teams: z.array(
        z.object({
          rank: z.number(),
          fullName: z.string(),
          shortName: z.string(),
          country: z.string(),
          continent: z.string(),
          confederation: z.enum(["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"]),
          explanation: z.string(),
        })
      ),
    }),
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `clubsSelection`,
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
