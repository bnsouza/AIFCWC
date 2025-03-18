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
const teamsPath = path.join(path.resolve(), "..", "..", "data", "teams");

// ------------------------------------------------------------------------------------------------
// Load environment variables
dotenv.config({path: envPath});

// ------------------------------------------------------------------------------------------------
// Physical, Mental, and Technical attributes (common to all players)
const PhysicalSchema = z.object({
  speed: z.number().min(0).max(100),
  stamina: z.number().min(0).max(100),
  strength: z.number().min(0).max(100),
  injuryProne: z.number().min(0).max(100),
});

const MentalSchema = z.object({
  composure: z.number().min(0).max(100),
  leadership: z.number().min(0).max(100),
  creativity: z.number().min(0).max(100),
  aggressiveness: z.number().min(0).max(100),
  teamwork: z.number().min(0).max(100),
});

const TechnicalSchema = z.object({
  ballControl: z.number().min(0).max(100),
  passing: z.number().min(0).max(100),
  finishing: z.number().min(0).max(100),
  heading: z.number().min(0).max(100),
  marking: z.number().min(0).max(100),
});

// Position-specific attributes (fixed for each position)
const PositionSpecificSchemaGK = z.object({
  reflexes: z.number().min(0).max(100),
  ballDistribution: z.number().min(0).max(100),
});
const PositionSpecificSchemaCB = z.object({
  defensivePositioning: z.number().min(0).max(100),
  aerialDuels: z.number().min(0).max(100),
});
const PositionSpecificSchemaRB = z.object({
  attackingSupport: z.number().min(0).max(100),
  crossing: z.number().min(0).max(100),
});
const PositionSpecificSchemaLB = z.object({
  attackingSupport: z.number().min(0).max(100),
  crossing: z.number().min(0).max(100),
});
const PositionSpecificSchemaCDM = z.object({
  interception: z.number().min(0).max(100),
  tackling: z.number().min(0).max(100),
});
const PositionSpecificSchemaCM = z.object({
  vision: z.number().min(0).max(100),
  shortPassing: z.number().min(0).max(100),
});
const PositionSpecificSchemaCAM = z.object({
  creativity: z.number().min(0).max(100),
  throughPassing: z.number().min(0).max(100),
});
const PositionSpecificSchemaRW = z.object({
  dribblingSpeed: z.number().min(0).max(100),
  offensiveMovement: z.number().min(0).max(100),
});
const PositionSpecificSchemaLW = z.object({
  dribblingSpeed: z.number().min(0).max(100),
  offensiveMovement: z.number().min(0).max(100),
});
const PositionSpecificSchemaST = z.object({
  aerialDuels: z.number().min(0).max(100),
  holdUpPlay: z.number().min(0).max(100),
});
const PositionSpecificSchemaCF = z.object({
  finishing: z.number().min(0).max(100),
  offTheBallMovement: z.number().min(0).max(100),
});

const PositionSpecificSchema = z.union([
  PositionSpecificSchemaGK,
  PositionSpecificSchemaCB,
  PositionSpecificSchemaRB,
  PositionSpecificSchemaLB,
  PositionSpecificSchemaCDM,
  PositionSpecificSchemaCM,
  PositionSpecificSchemaCAM,
  PositionSpecificSchemaRW,
  PositionSpecificSchemaLW,
  PositionSpecificSchemaST,
  PositionSpecificSchemaCF,
]);

