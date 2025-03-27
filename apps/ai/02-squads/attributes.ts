// ------------------------------------------------------------------------------------------------

import { url } from "inspector";
import { z } from "zod";

// ------------------------------------------------------------------------------------------------
// Physical, Mental, and Technical attributes (common to all players)
export const PhysicalSchema = z.object({
  speed: z.number(),
  stamina: z.number(),
  strength: z.number(),
  injuryProne: z.number(),
});

export const MentalSchema = z.object({
  composure: z.number(),
  leadership: z.number(),
  creativity: z.number(),
  aggressiveness: z.number(),
  teamwork: z.number(),
});

export const TechnicalSchema = z.object({
  ballControl: z.number(),
  passing: z.number(),
  finishing: z.number(),
  heading: z.number(),
  marking: z.number(),
});

// Position-specific attributes (fixed for each position)
export const PositionSpecificSchemaGK = z.object({
  positionType: z.literal("GK"),
  reflexes: z.number(),
  oneOnOne: z.number(),
});
export const PositionSpecificSchemaCB = z.object({
  positionType: z.literal("CB"),
  positioning: z.number(),
  aerialDuels: z.number(),
});
export const PositionSpecificSchemaRB = z.object({
  positionType: z.literal("RB"),
  attackingSupport: z.number(),
  defensiveSupport: z.number(),
});
export const PositionSpecificSchemaLB = z.object({
  positionType: z.literal("LB"),
  attackingSupport: z.number(),
  defensiveSupport: z.number(),
});
export const PositionSpecificSchemaCDM = z.object({
  positionType: z.literal("CDM"),
  interception: z.number(),
  tackling: z.number(),
});
export const PositionSpecificSchemaCM = z.object({
  positionType: z.literal("CM"),
  vision: z.number(),
  distribution: z.number(),
});
export const PositionSpecificSchemaRM = z.object({
  positionType: z.literal("RM"),
  vision: z.number(),
  crossing: z.number(),
});
export const PositionSpecificSchemaLM = z.object({
  positionType: z.literal("LM"),
  vision: z.number(),
  crossing: z.number(),
});
export const PositionSpecificSchemaCAM = z.object({
  positionType: z.literal("CAM"),
  longShot: z.number(),
  throughPassing: z.number(),
});
export const PositionSpecificSchemaRW = z.object({
  positionType: z.literal("RW"),
  dribbling: z.number(),
  keyPass: z.number(),
});
export const PositionSpecificSchemaLW = z.object({
  positionType: z.literal("LW"),
  dribbling: z.number(),
  keyPass: z.number(),
});
export const PositionSpecificSchemaST = z.object({
  positionType: z.literal("ST"),
  positioning: z.number(),
  aerialDuels: z.number(),
});
export const PositionSpecificSchemaCF = z.object({
  positionType: z.literal("CF"),
  offTheBallMovement: z.number(),
  combinationPlay: z.number(),
});

export const PositionSpecificSchema = z.discriminatedUnion("positionType", [
  PositionSpecificSchemaGK,
  PositionSpecificSchemaCB,
  PositionSpecificSchemaRB,
  PositionSpecificSchemaLB,
  PositionSpecificSchemaCDM,
  PositionSpecificSchemaCM,
  PositionSpecificSchemaRM,
  PositionSpecificSchemaLM,
  PositionSpecificSchemaCAM,
  PositionSpecificSchemaRW,
  PositionSpecificSchemaLW,
  PositionSpecificSchemaST,
  PositionSpecificSchemaCF,
]);

// Define special skills as a fixed set of known abilities
export const SpecialSkillSchema = z.enum([
  "None",
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

export const PositionEnum = z.enum(["GK", "CB", "RB", "LB", "CDM", "CM", "RM", "LM", "CAM", "RW", "LW", "ST", "CF"]);

// ------------------------------------------------------------------------------------------------
// Player schema with position validation
export const PlayerSchema = z.object({
  name: z.string(),
  position: PositionEnum,
  attributes: z.object({
    physical: PhysicalSchema,
    mental: MentalSchema,
    technical: TechnicalSchema,
    positionSpecific: PositionSpecificSchema,
    specialSkill: SpecialSkillSchema,
  }),
  history: z.object({
    fullName: z.string(),
    knownAs: z.string(),
    birthDate: z.string(),
    nationality: z.string(),
    preferredFoot: z.enum(["left", "right", "both"]),
    height: z.number(),
    weight: z.number(),
    career: z.array(
      z.object({
        club: z.string(),
        from: z.number(),
        to: z.number(),
        appearances: z.number(),
        goals: z.number(),
        assists: z.number(),
      })
    ),
    honours: z.array(z.string()),
    individualAwards: z.array(z.string()),
    nationalTeamCaps: z.number(),
    styleOfPlay: z.string(),
    legacyQuote: z.string(),
    rivalries: z.array(z.string()),
    mentorOf: z.array(z.string()),
    inspiredBy: z.array(z.string()),
  }),
  links: z.array(
    z.object({
      url: z.string(),
      description: z.string(),
    })
  ),
});

// ------------------------------------------------------------------------------------------------
// Coach schema
export const CoachSchema = z.object({
  name: z.string(),
  attributes: z.object({
    tactical: z.object({
      offensiveStrategy: z.number(),
      defensiveStrategy: z.number(),
      tacticalAdaptability: z.number(),
      pressing: z.number(),
      transitionPlay: z.number(),
    }),
    management: z.object({
      motivation: z.number(),
      lockerRoomManagement: z.number(),
      discipline: z.number(),
    }),
    media: z.object({
      mediaInteraction: z.number(),
      crisisManagement: z.number(),
    }),
  }),
});

// ------------------------------------------------------------------------------------------------
// Technical Staff Schema
export const TechnicalStaffSchema = z.object({
  fitnessRecovery: z.number(),
  staminaBoost: z.number(),
  injuryPrevention: z.number(),
  medicalResponse: z.number(),
});

// ------------------------------------------------------------------------------------------------
// Root schema
export const TeamSchema = z.object({
  year: z.number(),
  coach: CoachSchema,
  formation: z.string(),
  players: z.array(PlayerSchema),
  technicalStaff: TechnicalStaffSchema,
});

// ------------------------------------------------------------------------------------------------
