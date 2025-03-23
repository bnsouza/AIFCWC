// ------------------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import {openai} from "@ai-sdk/openai";
import {generateObject} from "ai";
import dotenv from "dotenv";
import {z} from "zod";

// ------------------------------------------------------------------------------------------------
// Paths of the files
const envPath = path.join(path.resolve(), "..", "..", ".env");
const dataPath = path.join(path.resolve(), "..", "..", "data");

// ------------------------------------------------------------------------------------------------
// Load environment variables
dotenv.config({path: envPath});

// ------------------------------------------------------------------------------------------------
// Generate a list of football clubs based on their historical impact and relevance worldwide
const confDistribution = {
  UEFA: 55,
  CONMEBOL: 30,
  CONCACAF: 12,
  CAF: 12,
  AFC: 12,
  OFC: 7,
};

const generateClubsByConfederation = async (confederation: string, count: number) => {
  const {object} = await generateObject({
    model: openai("gpt-4-turbo"),
    system: `You are an expert in global football history and statistics. Your task is to provide exactly
    ${count} football clubs within the ${confederation} confederation, considering their historical impact,
    achievements, and significance.
    You must strictly follow these rules:
    1. The total number of clubs must be **exactly ${count}**.
    2. The distribution must be balanced, ensuring representation from the greatest clubs.
    3. If the number of clubs exceeds ${count}, remove less significant clubs while maintaining diversity.
    4. If there are fewer than ${count}, add historically relevant teams until the number is correct.
    5. Provide structured data including:
      - Full club name
      - Short club name
      - Country
      - Continent
      - Confederation
    Ensure that the response adheres strictly to these guidelines, and do not exceed or fall below ${count}.`,
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
    prompt: `Generate a structured list of **exactly ${count} football clubs** from the ${confederation}
    confederation. For each club, include: Full club name; Short club name; Country; Continent and Confederation. Ensure that
    the total count **is exactly ${count} clubs**. If necessary, adjust the list by removing or adding clubs
    based on historical relevance, but always maintain a fair representation and their relevance to the sport.`,
  });
  return object.teams;
};

const allTeams: any[] = [];
for (const [confederation, count] of Object.entries(confDistribution)) {
  const teams = await generateClubsByConfederation(confederation, count);
  if (teams && teams.length > count) {
    teams.splice(count);
  }
  allTeams.push(...teams);
}

// Save the generated object to a JSON file
fs.mkdirSync(dataPath, {recursive: true});
fs.writeFileSync(path.join(dataPath, "teams.json"), JSON.stringify(allTeams, null, 2));

console.log("Teams generated successfully!");
console.log(`Total teams generated: ${allTeams.length}`);
console.log(`Data saved to: ${dataPath}`);

// ------------------------------------------------------------------------------------------------
