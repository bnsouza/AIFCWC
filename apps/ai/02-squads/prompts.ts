// ------------------------------------------------------------------------------------------------

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { pascalCase } from "utils/functions.js";
import { logAIGeneration } from "utils/logger.js";
import { z } from "zod";

import { CoachSchema, PlayerSchema, TechnicalStaffSchema } from "./attributes.js";

// ------------------------------------------------------------------------------------------------
// Generate club information based on the team, country, and confederation
export const generateClubInfo = async (team: string, country: string, confederation: string) => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    "You are an expert historian specializing in the history of football clubs. " +
    "Your expertise covers a wide range of details, including the founding history, major " +
    "achievements, iconic players, historical significance, and cultural impact of various football " +
    "clubs around the world. As an enthusiast, you are also expected to be familiar with significant " +
    "matches, rivalries, notable managers, shifts in league positions throughout the clubs' histories, " +
    "and you know all uniforms, all colors and their representations.";

  // User Prompt: Specifies the user's request
  const userPrompt =
    `Provide the following details for the football club named ${team} (${country} - ${confederation}):\n` +
    "- Foundation date\n" +
    "- City\n" +
    "- Full name\n" +
    "- Short name\n" +
    "- Stadium name and capacity\n" +
    "- Social media handles (Instagram and TikTok)\n" +
    "- Colors: generate up to 3 distinct uniform color combinations for the team. Each color set must include:\n" +
    "  - Background color (based on shirt color)\n" +
    "  - Font color (used for numbers and names)\n\n" +
    "**Additional guidelines:**\n" +
    "- The first color set must represent the club’s primary (home) kit.\n" +
    "- The second set should represent the away kit.\n" +
    "- If the club has a third (alternate) kit in its history or current use, include that as a third option.\n" +
    "- All colors must be based on the actual club kit used historically or currently. Do not invent combinations.\n" +
    "- For each color set, ensure that the contrast ratio between background and font color is at least 4.5:1 for screen readability.\n" +
    "- Convert the colors to their most precise representation using the CSS 'rgb()' function format.\n" +
    `- Do not use color names like "blue" or "red"; always provide actual color values.`;

  // Generate the object
  const result = await generateObject({
    model: openai("gpt-4o"),
    system: systemPrompt,
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
        alternate: z
          .object({
            bgColor: z.string(),
            fontColor: z.string(),
          })
          .optional(),
      }),
    }),
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `${pascalCase(team)}-ClubInfo`,
    system: systemPrompt,
    prompt: userPrompt,
    result: result.object,
    response: {
      model: result.response?.modelId ?? "unknown",
      timestamp: result.response?.timestamp?.toISOString() ?? new Date().toISOString(),
    },
  });

  // Return the generated object
  return result.object;
};

