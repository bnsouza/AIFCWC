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
const teamsPath = path.join(path.resolve(), "..", "..", "data", "teams.json");

// ------------------------------------------------------------------------------------------------
// Load environment variables
dotenv.config({path: envPath});

// ------------------------------------------------------------------------------------------------
// Read the teams data from JSON file
const teamsData = JSON.parse(fs.readFileSync(teamsPath, "utf-8"));

// ------------------------------------------------------------------------------------------------
// Function to generate club details and historical lineup for each team
const generateClubData = async (team: string) => {
  // Team information
  const {object: clubDetails} = await generateObject({
    model: openai("gpt-4-turbo"),
    system: `You are an expert in football club history. Provide detailed information for the club named ${team}.`,
    schema: z.object({
      foundationDate: z.string(),
      city: z.string(),
      fullName: z.string(),
      shortName: z.string(),
      stadium: z.object({
        name: z.string(),
        capacity: z.number(),
      }),
      socialMedia: z.object({
        instagram: z.string(),
        tiktok: z.string(),
      }),
      colors: z.object({
        home: z.object({
          bgColor: z.string(),
          fontColor: z.string(),
        }),
        away: z.object({
          bgColor: z.string(),
          fontColor: z.string(),
        }),
      }),
    }),
    prompt: `Provide the following details for the football club named ${team}: foundationDate, city, fullName,
    shortName, stadium (name and capacity), socialMedia (Instagram and TikTok handles) and colors (home and away).
    The colors should include background and font colors based on the club's official kit and must be in "oklch" format.
    The colors must be different for home and away kits and must have a minimum contrast ratio of 4.5:1.`,
  });

  // Historical lineup
  const {object: historicalLineup} = await generateObject({
    model: openai("gpt-4-turbo"),
    system: `You are an expert football historian and analyst. Your task is to find the best historical lineup
    for the club named "${team}", ensuring that all players in the lineup have played together in at least one
    official match. The ideal match should be one of the most iconic games in the club’s history,
    such as a major final or a defining victory.
    Guidelines:
    - The lineup should come from a real match where all selected players were on the field together.
    - Prioritize finals of major competitions (Champions League, Copa Libertadores, domestic leagues, etc.).
    - Use the tactical formation that was employed in that season.
    - List all players and their respective positions. You MUST include the 11 starters and up to 9 substitutes.
    - The minimum number of players is 15, and the maximum is 20.
    - To each player, you must assign the position they played in that season.
    - Indicate the coach of the team.

    The position abbreviations you MUST use are:
    - \`GK\`: Goalkeeper
    - \`CB\`: Center-back
    - \`RB\`: Right-back
    - \`LB\`: Left-back
    - \`CDM\`: Central defensive midfielder
    - \`CM\`: Central midfielder
    - \`CAM\`: Central attacking midfielder
    - \`RW\`: Right winger
    - \`LW\`: Left winger
    - \`ST\`: Striker
    - \`CF\`: Center forward
    `,
    schema: z.object({
      year: z.number(),
      coach: z.string(),
      formation: z.string(),
      players: z
        .array(
          z.object({
            name: z.string(),
            position: z.enum(["GK", "CB", "RB", "LB", "CDM", "CM", "CAM", "RW", "LW", "ST", "CF"]),
          })
        )
        .min(15)
        .max(20),
      explanation: z.string(),
    }),
    prompt: `Find the best-ever lineup for "${team}", where all players were on the field together in an official match.
    Criteria:
    - Choose the most significant game in the club's history.
    - Provide the exact starting XI with their positions in the formation used that day.
    - Explain why this lineup was historically important.
    - If multiple matches qualify, select the one where the team performed at its peak.`,
  });

  return {clubDetails, historicalLineup};
};

// ------------------------------------------------------------------------------------------------
// Process each team and save the data into respective JSON files
for (const team of teamsData) {
  const {clubDetails, historicalLineup} = await generateClubData(team.name);

  const teamNamePascal = clubDetails.shortName
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  const teamDir = path.join(path.resolve(), "..", "..", "data", "teams", teamNamePascal);

  fs.mkdirSync(teamDir, {recursive: true});

  fs.writeFileSync(path.join(teamDir, "info.json"), JSON.stringify(clubDetails, null, 2));
  fs.writeFileSync(path.join(teamDir, "squad.json"), JSON.stringify(historicalLineup, null, 2));
}

// Log the status after generating the data
console.log("Team data generated successfully!");

// ------------------------------------------------------------------------------------------------
