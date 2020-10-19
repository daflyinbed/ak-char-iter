interface AttributesKeyFrames {
  level: number;
  maxHp: number;
  atk: number;
  def: number;
  magicResistance: number;
  cost: number;
  blockCnt: number;
  moveSpeed: number;
  attackSpeed: number;
  baseAttackTime: number;
  reSpawnTime: number;
  hpRecoveryPerSec: number;
  spRecoveryPerSec: number;
  maxDeployCount: number;
  maxDeckStackCnt: number;
  tauntLevel: number;
  massLevel: number;
  baseForceLevel: number;
  stunImmune: boolean;
  silenceImmune: boolean;
  sleepImmune: boolean;
}
interface Phases {
  maxLevel: number;
  rangeId: string;
  attributesKeyFrames: AttributesKeyFrames[];
}
interface Talents {
  unlockCondition: {
    phase: number;
    level: number;
  };
  requiredPotentialRank: number;
  name: string;
  description: string;
  rangeID: string | null;
}
interface PotentialRanks {
  description: string;
  type: number;
  buff: null | AttributeModifier[];
}
interface AttributeModifier {
  attributeType: AttributeType;
  value: number;
}
enum AttributeType {
  maxHp,
  atk,
  def,
  magicResistance,
  cost,
  blockCnt,
  moveSpeed,
  attackSpeed,
  baseAttackTime,
  hpRecoveryPerSec = 13,
  spRecoveryPerSec,
  maxDeployCount = 16,
  tauntLevel = 20,
  reSpawnTime,
  maxDeckStackCnt,
  massLevel,
  baseForceLevel,
}
export interface CharData {
  phases: Phases[];
  talents: Talents[];
  potentialRanks: PotentialRanks[];

  appellation: string;
  availableTime: number;
  canUseGeneralPotentialItem: boolean;
  description: string;
  displayLogo: string;
  displayNumber: string;
  maxPotentialLevel: number;
  name: string;
  obtainApproach: string[];
  position: string;
  profession: string;
  rarity: number;
  tagList: string[];
  team: string;
}
export enum InfectionStatus {
  noInfected,
  infected,
  unknown,
}
export interface Basic {
  _name: string;
  _id: string;
}
export interface Fix<T1, T2> {
  origin: T1;
  fix: T2 | null;
}
export interface HandbookData extends Basic {
  //handbook
  painter: string; //画师
  dubber: string; //配音
  gender: string; //性别
  combatExperience: string | Fix<string, string>; //战斗经验
  birthplace: string | Fix<string, string>; //出生地
  birthday: string | Fix<string, string>; //出生日
  race: string | Fix<string, string>; //种族
  height: number | Fix<string, number>; //身高
  infectionStatus: InfectionStatus; //感染状态
  
  physicalStrength: string | Fix<string, string>; //物理强度
  battlefieldManeuver: string | Fix<string, string>; //战场机动
  physiologicalTolerance: string | Fix<string, string>; //生理耐受
  tacticalPlanning: string | Fix<string, string>; //战术规划
  combatSkills: string | Fix<string, string>; //战斗技巧
  originiumArtsAssimilation: string | Fix<string, string>; //源石技艺适应性
  cellOriginiumAssimilation: number | Fix<string, number>; //体细胞与源石融合率
  bloodOriginiumCrystalDensity: number | Fix<string, number>; //血液源石结晶密度
}