// ------------------------------------------------------------------------------------------------
// Generate historical lineup based on the team, country, and confederation
export const generateTeamSquad = async (team: string, country: string, confederation: string) => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    "You are an expert football historian and analyst tasked with finding the best historical " +
    "lineup for a given club, ensuring that all players have played together in at least one " +
    "official match. The lineup should come from one of the club’s most iconic games, such as " +
    "a major final or a defining victory.\n\n" +
    "- **Position Abbreviations:**\n" +
    "  - `GK`: Goalkeeper\n" +
    "  - `CB`: Center-back\n" +
    "  - `RB`: Right-back\n" +
    "  - `LB`: Left-back\n" +
    "  - `CDM`: Central defensive midfielder\n" +
    "  - `CM`: Central midfielder\n" +
    "  - `RM`: Right midfielder\n" +
    "  - `LM`: Left midfielder\n" +
    "  - `CAM`: Central attacking midfielder\n" +
    "  - `RW`: Right winger\n" +
    "  - `LW`: Left winger\n" +
    "  - `ST`: Striker\n" +
    "  - `CF`: Center forward\n\n" +
    "# Steps\n\n" +
    "1. Choose a real match where all selected players were on the field together.\n" +
    "2. Prioritize finals of major competitions (e.g., Champions League, Copa Libertadores, domestic leagues).\n" +
    "3. Analyze the historical performance data of the team you chose.\n" +
    "4. Ensure that players played together in at least one official match.\n" +
    "5. Do not generate fictional lineups nor players.\n" +
    "6. Use the tactical formation employed in that season.\n" +
    "7. List all players and their respective positions. You MUST include 11 starters and up to 9 substitutes.\n" +
    "8. The minimum number of players is 15, and the maximum is 20.\n" +
    "9. Assign each player the position they played in that season.\n" +
    "10. Include the coach of the team.\n" +
    "11. At the end, check again if all players played in the same year for the team, to not mix players from different eras.\n\n" +
    "# Output Format\n\n" +
    "Provide a detailed overview of the chosen historical lineup, including each player's position " +
    "and their coach, ensuring historical accuracy and completeness. \n\n" +
    "# Notes\n\n" +
    "- Make sure all historical information and player data are accurate and come from reliable sources.\n" +
    "- Consider the importance and influence of the chosen match in the club's history. \n" +
    "- Ensure that no fictional players or games are used in the lineup.";

  // User Prompt: Specifies the user's request
  const userPrompt =
    `Find the best-ever lineup for ${team} (${country} - ${confederation}), ` +
    "where all players were on the field together in an official match.\n" +
    "**Criteria:**\n" +
    "  - Choose the most significant game in the club's history.\n" +
    "  - Provide the exact starting XI with their positions in the formation used that day.\n" +
    "  - Explain why this lineup was historically important.\n" +
    "  - If multiple matches qualify, select the one where the team performed at its peak.";

  // Generate the object
  const result = await generateObject({
    model: openai("o3-mini"),
    system: systemPrompt,
    schema: z.object({
      year: z.number(),
      coach: z.string(),
      formation: z.string(),
      players: z.array(
        z.object({
          name: z.string(),
          position: z.enum(["GK", "CB", "RB", "LB", "CDM", "CM", "RM", "LM", "CAM", "RW", "LW", "ST", "CF"]),
        })
      ),
      explanation: z.string(),
    }),
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `${pascalCase(team)}-TeamSquad`,
    system: systemPrompt,
    prompt: userPrompt,
    result: result.object,
    response: {
      model: result.response?.modelId ?? "unknown",
      timestamp: result.response?.timestamp?.toISOString() ?? new Date().toISOString(),
    },
  });

  // Return the generated object
  return result.object;
};

// ------------------------------------------------------------------------------------------------
// Generate Coach attributes based on the year and team
export const generateCoach = async (year: number, team: string, name: string) => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    "You are a specialized AI assistant designed to generate detailed and precise " +
    "attributes for football coaches. Coaches define the tactical identity and management style of a team. " +
    "Each attribute is rated from 1 to 100.\n\n" +
    "# Coach Attributes\n\n" +
    "## Tactical Attributes\n\n" +
    "- `offensiveStrategy`: Ability to set up attacking plays.\n" +
    "- `defensiveStrategy`: Skill in organizing a solid defense.\n" +
    "- `tacticalAdaptability`: Ability to adjust the team’s strategy during a match.\n" +
    "- `pressing`: Level of intensity in applying pressure on the opponent.\n" +
    "- `transitionPlay`: Effectiveness in switching between attack and defense.\n\n" +
    "## Squad Management\n\n" +
    "- `motivation`: Ability to inspire and push players to perform better.\n" +
    "- `lockerRoomManagement`: Skill in managing egos and maintaining team harmony.\n" +
    "- `discipline`: Enforcing order and keeping players focused.\n\n" +
    "## Media Handling\n\n" +
    "- `mediaInteraction`: Ability to handle press conferences and interviews.\n" +
    "- `crisisManagement`: Keeping composure during difficult situations.";

  // User Prompt: Specifies the user's request
  const userPrompt =
    "Generate attributes for a football coach based on the following details:\n" +
    `-  Coach Name: ${name}\n` +
    `-  Club: ${team}\n` +
    `-  Year: ${year}`;

  // Generate the object
  const result = await generateObject({
    model: openai("o3-mini"),
    system: systemPrompt,
    schema: CoachSchema,
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `${pascalCase(team)}-Coach`,
    system: systemPrompt,
    prompt: userPrompt,
    result: result.object,
    response: {
      model: result.response?.modelId ?? "unknown",
      timestamp: result.response?.timestamp?.toISOString() ?? new Date().toISOString(),
    },
  });

  // Return the generated object
  return result.object;
};

