// ------------------------------------------------------------------------------------------------

import { z } from "zod";

// ------------------------------------------------------------------------------------------------
// Physical, Mental, and Technical attributes (common to all players)
export const PhysicalSchema = z.object({
  speed: z.number().min(0).max(100),
  stamina: z.number().min(0).max(100),
  strength: z.number().min(0).max(100),
  injuryProne: z.number().min(0).max(100),
});

export const MentalSchema = z.object({
  composure: z.number().min(0).max(100),
  leadership: z.number().min(0).max(100),
  creativity: z.number().min(0).max(100),
  aggressiveness: z.number().min(0).max(100),
  teamwork: z.number().min(0).max(100),
});

export const TechnicalSchema = z.object({
  ballControl: z.number().min(0).max(100),
  passing: z.number().min(0).max(100),
  finishing: z.number().min(0).max(100),
  heading: z.number().min(0).max(100),
  marking: z.number().min(0).max(100),
});

// Position-specific attributes (fixed for each position)
export const PositionSpecificSchemaGK = z.object({
  reflexes: z.number().min(0).max(100),
  oneOnOne: z.number().min(0).max(100),
});
export const PositionSpecificSchemaCB = z.object({
  positioning: z.number().min(0).max(100),
  aerialDuels: z.number().min(0).max(100),
});
export const PositionSpecificSchemaRB = z.object({
  attackingSupport: z.number().min(0).max(100),
  defensiveSupport: z.number().min(0).max(100),
});
export const PositionSpecificSchemaLB = z.object({
  attackingSupport: z.number().min(0).max(100),
  defensiveSupport: z.number().min(0).max(100),
});
export const PositionSpecificSchemaCDM = z.object({
  interception: z.number().min(0).max(100),
  tackling: z.number().min(0).max(100),
});
export const PositionSpecificSchemaCM = z.object({
  vision: z.number().min(0).max(100),
  distribution: z.number().min(0).max(100),
});
export const PositionSpecificSchemaRM = z.object({
  vision: z.number().min(0).max(100),
  crossing: z.number().min(0).max(100),
});
export const PositionSpecificSchemaLM = z.object({
  vision: z.number().min(0).max(100),
  crossing: z.number().min(0).max(100),
});
export const PositionSpecificSchemaCAM = z.object({
  longShot: z.number().min(0).max(100),
  throughPassing: z.number().min(0).max(100),
});
export const PositionSpecificSchemaRW = z.object({
  dribbling: z.number().min(0).max(100),
  keyPass: z.number().min(0).max(100),
});
export const PositionSpecificSchemaLW = z.object({
  dribbling: z.number().min(0).max(100),
  keyPass: z.number().min(0).max(100),
});
export const PositionSpecificSchemaST = z.object({
  positioning: z.number().min(0).max(100),
  aerialDuels: z.number().min(0).max(100),
});
export const PositionSpecificSchemaCF = z.object({
  offTheBallMovement: z.number().min(0).max(100),
  combinationPlay: z.number().min(0).max(100),
});

export const PositionSpecificSchema = z.union([
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
    specialSkill: SpecialSkillSchema.optional(),
  }),
});

// ------------------------------------------------------------------------------------------------
// Coach schema
export const CoachSchema = z.object({
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
export const TechnicalStaffSchema = z.object({
  fitnessRecovery: z.number().min(0).max(100),
  staminaBoost: z.number().min(0).max(100),
  injuryPrevention: z.number().min(0).max(100),
  medicalResponse: z.number().min(0).max(100),
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
