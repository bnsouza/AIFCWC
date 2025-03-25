// ------------------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import {generateClubsByConfederation} from "./prompts.js";

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
