// ─── Calculator Types ─────────────────────────────────────────────────────────

export type CalculatorType = 'bmi' | 'bmr' | 'ibw' | 'bodyfat' | 'tdee' | 'bodytype' | 'calorie';

export type WeightGoal = 'lose_fast' | 'lose' | 'maintain' | 'gain' | 'gain_fast';

export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type UnitSystem = 'metric' | 'imperial';

// ─── Input Shapes ─────────────────────────────────────────────────────────────

export interface BMIInput {
  weight: number;   // kg or lbs
  height: number;   // cm or inches
  unit: UnitSystem;
}

export interface BMRInput {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  unit: UnitSystem;
}

export interface IBWInput {
  height: number;
  gender: Gender;
  unit: UnitSystem;
}

export interface BodyFatInput {
  gender: Gender;
  height: number;
  neck: number;
  waist: number;
  hip?: number;     // required for female
  unit: UnitSystem;
}

export interface TDEEInput extends BMRInput {
  activityLevel: ActivityLevel;
}

export interface CalorieInput extends BMRInput {
  activityLevel: ActivityLevel;
  goal: WeightGoal;
}

export interface BodyTypeInput {
  waist: number;   // cm or inches
  hip: number;     // cm or inches
  bust: number;    // cm or inches
  unit: UnitSystem;
}

// ─── Result Shapes ────────────────────────────────────────────────────────────

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

export interface BMRResult {
  bmr: number;
}

export interface IBWResult {
  ibw: number;
  range: { min: number; max: number };
}

export interface BodyFatResult {
  bodyFatPercent: number;
  category: string;
  color: string;
}

export interface TDEEResult {
  tdee: number;
  bmr: number;
  activityLabel: string;
}

export interface CalorieResult {
  calories: number;
  bmr: number;
  tdee: number;
  delta: number;
  goalLabel: string;
  macros: { carbs: number; protein: number; fat: number };
}

export interface BodyTypeResult {
  shape: string;
  whr: number;
  whrCategory: string;
  whrColor: string;
  color: string;
  desc: string;
  riskLevel: string;
}
