# 📄 Technical Documentation – Player and Coach Attributes

## 1. Overview

This document defines the structure of attributes used for players, coaches, and technical staff in a football simulation tournament. The goal is to keep the system simple while ensuring differentiation between players, maintaining realism and tactical depth.

Each player has common physical, mental, and technical attributes, two position-specific attributes, and a unique special skill that highlights their signature style.

Each coach has attributes focused on tactics, squad management, and media relations.

The technical staff influences player recovery and stamina throughout the tournament.

---

## 2. Player Attributes

### 2.1 General Attributes (All Players)

Players have three categories of attributes: Physical, Mental, and Technical.

#### 📌 Physical Attributes

| **Attribute** | **Description**                                                     |
| ------------- | ------------------------------------------------------------------- |
| `speed`       | Maximum running speed.                                              |
| `stamina`     | Endurance and ability to sustain performance throughout the match.  |
| `strength`    | Physical power in duels and challenges.                             |
| `injuryProne` | Likelihood of injuries (higher value means more frequent injuries). |

#### 📌 Mental Attributes

| **Attribute**    | **Description**                                      |
| ---------------- | ---------------------------------------------------- |
| `composure`      | Ability to perform under pressure.                   |
| `leadership`     | Influence on teammates and team morale.              |
| `creativity`     | Ability to improvise and make unexpected plays.      |
| `aggressiveness` | Intensity and commitment in challenges.              |
| `teamwork`       | Tactical awareness and collaboration with teammates. |

#### 📌 Technical Attributes

| **Attribute** | **Description**                                 |
| ------------- | ----------------------------------------------- |
| `ballControl` | Ability to handle and maneuver the ball.        |
| `passing`     | Precision and variety of passing.               |
| `finishing`   | Shooting accuracy and effectiveness in scoring. |
| `heading`     | Ability to contest aerial duels.                |
| `marking`     | Defensive skill in stopping opponents.          |

---

### 2.2 Role-Specific Attributes (By Position)

The selection of these attributes is based on how players typically impact games from their respective positions. For instance, strikers and center backs both benefit from `positioning` to enhance realism in duels. Midfielders are defined by vision and distribution skills. Wingers are evaluated based on their ability to beat defenders (`dribbling`) and deliver decisive plays (`keyPass`). Attributes like `reflexes`, `oneOnOnes`, or `aerialDuels` represent critical moments that may change the course of a match.

Each player has two additional attributes based on their primary position, adding differentiation and tactical depth. These attributes are carefully chosen to reflect key traits that can impact match outcomes and player interactions on the pitch.

| **Position**                  | **Attribute 1**      | **Attribute 2**    |
| ----------------------------- | -------------------- | ------------------ |
| Goalkeeper (GK)               | `reflexes`           | `oneOnOnes`        |
| Center Back (CB)              | `positioning`        | `aerialDuels`      |
| Right/Left Back (RB/LB)       | `attackingSupport`   | `defensiveSupport` |
| Defensive Midfielder (CDM)    | `interception`       | `tackling`         |
| Central Midfielder (CM)       | `vision`             | `distribution`     |
| Right/Left Midfielder (RM/LM) | `vision`             | `crossing`         |
| Attacking Midfielder (CAM)    | `throughPassing`     | `longShot`         |
| Right/Left Wing (RW/LW)       | `dribbling`          | `keyPass`          |
| Striker (ST)                  | `aerialDuels`        | `positioning`      |
| Forward (CF)                  | `offTheBallMovement` | `combinationPlay`  |

---

### 2.3 Special Skill (Unique Ability)

Each player can have an unique special skill, representing something iconic about their playing style. This skill is not directly related to other attributes but adds a unique flavor to the player's profile. Only a few players can have this special skill, making them stand out from the rest. This special skill can significantly influence a player's performance in specific situations. Additionally, the presence of a special skill can enhance a player's effectiveness in critical moments during matches.

#### 📌 Special Skills

