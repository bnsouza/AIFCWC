// ------------------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { generateClubsSelection } from "./prompts.js";

// ------------------------------------------------------------------------------------------------
// Paths of the files
const envPath = path.join(path.resolve(), "..", "..", ".env");
const dataPath = path.join(path.resolve(), "..", "..", "data");

// ------------------------------------------------------------------------------------------------
// Load environment variables
dotenv.config({ path: envPath });

// ------------------------------------------------------------------------------------------------
// Generate a list of football clubs based on their historical impact and relevance worldwide
const teams = await generateClubsSelection();

// Save the generated object to a JSON file
fs.mkdirSync(dataPath, { recursive: true });
fs.writeFileSync(path.join(dataPath, "teams.json"), JSON.stringify(teams, null, 2));

console.log("Teams generated successfully!");
console.log(`Total teams generated: ${teams.length}`);
console.log(`Data saved to: ${dataPath}`);

// ------------------------------------------------------------------------------------------------