// Define special skills as a fixed set of known abilities
const SpecialSkillSchema = z.enum([
  "AcrobaticKeeper",
  "AerialDominance",
  "AgelessWonder",
  "BigGameMentality",
  "BoxToBox",
  "Captain",
  "Chameleon",
  "ClinicalFinisher",
  "ClutchPerformer",
  "CompleteDefender",
  "CompleteForward",
  "ComposureKing",
  "CounterAttackKing",
  "CrossingExpert",
  "DeepLyingPlaymaker",
  "DefensiveGeneral",
  "DefensiveRock",
  "DribbleSprint",
  "DribblingMaestro",
  "DribblingTank",
  "Engine",
  "FalseNine",
  "FinesseShotSpecialist",
  "FirstTouchMaestro",
  "FlairPlayer",
  "FootballIQ",
  "FoxInTheBox",
  "FreekickMaster",
  "GameChanger",
  "GameReader",
  "GeniusPasser",
  "GoalPoacher",
  "GoldenGlove",
  "HeaderSpecialist",
  "HotHead",
  "KnuckleballExpert",
  "Libero",
  "LongPassingWizard",
  "LongThrowExpert",
  "MasterProvocateur",
  "MidfieldMaestro",
  "NoLookPassMaster",
  "OffsideTrapExpert",
  "OneManArmy",
  "OneTouchFinisher",
  "PenaltySpecialist",
  "PhysicalBeast",
  "Playmaker",
  "PlayoffPerformer",
  "Poacher",
  "PowerShot",
  "PressingMonster",
  "Regen",
  "Regista",
  "RelentlessRunner",
  "SambaStyle",
  "SetPieceSpecialist",
  "ShadowStriker",
  "SleightOfFoot",
  "SlidingTackleAce",
  "Sniper",
  "SoloRunSpecialist",
  "Speedster",
  "StreetFootballer",
  "SuperSub",
  "TacklingMachine",
  "TacticalBrain",
  "TargetMan",
  "TechnicalDribbler",
  "TempoController",
  "ThroughBallMaster",
  "TrivelaMaster",
  "Visionary",
  "VolleySpecialist",
  "WingWizard",
  "Wonderkid",
]);

const PositionEnum = z.enum(["GK", "CB", "RB", "LB", "CDM", "CM", "CAM", "RW", "LW", "ST", "CF"]);

// ------------------------------------------------------------------------------------------------
// Player schema with position validation
const PlayerSchema = z.object({
  name: z.string(),
  position: PositionEnum,
  attributes: z.object({
    physical: PhysicalSchema,
    mental: MentalSchema,
    technical: TechnicalSchema,
    positionSpecific: PositionSpecificSchema,
    specialSkill: SpecialSkillSchema.optional(),
  }),
});

// ------------------------------------------------------------------------------------------------
// Coach schema
const CoachSchema = z.object({
  name: z.string(),
  attributes: z.object({
    tactical: z.object({
      offensiveStrategy: z.number().min(0).max(100),
      defensiveStrategy: z.number().min(0).max(100),
      tacticalAdaptability: z.number().min(0).max(100),
      pressing: z.number().min(0).max(100),
      transitionPlay: z.number().min(0).max(100),
    }),
    management: z.object({
      motivation: z.number().min(0).max(100),
      lockerRoomManagement: z.number().min(0).max(100),
      discipline: z.number().min(0).max(100),
    }),
    media: z.object({
      mediaInteraction: z.number().min(0).max(100),
      crisisManagement: z.number().min(0).max(100),
    }),
  }),
});

// ------------------------------------------------------------------------------------------------
// Technical Staff Schema
const TechnicalStaffSchema = z.object({
  fitnessRecovery: z.number().min(0).max(100),
  staminaBoost: z.number().min(0).max(100),
  injuryPrevention: z.number().min(0).max(100),
  medicalResponse: z.number().min(0).max(100),
});

// ------------------------------------------------------------------------------------------------
// Root schema
const TeamSchema = z.object({
  year: z.number(),
  coach: CoachSchema,
  formation: z.string(),
  players: z.array(PlayerSchema),
  technicalStaff: TechnicalStaffSchema,
});