| Special Attribute       | Description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| `AcrobaticKeeper`       | A goalkeeper known for incredible reflex saves and acrobatic movements.       |
| `AerialDominance`       | Wins almost every aerial duel, both offensively and defensively.              |
| `AgelessWonder`         | Maintains peak performance well beyond the usual age decline.                 |
| `BigGameMentality`      | Thrives in finals and decisive matches, performing at their best.             |
| `BoxToBox`              | Covers every blade of grass, contributing both defensively and offensively.   |
| `Captain`               | A natural leader on and off the pitch, inspiring teammates with presence.     |
| `Chameleon`             | Can seamlessly adapt to multiple tactical systems and positions.              |
| `ClinicalFinisher`      | Highly efficient in front of goal, rarely misses a clear chance.              |
| `ClutchPerformer`       | Always delivers in crucial moments, excelling under pressure.                 |
| `CompleteDefender`      | Excels in all defensive aspects, from tackling to positioning.                |
| `CompleteForward`       | A striker who can do it all—finishing, passing, dribbling, and positioning.   |
| `ComposureKing`         | Remains unfazed under pressure, always making the right decision.             |
| `CounterAttackKing`     | Excels in fast transitions, deadly on the break.                              |
| `CrossingExpert`        | Delivers pinpoint crosses into dangerous areas with consistency.              |
| `DeepLyingPlaymaker`    | Creates attacks from deep positions, distributing passes with vision.         |
| `DefensiveGeneral`      | Commands the backline, organizing the defense with authority.                 |
| `DefensiveRock`         | A defensive wall, almost impossible to get past.                              |
| `DribbleSprint`         | Excels at sprinting while dribbling, maintaining control even at high speeds. |
| `DribblingMaestro`      | A true artist with the ball, mesmerizing defenders with unmatched dribbling.  |
| `DribblingTank`         | Combines power and control, bulldozing past defenders.                        |
| `Engine`                | Tireless work rate, constantly running and pressing throughout the game.      |
| `FalseNine`             | A forward who drops deep to create space and link up play.                    |
| `FinesseShotSpecialist` | Master of bending shots into the corners with precision.                      |
| `FirstTouchMaestro`     | Exceptional control on first touch, setting up perfect plays.                 |
| `FlairPlayer`           | A showman, performing dazzling skills and entertaining the crowd.             |
| `FootballIQ`            | Superior understanding of tactics, positioning, and in-game adaptability.     |
| `FoxInTheBox`           | A penalty area predator, lethal in tight spaces.                              |
| `FreekickMaster`        | A dead-ball specialist, capable of scoring and assisting from free kicks.     |
| `GameChanger`           | Capable of turning the tide of a match with a single moment of brilliance.    |
| `GameReader`            | Anticipates opponents’ moves before they happen.                              |
| `GeniusPasser`          | Able to execute extraordinary passes that no one else sees.                   |
| `GoalPoacher`           | Always in the right place at the right time to score opportunistic goals.     |
| `GoldenGlove`           | A goalkeeper with incredible consistency and match-winning saves.             |
| `HeaderSpecialist`      | Exceptional in aerial duels, scoring and defending with headers.              |
| `HotHead`               | Easily loses temper, frequently involved in altercations and red cards.       |
| `KnuckleballExpert`     | Specializes in unpredictable, swerving long-range shots.                      |
| `Libero`                | A ball-playing sweeper who advances into midfield when in possession.         |
| `LongPassingWizard`     | Masterful at delivering precise long passes to teammates.                     |
| `LongThrowExpert`       | Can launch long throws into dangerous areas like a set piece.                 |
| `MasterProvocateur`     | Gets under opponents' skin with psychological mind games and trash talk.      |
| `MidfieldMaestro`       | Controls the tempo of the game, dictating play from midfield.                 |
| `NoLookPassMaster`      | Deceptive passer who frequently delivers no-look and disguised passes.        |
| `OffsideTrapExpert`     | Master of defensive positioning, catching opponents offside frequently.       |
| `OneManArmy`            | Can single-handedly carry a team, dragging them to victory.                   |
| `OneTouchFinisher`      | Expert at finishing chances with a single touch, minimizing reaction time.    |
| `PenaltySpecialist`     | Calm and composed when taking penalties, highly accurate.                     |
| `PhysicalBeast`         | Dominates opponents with superior physicality, strength, and endurance.       |
| `Playmaker`             | Orchestrates attacks with vision, creativity, and passing ability.            |
| `PlayoffPerformer`      | Raises performance level in high-stakes knockout games.                       |
| `Poacher`               | Lives for scoring goals in the box, with sharp reactions and positioning.     |
| `PowerShot`             | Possesses an extremely powerful shot, capable of scoring from long distances. |
| `PressingMonster`       | Constantly pressures opponents, disrupting build-up play effectively.         |
| `Regen`                 | A regenerated legendary player, embodying past greatness.                     |
| `Regista`               | A deep-lying playmaker who dictates play with pinpoint passing.               |
| `RelentlessRunner`      | Never stops moving, constantly looking for space and pressing opponents.      |
| `SambaStyle`            | Brazilian-inspired flair, combining dribbles, tricks, and joyful play.        |
| `SetPieceSpecialist`    | Deadly in set-piece situations, delivering goals and assists.                 |
| `ShadowStriker`         | A second striker who finds pockets of space and arrives at the right moment.  |
| `SleightOfFoot`         | Master of quick footwork, able to outmaneuver defenders in tight spaces.      |
| `SlidingTackleAce`      | Exceptionally clean and precise at slide tackles.                             |
| `Sniper`                | Precision shooter, capable of placing the ball exactly where they want.       |
| `SoloRunSpecialist`     | Capable of taking on an entire defense and scoring solo goals.                |
| `Speedster`             | Blistering pace, able to outrun opponents with ease.                          |
| `StreetFootballer`      | Unorthodox style, unpredictable moves, and raw creativity.                    |
| `SuperSub`              | Performs exceptionally well when coming off the bench.                        |
| `TacklingMachine`       | A defensive powerhouse, excelling at tackles and ball recoveries.             |
| `TacticalBrain`         | Reads the game like a coach on the pitch, making intelligent decisions.       |
| `TargetMan`             | A physically dominant striker, excels at hold-up play and aerial duels.       |
| `TechnicalDribbler`     | Exceptional dribbling ability, using skill moves to beat opponents.           |
| `TempoController`       | Controls the pace of the game, slowing or accelerating as needed.             |
| `ThroughBallMaster`     | Has the vision and skill to deliver perfect through passes.                   |
| `TrivelaMaster`         | Expert at using the outside of the foot for passing and shooting.             |
| `Visionary`             | Exceptional awareness, able to anticipate plays and execute brilliant passes. |
| `VolleySpecialist`      | Exceptional at striking volleys with precision and power.                     |
| `WingWizard`            | A magician on the flanks, delivering dribbles, assists, and goals.            |
| `Wonderkid`             | A young prodigy with immense potential to become world-class.                 |

