// ------------------------------------------------------------------------------------------------

import {openai} from "@ai-sdk/openai";
import {generateObject} from "ai";
import {z} from "zod";

import {CoachSchema, PlayerSchema, TechnicalStaffSchema} from "./attributes.js";

// ------------------------------------------------------------------------------------------------
// Function to generate club details and historical lineup for each team
export const generateClubData = async (team: string) => {
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
  const {object: teamLineup} = await generateObject({
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

  return {clubDetails, teamLineup};
};

// ------------------------------------------------------------------------------------------------
// Generate Coach attributes based on the year and team
export const generateCoach = async (year: number, team: string, name: string) => {
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
export const generatePlayer = async (year: number, team: string, name: string, position: string) => {
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
      "Only a few players can have a special skill. These skills represent something iconic, legendary, or " +
      "exceptionally rare in a player's style or impact during that specific year. DO NOT assign a special skill " +
      "to every player. Only include it if the player truly deserves it based on their real-life performances, " +
      "influence, and reputation in that season.\n\n" +
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
    ONLY assign a Special Skill from the predefined list if the player truly deserves it for their exceptional
    ability or iconic contribution in that specific year. Most players should not have a Special Skill.`,
  });

  return object;
};

// ------------------------------------------------------------------------------------------------
// Generate technical staff attributes based on the club and year
export const generateTechnicalStaff = async (year: number, team: string) => {
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