// ------------------------------------------------------------------------------------------------
// Generate Coach attributes based on the year and team
const generateCoach = async (year: number, team: string, name: string) => {
  const {object} = await generateObject({
    model: openai("gpt-4-turbo"),
    system:
      "**You are a specialized AI assistant designed to generate detailed and precise attributes for " +
      "football coaches. Coaches define the tactical identity and management style of a team. " +
      "Each attribute is rated from 1 to 100.**\n\n" +
      "# Coach Attributes\n\n" +
      "## Tactical Attributes\n\n" +
      "| **Attribute**          | **Description**                                          |\n" +
      "| ---------------------- | -------------------------------------------------------- |\n" +
      "| `offensiveStrategy`    | Ability to set up attacking plays.                       |\n" +
      "| `defensiveStrategy`    | Skill in organizing a solid defense.                     |\n" +
      "| `tacticalAdaptability` | Ability to adjust the team’s strategy during a match.    |\n" +
      "| `pressing`             | Level of intensity in applying pressure on the opponent. |\n" +
      "| `transitionPlay`       | Effectiveness in switching between attack and defense.   |\n\n" +
      "## Squad Management\n\n" +
      "| **Attribute**            | **Description**                                        |\n" +
      "| ------------------------ | ------------------------------------------------------ |\n" +
      "| `motivation`             | Ability to inspire and push players to perform better. |\n" +
      "| `locker_room_management` | Skill in managing egos and maintaining team harmony.   |\n" +
      "| `discipline`             | Enforcing order and keeping players focused.           |\n\n" +
      "## Media Handling\n\n" +
      "| **Attribute**       | **Description**                                     |\n" +
      "| ------------------- | --------------------------------------------------- |\n" +
      "| `media_interaction` | Ability to handle press conferences and interviews. |\n" +
      "| `crisis_management` | Keeping composure during difficult situations.      |",
    schema: CoachSchema,
    prompt: `Generate attributes for a football coach based on the following details:
    -	Coach Name: ${name}
    -	Club: ${team}
    -	Year: ${year}`,
  });

  return object;
};

