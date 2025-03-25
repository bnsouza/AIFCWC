// ------------------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {pascalCase} from "utils/functions.js";

import {TeamSchema} from "./attributes.js";
import {generateClubInfo, generateCoach, generatePlayer, generateTeamSquad, generateTechnicalStaff} from "./prompts.js";

// ------------------------------------------------------------------------------------------------
// Paths of the files
const envPath = path.join(path.resolve(), "..", "..", ".env");
const teamsPath = path.join(path.resolve(), "..", "..", "data", "teams.json");

// ------------------------------------------------------------------------------------------------
// Load environment variables
dotenv.config({path: envPath});

// ------------------------------------------------------------------------------------------------
// Read the teams data from JSON file
export const teamsData = JSON.parse(fs.readFileSync(teamsPath, "utf-8"));

// ------------------------------------------------------------------------------------------------
// Select a random team
let randomTeam, randomTeamDir;

while (true) {
  randomTeam = teamsData[Math.floor(Math.random() * teamsData.length)];
  randomTeamDir = path.join(path.resolve(), "..", "..", "data", "teams", pascalCase(randomTeam.shortName));

  if (!fs.existsSync(randomTeamDir)) {
    fs.mkdirSync(randomTeamDir, {recursive: true});
    console.log(`Selected team: ${randomTeam.shortName}`);
    break;
  }
}

// Generate the team data and save it into a JSON file
const clubInfo = await generateClubInfo(randomTeam.shortName, randomTeam.country, randomTeam.confederation);
const teamSquad = await generateTeamSquad(randomTeam.shortName, randomTeam.country, randomTeam.confederation);

fs.writeFileSync(path.join(randomTeamDir, "info.json"), JSON.stringify(clubInfo, null, 2));
fs.writeFileSync(path.join(randomTeamDir, "squad.json"), JSON.stringify(teamSquad, null, 2));

// Team data
const teamName = randomTeam.shortName;
const teamYear = teamSquad.year;
const teamPlayers = teamSquad.players;
const teamCoach = teamSquad.coach;
const teamFormation = teamSquad.formation;

// Generate player data for each player in the squad
let playersData = [];
for (const player of teamPlayers) {
  const playerData = await generatePlayer(teamYear, teamName, player.name, player.position);
  playersData.push(playerData);
}

// Generate the final team data
const teamAttrs = {
  year: teamYear as number,
  coach: await generateCoach(teamYear, teamName, teamCoach),
  formation: teamFormation,
  players: playersData,
  technicalStaff: await generateTechnicalStaff(teamYear, teamName),
};

// Validate the team data
if (!TeamSchema.parse(teamAttrs)) {
  throw new Error("Team data validation failed.");
}

// Save the team data into a JSON file
const teamAttributesPath = path.join(randomTeamDir, "attributes.json");
fs.writeFileSync(teamAttributesPath, JSON.stringify(teamAttrs, null, 2));

console.log(`Team data for ${teamName} saved successfully at ${teamAttributesPath}.`);

// ------------------------------------------------------------------------------------------------