---

## 3. Coach Attributes

Coaches define the tactical identity and management style of a team.

### 📌 Tactical Attributes

| **Attribute**          | **Description**                                          |
| ---------------------- | -------------------------------------------------------- |
| `offensiveStrategy`    | Ability to set up attacking plays.                       |
| `defensiveStrategy`    | Skill in organizing a solid defense.                     |
| `tacticalAdaptability` | Ability to adjust the team’s strategy during a match.    |
| `pressing`             | Level of intensity in applying pressure on the opponent. |
| `transitionPlay`       | Effectiveness in switching between attack and defense.   |

### 📌 Squad Management

| **Attribute**            | **Description**                                        |
| ------------------------ | ------------------------------------------------------ |
| `motivation`             | Ability to inspire and push players to perform better. |
| `locker_room_management` | Skill in managing egos and maintaining team harmony.   |
| `discipline`             | Enforcing order and keeping players focused.           |

### 📌 Media Handling

| **Attribute**       | **Description**                                     |
| ------------------- | --------------------------------------------------- |
| `media_interaction` | Ability to handle press conferences and interviews. |
| `crisis_management` | Keeping composure during difficult situations.      |

---

## 4. Technical Staff Attributes

The technical staff is responsible for player recovery and stamina management throughout the tournament. Their influence ensures that players maintain their peak physical condition and recover effectively between matches.

### 📌 Key Attributes

| **Attribute**      | **Description**                                                        |
| ------------------ | ---------------------------------------------------------------------- |
| `fitnessRecovery`  | Ability to speed up player recovery between matches.                   |
| `staminaBoost`     | Helps players maintain high energy levels for longer periods.          |
| `injuryPrevention` | Reduces the likelihood of injuries occurring during games.             |
| `medicalResponse`  | Determines the effectiveness of in-game treatment for injured players. |

---