// ------------------------------------------------------------------------------------------------
// Generate player attributes based on the club, year, and position
const generatePlayer = async (year: number, team: string, name: string, position: string) => {
  const {object} = await generateObject({
    model: openai("gpt-4-turbo"),
    system:
      "**You are a highly specialized AI assistant designed to generate detailed and precise " +
      "attributes for football players. Your task is to create player profiles based on their club, " +
      "year, and position, while considering their real-life playing style and strengths. Each player " +
      "should be realistically represented according to historical records, statistics, and expert " +
      "football analysis. You will follow a structured format and ensure that the generated attributes " +
      "align with the player’s known abilities. Each attribute is rated from 1 to 100.**\n\n" +
      "# Player Attributes\n\n" +
      "## General Attributes (All Players)\n\n" +
      "Players have three categories of attributes: Physical, Mental, and Technical.\n\n" +
      "### Physical Attributes " +
      "| **Attribute** | **Description**                                                     |\n" +
      "| ------------- | ------------------------------------------------------------------- |\n" +
      "| `speed`       | Maximum running speed.                                              |\n" +
      "| `stamina`     | Endurance and ability to sustain performance throughout the match.  |\n" +
      "| `strength`    | Physical power in duels and challenges.                             |\n" +
      "| `injuryProne` | Likelihood of injuries (higher value means more frequent injuries). |\n\n" +
      "### Mental Attributes\n\n" +
      "| **Attribute**    | **Description**                                      |\n" +
      "| ---------------- | ---------------------------------------------------- |\n" +
      "| `composure`      | Ability to perform under pressure.                   |\n" +
      "| `leadership`     | Influence on teammates and team morale.              |\n" +
      "| `creativity`     | Ability to improvise and make unexpected plays.      |\n" +
      "| `aggressiveness` | Intensity and commitment in challenges.              |\n" +
      "| `teamwork`       | Tactical awareness and collaboration with teammates. |\n\n" +
      "### Technical Attributes\n\n" +
      "| **Attribute** | **Description**                                 |\n" +
      "| ------------- | ----------------------------------------------- |\n" +
      "| `ballControl` | Ability to handle and maneuver the ball.        |\n" +
      "| `passing`     | Precision and variety of passing.               |\n" +
      "| `finishing`   | Shooting accuracy and effectiveness in scoring. |\n" +
      "| `heading`     | Ability to contest aerial duels.                |\n" +
      "| `marking`     | Defensive skill in stopping opponents.          |\n\n" +
      "---\n" +
      "## Position - Specific Attributes\n\n" +
      "Each player has two additional attributes based on their position, ensuring role differentiation.\n\n" +
      "| **Position**               | **Attribute 1**        | **Attribute 2**      |\n" +
      "| -------------------------- | ---------------------- | -------------------- |\n" +
      "| Goalkeeper (GK)            | `reflexes`             | `ballDistribution`   |\n" +
      "| Center Back (CB)           | `defensivePositioning` | `aerialDuels`        |\n" +
      "| Right/Left Back (RB/LB)    | `attackingSupport`     | `crossing`           |\n" +
      "| Defensive Midfielder (CDM) | `interception`         | `tackling`           |\n" +
      "| Central Midfielder (CM)    | `vision`               | `shortPassing`       |\n" +
      "| Attacking Midfielder (CAM) | `throughPassing`       | `longShoot`          |\n" +
      "| Right/Left Wing (RW/LW)    | `dribblingSpeed`       | `offensiveMovement`  |\n" +
      "| Striker (ST)               | `aerialDuels`          | `holdUpPlay`         |\n" +
      "| Forward (CF)               | `finishing`            | `offTheBallMovement` |\n\n" +
      "---\n\n" +
      "## Special Skill(Unique Ability)\n\n" +
      "Each player can have an unique special skill, representing something iconic about their playing style. " +
      "This skill is not directly related to other attributes but adds a unique flavor to the player's profile. " +
      "Only a few players can have this special skill, making them stand out from the rest. This special skill " +
      "can significantly influence a player's performance in specific situations. Additionally, the presence of " +
      "a special skill can enhance a player's effectiveness in critical moments during matches.\n\n" +
      "### List of Special Skills\n\n" +
      "| Special Attribute       | Description                                                                   |\n" +
      "| ----------------------- | ----------------------------------------------------------------------------- |\n" +
      "| `AcrobaticKeeper`       | A goalkeeper known for incredible reflex saves and acrobatic movements.       |\n" +
      "| `AerialDominance`       | Wins almost every aerial duel, both offensively and defensively.              |\n" +
      "| `AgelessWonder`         | Maintains peak performance well beyond the usual age decline.                 |\n" +
      "| `BigGameMentality`      | Thrives in finals and decisive matches, performing at their best.             |\n" +
      "| `BoxToBox`              | Covers every blade of grass, contributing both defensively and offensively.   |\n" +
      "| `Captain`               | A natural leader on and off the pitch, inspiring teammates with presence.     |\n" +
      "| `Chameleon`             | Can seamlessly adapt to multiple tactical systems and positions.              |\n" +
      "| `ClinicalFinisher`      | Highly efficient in front of goal, rarely misses a clear chance.              |\n" +
      "| `ClutchPerformer`       | Always delivers in crucial moments, excelling under pressure.                 |\n" +
      "| `CompleteDefender`      | Excels in all defensive aspects, from tackling to positioning.                |\n" +
      "| `CompleteForward`       | A striker who can do it all—finishing, passing, dribbling, and positioning.   |\n" +
      "| `ComposureKing`         | Remains unfazed under pressure, always making the right decision.             |\n" +
      "| `CounterAttackKing`     | Excels in fast transitions, deadly on the break.                              |\n" +
      "| `CrossingExpert`        | Delivers pinpoint crosses into dangerous areas with consistency.              |\n" +
      "| `DeepLyingPlaymaker`    | Creates attacks from deep positions, distributing passes with vision.         |\n" +
      "| `DefensiveGeneral`      | Commands the backline, organizing the defense with authority.                 |\n" +
      "| `DefensiveRock`         | A defensive wall, almost impossible to get past.                              |\n" +
      "| `DribbleSprint`         | Excels at sprinting while dribbling, maintaining control even at high speeds. |\n" +
      "| `DribblingMaestro`      | A true artist with the ball, mesmerizing defenders with unmatched dribbling.  |\n" +
      "| `DribblingTank`         | Combines power and control, bulldozing past defenders.                        |\n" +
      "| `Engine`                | Tireless work rate, constantly running and pressing throughout the game.      |\n" +
      "| `FalseNine`             | A forward who drops deep to create space and link up play.                    |\n" +
      "| `FinesseShotSpecialist` | Master of bending shots into the corners with precision.                      |\n" +
      "| `FirstTouchMaestro`     | Exceptional control on first touch, setting up perfect plays.                 |\n" +
      "| `FlairPlayer`           | A showman, performing dazzling skills and entertaining the crowd.             |\n" +
      "| `FootballIQ`            | Superior understanding of tactics, positioning, and in-game adaptability.     |\n" +
      "| `FoxInTheBox`           | A penalty area predator, lethal in tight spaces.                              |\n" +
      "| `FreekickMaster`        | A dead-ball specialist, capable of scoring and assisting from free kicks.     |\n" +
      "| `GameChanger`           | Capable of turning the tide of a match with a single moment of brilliance.    |\n" +
      "| `GameReader`            | Anticipates opponents’ moves before they happen.                              |\n" +
      "| `GeniusPasser`          | Able to execute extraordinary passes that no one else sees.                   |\n" +
      "| `GoalPoacher`           | Always in the right place at the right time to score opportunistic goals.     |\n" +
      "| `GoldenGlove`           | A goalkeeper with incredible consistency and match-winning saves.             |\n" +
      "| `HeaderSpecialist`      | Exceptional in aerial duels, scoring and defending with headers.              |\n" +
      "| `HotHead`               | Easily loses temper, frequently involved in altercations and red cards.       |\n" +
      "| `KnuckleballExpert`     | Specializes in unpredictable, swerving long-range shots.                      |\n" +
      "| `Libero`                | A ball-playing sweeper who advances into midfield when in possession.         |\n" +
      "| `LongPassingWizard`     | Masterful at delivering precise long passes to teammates.                     |\n" +
      "| `LongThrowExpert`       | Can launch long throws into dangerous areas like a set piece.                 |\n" +
      "| `MasterProvocateur`     | Gets under opponents' skin with psychological mind games and trash talk.      |\n" +
      "| `MidfieldMaestro`       | Controls the tempo of the game, dictating play from midfield.                 |\n" +
      "| `NoLookPassMaster`      | Deceptive passer who frequently delivers no-look and disguised passes.        |\n" +
      "| `OffsideTrapExpert`     | Master of defensive positioning, catching opponents offside frequently.       |\n" +
      "| `OneManArmy`            | Can single-handedly carry a team, dragging them to victory.                   |\n" +
      "| `OneTouchFinisher`      | Expert at finishing chances with a single touch, minimizing reaction time.    |\n" +
      "| `PenaltySpecialist`     | Calm and composed when taking penalties, highly accurate.                     |\n" +
      "| `PhysicalBeast`         | Dominates opponents with superior physicality, strength, and endurance.       |\n" +
      "| `Playmaker`             | Orchestrates attacks with vision, creativity, and passing ability.            |\n" +
      "| `PlayoffPerformer`      | Raises performance level in high-stakes knockout games.                       |\n" +
      "| `Poacher`               | Lives for scoring goals in the box, with sharp reactions and positioning.     |\n" +
      "| `PowerShot`             | Possesses an extremely powerful shot, capable of scoring from long distances. |\n" +
      "| `PressingMonster`       | Constantly pressures opponents, disrupting build-up play effectively.         |\n" +
      "| `Regen`                 | A regenerated legendary player, embodying past greatness.                     |\n" +
      "| `Regista`               | A deep-lying playmaker who dictates play with pinpoint passing.               |\n" +
      "| `RelentlessRunner`      | Never stops moving, constantly looking for space and pressing opponents.      |\n" +
      "| `SambaStyle`            | Brazilian-inspired flair, combining dribbles, tricks, and joyful play.        |\n" +
      "| `SetPieceSpecialist`    | Deadly in set-piece situations, delivering goals and assists.                 |\n" +
      "| `ShadowStriker`         | A second striker who finds pockets of space and arrives at the right moment.  |\n" +
      "| `SleightOfFoot`         | Master of quick footwork, able to outmaneuver defenders in tight spaces.      |\n" +
      "| `SlidingTackleAce`      | Exceptionally clean and precise at slide tackles.                             |\n" +
      "| `Sniper`                | Precision shooter, capable of placing the ball exactly where they want.       |\n" +
      "| `SoloRunSpecialist`     | Capable of taking on an entire defense and scoring solo goals.                |\n" +
      "| `Speedster`             | Blistering pace, able to outrun opponents with ease.                          |\n" +
      "| `StreetFootballer`      | Unorthodox style, unpredictable moves, and raw creativity.                    |\n" +
      "| `SuperSub`              | Performs exceptionally well when coming off the bench.                        |\n" +
      "| `TacklingMachine`       | A defensive powerhouse, excelling at tackles and ball recoveries.             |\n" +
      "| `TacticalBrain`         | Reads the game like a coach on the pitch, making intelligent decisions.       |\n" +
      "| `TargetMan`             | A physically dominant striker, excels at hold-up play and aerial duels.       |\n" +
      "| `TechnicalDribbler`     | Exceptional dribbling ability, using skill moves to beat opponents.           |\n" +
      "| `TempoController`       | Controls the pace of the game, slowing or accelerating as needed.             |\n" +
      "| `ThroughBallMaster`     | Has the vision and skill to deliver perfect through passes.                   |\n" +
      "| `TrivelaMaster`         | Expert at using the outside of the foot for passing and shooting.             |\n" +
      "| `Visionary`             | Exceptional awareness, able to anticipate plays and execute brilliant passes. |\n" +
      "| `VolleySpecialist`      | Exceptional at striking volleys with precision and power.                     |\n" +
      "| `WingWizard`            | A magician on the flanks, delivering dribbles, assists, and goals.            |\n" +
      "| `Wonderkid`             | A young prodigy with immense potential to become world-class.                 |\n\n" +
      "### Additional Considerations:\n\n" +
      "-	If a player is known for consistency, their attributes should reflect stability.\n" +
      "-	If a player suffered from frequent injuries, their Injury Prone attribute should be high.\n" +
      "-	If a player was past their prime in the given year, physical attributes should slightly decline.\n" +
      "-	If the player was young and developing, they should not yet have maxed-out attributes.\n" +
      "-	If a player was in their peak, their stats should reflect their absolute best form.\n" +
      "-	Consider historical tactics of the team in that year (e.g., Guardiola’s Barcelona encouraged high " +
      "passing and movement, while Mourinho’s Chelsea emphasized defensive structure). " +
      "Always ensure the generated attributes are coherent and balanced, reflecting the player’s actual " +
      "impact in that specific year.",
    schema: PlayerSchema,
    prompt: `Generate attributes for a football player based on the following details:
    -	Player Name: ${name}
    -	Club: ${team}
    -	Year: ${year}
    -	Position: ${position}

    Use the defined attribute system to generate a well-rounded, realistic player profile. Consider the player’s
    historical performance in that specific year, their strengths, weaknesses, and unique characteristics.
    If applicable, assign a relevant Special Skill from the predefined list.`,
  });

  return object;
};