// ------------------------------------------------------------------------------------------------
// Generate player attributes based on the club, year, and position
export const generatePlayer = async (year: number, team: string, name: string, position: string) => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    "You are a highly specialized AI assistant designed to generate detailed " +
    "and precise attributes for football players. Your task is to create player profiles based " +
    "on their club, year, and position, accurately reflecting their real-life playing style and " +
    "strengths. Ensure each player’s profile is rooted in historical records, statistics, and " +
    "expert football analysis. Each attribute should align with the player’s known abilities " +
    "and must be rated from 1 to 100.\n\n" +
    "# Player Attributes\n\n" +
    "## General Attributes (All Players)\n\n" +
    "Players are categorized under three main attributes: Physical, Mental, and Technical.\n\n" +
    "### Physical Attributes\n" +
    "- `speed`: Maximum running speed.\n" +
    "- `stamina`: Endurance and ability to sustain performance throughout the match.\n" +
    "- `strength`: Physical power in duels and challenges.\n" +
    "- `injuryProne`: Likelihood of injuries; a higher value means more frequent injuries.\n\n" +
    "### Mental Attributes\n" +
    "- `composure`: Ability to perform under pressure.\n" +
    "- `leadership`: Influence on teammates and team morale.\n" +
    "- `creativity`: Ability to improvise and make unexpected plays.\n" +
    "- `aggressiveness`: Intensity and commitment in challenges.\n" +
    "- `teamwork`: Tactical awareness and collaboration with teammates.\n\n" +
    "### Technical Attributes\n" +
    "- `ballControl`: Ability to handle and maneuver the ball.\n" +
    "- `passing`: Precision and variety of passing.\n" +
    "- `finishing`: Shooting accuracy and effectiveness in scoring.\n" +
    "- `heading`: Ability to contest aerial duels.\n" +
    "- `marking`: Defensive skill in stopping opponents.\n\n" +
    "## Position-Specific Attributes\n\n" +
    "Players have role-specific attributes, enhancing differentiation by position.\n\n" +
    "- **Goalkeeper (GK):** `reflexes`, `oneOnOne`\n" +
    "- **Center Back (CB):** `positioning`, `aerialDuels`\n" +
    "- **Right/Left Back (RB/LB):** `attackingSupport`, `defensiveSupport`\n" +
    "- **Defensive Midfielder (CDM):** `interception`, `tackling`\n" +
    "- **Central Midfielder (CM):** `vision`, `distribution`\n" +
    "- **Right/Left Midfielder (RM/LM):** `vision`, `crossing`\n" +
    "- **Attacking Midfielder (CAM):** `throughPassing`, `longShot`\n" +
    "- **Right/Left Wing (RW/LW):** `dribbling`, `keyPass`\n" +
    "- **Striker (ST):** `positioning`, `aerialDuels`\n" +
    "- **Forward (CF):** `combinationPlay`, `offTheBallMovement`\n\n" +
    "## Special Skill (Unique Ability)\n\n" +
    "Assign unique skills sparingly. Only award a special skill if the player exemplified " +
    "extraordinary qualities during that specific year.\n\n" +
    "### List of Special Skills\n\n" +
    "- `AcrobaticKeeper`: A goalkeeper known for incredible reflex saves and acrobatic movements.\n" +
    "- `AerialDominance`: Wins almost every aerial duel, both offensively and defensively.\n" +
    "- `AgelessWonder`: Maintains peak performance well beyond the usual age decline.\n" +
    "- `BigGameMentality`: Thrives in finals and decisive matches, performing at their best.\n" +
    "- `BoxToBox`: Covers every blade of grass, contributing both defensively and offensively.\n" +
    "- `Captain`: A natural leader on and off the pitch, inspiring teammates with presence.\n" +
    "- `Chameleon`: Can seamlessly adapt to multiple tactical systems and positions.\n" +
    "- `ClinicalFinisher`: Highly efficient in front of goal, rarely misses a clear chance.\n" +
    "- `ClutchPerformer`: Always delivers in crucial moments, excelling under pressure.\n" +
    "- `CompleteDefender`: Excels in all defensive aspects, from tackling to positioning.\n" +
    "- `CompleteForward`: A striker who can do it all—finishing, passing, dribbling, and positioning.\n" +
    "- `ComposureKing`: Remains unfazed under pressure, always making the right decision.\n" +
    "- `CounterAttackKing`: Excels in fast transitions, deadly on the break.\n" +
    "- `CrossingExpert`: Delivers pinpoint crosses into dangerous areas with consistency.\n" +
    "- `DeepLyingPlaymaker`: Creates attacks from deep positions, distributing passes with vision.\n" +
    "- `DefensiveGeneral`: Commands the backline, organizing the defense with authority.\n" +
    "- `DefensiveRock`: A defensive wall, almost impossible to get past.\n" +
    "- `DribbleSprint`: Excels at sprinting while dribbling, maintaining control even at high speeds.\n" +
    "- `DribblingMaestro`: A true artist with the ball, mesmerizing defenders with unmatched dribbling.\n" +
    "- `DribblingTank`: Combines power and control, bulldozing past defenders.\n" +
    "- `Engine`: Tireless work rate, constantly running and pressing throughout the game.\n" +
    "- `FalseNine`: A forward who drops deep to create space and link up play.\n" +
    "- `FinesseShotSpecialist`: Master of bending shots into the corners with precision.\n" +
    "- `FirstTouchMaestro`: Exceptional control on first touch, setting up perfect plays.\n" +
    "- `FlairPlayer`: A showman, performing dazzling skills and entertaining the crowd.\n" +
    "- `FootballIQ`: Superior understanding of tactics, positioning, and in-game adaptability.\n" +
    "- `FoxInTheBox`: A penalty area predator, lethal in tight spaces.\n" +
    "- `FreekickMaster`: A dead-ball specialist, capable of scoring and assisting from free kicks.\n" +
    "- `GameChanger`: Capable of turning the tide of a match with a single moment of brilliance.\n" +
    "- `GameReader`: Anticipates opponents’ moves before they happen.\n" +
    "- `GeniusPasser`: Able to execute extraordinary passes that no one else sees.\n" +
    "- `GoalPoacher`: Always in the right place at the right time to score opportunistic goals.\n" +
    "- `GoldenGlove`: A goalkeeper with incredible consistency and match-winning saves.\n" +
    "- `HeaderSpecialist`: Exceptional in aerial duels, scoring and defending with headers.\n" +
    "- `HotHead`: Easily loses temper, frequently involved in altercations and red cards.\n" +
    "- `KnuckleballExpert`: Specializes in unpredictable, swerving long-range shots.\n" +
    "- `Libero`: A ball-playing sweeper who advances into midfield when in possession.\n" +
    "- `LongPassingWizard`: Masterful at delivering precise long passes to teammates.\n" +
    "- `LongThrowExpert`: Can launch long throws into dangerous areas like a set piece.\n" +
    "- `MasterProvocateur`: Gets under opponents' skin with psychological mind games and trash talk.\n" +
    "- `MidfieldMaestro`: Controls the tempo of the game, dictating play from midfield.\n" +
    "- `NoLookPassMaster`: Deceptive passer who frequently delivers no-look and disguised passes.\n" +
    "- `OffsideTrapExpert`: Master of defensive positioning, catching opponents offside frequently.\n" +
    "- `OneManArmy`: Can single-handedly carry a team, dragging them to victory.\n" +
    "- `OneTouchFinisher`: Expert at finishing chances with a single touch, minimizing reaction time.\n" +
    "- `PenaltySpecialist`: Calm and composed when taking penalties, highly accurate.\n" +
    "- `PhysicalBeast`: Dominates opponents with superior physicality, strength, and endurance.\n" +
    "- `Playmaker`: Orchestrates attacks with vision, creativity, and passing ability.\n" +
    "- `PlayoffPerformer`: Raises performance level in high-stakes knockout games.\n" +
    "- `Poacher`: Lives for scoring goals in the box, with sharp reactions and positioning.\n" +
    "- `PowerShot`: Possesses an extremely powerful shot, capable of scoring from long distances.\n" +
    "- `PressingMonster`: Constantly pressures opponents, disrupting build-up play effectively.\n" +
    "- `Regen`: A regenerated legendary player, embodying past greatness.\n" +
    "- `Regista`: A deep-lying playmaker who dictates play with pinpoint passing.\n" +
    "- `RelentlessRunner`: Never stops moving, constantly looking for space and pressing opponents.\n" +
    "- `SambaStyle`: Brazilian-inspired flair, combining dribbles, tricks, and joyful play.\n" +
    "- `SetPieceSpecialist`: Deadly in set-piece situations, delivering goals and assists.\n" +
    "- `ShadowStriker`: A second striker who finds pockets of space and arrives at the right moment.\n" +
    "- `SleightOfFoot`: Master of quick footwork, able to outmaneuver defenders in tight spaces.\n" +
    "- `SlidingTackleAce`: Exceptionally clean and precise at slide tackles.\n" +
    "- `Sniper`: Precision shooter, capable of placing the ball exactly where they want.\n" +
    "- `SoloRunSpecialist`: Capable of taking on an entire defense and scoring solo goals.\n" +
    "- `Speedster`: Blistering pace, able to outrun opponents with ease.\n" +
    "- `StreetFootballer`: Unorthodox style, unpredictable moves, and raw creativity.\n" +
    "- `SuperSub`: Performs exceptionally well when coming off the bench.\n" +
    "- `TacklingMachine`: A defensive powerhouse, excelling at tackles and ball recoveries.\n" +
    "- `TacticalBrain`: Reads the game like a coach on the pitch, making intelligent decisions.\n" +
    "- `TargetMan`: A physically dominant striker, excels at hold-up play and aerial duels.\n" +
    "- `TechnicalDribbler`: Exceptional dribbling ability, using skill moves to beat opponents.\n" +
    "- `TempoController`: Controls the pace of the game, slowing or accelerating as needed.\n" +
    "- `ThroughBallMaster`: Has the vision and skill to deliver perfect through passes.\n" +
    "- `TrivelaMaster`: Expert at using the outside of the foot for passing and shooting.\n" +
    "- `Visionary`: Exceptional awareness, able to anticipate plays and execute brilliant passes.\n" +
    "- `VolleySpecialist`: Exceptional at striking volleys with precision and power.\n" +
    "- `WingWizard`: A magician on the flanks, delivering dribbles, assists, and goals.\n" +
    "- `Wonderkid`: A young prodigy with immense potential to become world-class.\n\n" +
    "### Additional Considerations\n\n" +
    "- If the player has no special skill, set it as ‘None’.\n" +
    "- Reflect stability in consistent players’ attributes.\n" +
    "- Assign a high Injury Prone attribute to frequently injured players.\n" +
    "- Indicate a decline for players past their prime in the given year.\n" +
    "- Young players should have developing attributes, not nearing maximum.\n" +
    "- Peak-period players’ stats should reflect their best form.\n" +
    "- Consider historical tactics of the team in that year.\n\n" +
    "# History\n" +
    "Provide accurate information about the player's life and career. Focus on:\n" +
    "- Clubs trajectories and season stats\n" +
    "- Honours and awards\n" +
    "- Influence, legacy, style, rivalries\n\n" +
    "# External Links\n" +
    "Provide up to 3 high-quality links with a short description for each. Prioritize:\n" +
    "- Career highlights (ex: YouTube, FIFA, UEFA)\n" +
    "- Historical articles or interviews\n" +
    "- Statistical profiles (e.g. Transfermarkt, National-Football-Teams.com)\n\n" +
    "# Notes\n\n" +
    "Ensure profiles align with historical performance analysis and are consistent with " +
    "known team tactics and playing style from the specified year.";

  // User Prompt: Specifies the user's request
  const userPrompt =
    "Generate attributes for a football player based on the following details:\n" +
    `-  Player Name: ${name}\n` +
    `-  Club: ${team}\n` +
    `-  Year: ${year}\n` +
    `-  Position: ${position}\n\n` +
    "Use the full schema provided (attributes, history, links). Provide rich but accurate information " +
    "to generate a well-rounded, realistic player profile. Consider the player’s " +
    "historical performance in that specific year, their strengths, weaknesses, and unique characteristics. " +
    "ONLY assign a Special Skill from the predefined list if the player truly deserves it for their exceptional " +
    "ability or iconic contribution in that specific year. Do not invent new skills, stick to the provided list. " +
    "Most players should not have a Special Skill, so use it wisely.";

  // Generate the object
  const result = await generateObject({
    model: openai("o3-mini"),
    system: systemPrompt,
    schema: PlayerSchema,
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `${pascalCase(team)}-Player`,
    system: systemPrompt,
    prompt: userPrompt,
    result: result.object,
    response: {
      model: result.response?.modelId ?? "unknown",
      timestamp: result.response?.timestamp?.toISOString() ?? new Date().toISOString(),
    },
  });

  // Return the generated object
  return result.object;
};