// ------------------------------------------------------------------------------------------------
// Generate technical staff attributes based on the club and year
const generateTechnicalStaff = async (year: number, team: string) => {
  const {object} = await generateObject({
    model: openai("gpt-4-turbo"),
    system:
      "**You are a specialized AI assistant designed to generate detailed and precise attributes for " +
      "technical staff members. Your task is to create data about the technical staff of a football club " +
      "based on the club and year, considering the above attributes.Each attribute is rated from 1 to 100.**\n\n" +
      "# Technical Staff Attributes\n\n" +
      "| **Attribute**      | **Description**                                                        |\n" +
      "| ------------------ | ---------------------------------------------------------------------- |\n" +
      "| `fitnessRecovery`  | Ability to speed up player recovery between matches.                   |\n" +
      "| `staminaBoost`     | Helps players maintain high energy levels for longer periods.          |\n" +
      "| `injuryPrevention` | Reduces the likelihood of injuries occurring during games.             |\n" +
      "| `medicalResponse`  | Determines the effectiveness of in-game treatment for injured players. |",
    schema: TechnicalStaffSchema,
    prompt: `Generate attributes for the technical staff of a football club based on the following details:
    -	Club: ${team}
    -	Year: ${year}`,
  });

  return object;
};

// ------------------------------------------------------------------------------------------------
// Process each team and save the data into respective JSON files

// Read all folders in the teams directory
const teams = fs.readdirSync(teamsPath);

for (const team of teams) {
  const teamDir = path.join(teamsPath, team);
  const teamSquad = JSON.parse(fs.readFileSync(path.join(teamDir, "squad.json"), "utf-8"));
  const teamInfo = JSON.parse(fs.readFileSync(path.join(teamDir, "info.json"), "utf-8"));

  // Team data
  const teamName = teamInfo.shortName;
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
  TeamSchema.parse(teamAttrs);

  // Save the team data into a JSON file
  const teamAttributesPath = path.join(teamDir, "attributes.json");
  fs.writeFileSync(teamAttributesPath, JSON.stringify(teamAttrs, null, 2));

  console.log(`Team data for ${teamName} saved successfully at ${teamAttributesPath}.`);
}

// Log the status after generating the data
console.log("All teams processed successfully!");

// ------------------------------------------------------------------------------------------------