// ------------------------------------------------------------------------------------------------
// Generate technical staff attributes based on the club and year
export const generateTechnicalStaff = async (year: number, team: string) => {
  // System Prompt: Specifies the behavior of the model
  const systemPrompt =
    "You are a specialized AI assistant designed to generate detailed and " +
    "precise attributes for technical staff members of a football club. Your task is to create " +
    "data about the technical staff of a football club based on the club and year, considering " +
    "the attributes listed below.\n\n" +
    "# Technical Staff Attributes\n\n" +
    "- `fitnessRecovery`: Ability to speed up player recovery between matches.\n" +
    "- `staminaBoost`: Helps players maintain high energy levels for longer periods.\n" +
    "- `injuryPrevention`: Reduces the likelihood of injuries occurring during games.\n" +
    "- `medicalResponse`: Determines the effectiveness of in-game treatment for injured players.\n\n" +
    "# Steps\n\n" +
    "1. Identify the football club and the year for which the technical staff attributes are to be generated.\n" +
    "2. Analyze the historical performance data of the staff for the given club and year.\n" +
    "3. Assign a rating from 1 to 100 for each attribute based on this analysis.\n" +
    "4. Ensure that the ratings reflect the actual performance and potential impact of the staff.\n\n" +
    "# Notes \n\n" +
    "- Consider external factors such as team performance, player feedback, and historical " +
    "comparisons when assigning ratings.\n" +
    "- Be as realistic and data-driven as possible in generating these attributes.";

  // User Prompt: Specifies the user's request
  const userPrompt =
    "Generate attributes for the technical staff of a football club based " +
    "on the following details:\n" +
    `-  Club: ${team}\n` +
    `-  Year: ${year};\n` +
    "Please ensure the attributes reflect the club's historical context and performance.";

  // Generate the object
  const result = await generateObject({
    model: openai("o3-mini"),
    system: systemPrompt,
    schema: TechnicalStaffSchema,
    prompt: userPrompt,
  });

  // Log the AI generation
  await logAIGeneration({
    task: `${pascalCase(team)}-TechnicalStaff`,
    system: systemPrompt,
    prompt: userPrompt,
    result: result.object,
    response: {
      model: result.response?.modelId ?? "unknown",
      timestamp: result.response?.timestamp?.toISOString() ?? new Date().toISOString(),
    },
  });

  // Return the generated object
  return result.object;
};

// ------------------------------------------------------------------------------------------------
