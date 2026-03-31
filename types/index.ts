// ─── Calculator Types ─────────────────────────────────────────────────────────

export type CalculatorType =
  | 'bmi'
  | 'bmr'
  | 'ibw'
  | 'bodyfat'
  | 'tdee'
  | 'bodytype'
  | 'calorie'
  | 'caloriesburned'
  | 'carbohydrate'
  | 'weightgain'
  | 'weightloss'
  | 'protein'
  | 'water';

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

export type CaloriesBurnedActivity =
  | 'walking_slow'
  | 'walking_brisk'
  | 'running_8kph'
  | 'running_10kph'
  | 'cycling_leisure'
  | 'cycling_vigorous'
  | 'swimming_moderate'
  | 'jump_rope'
  | 'strength_training'
  | 'yoga_hatha';

export interface CaloriesBurnedInput {
  weight: number; // kg or lbs
  minutes: number;
  activity: CaloriesBurnedActivity;
  unit: UnitSystem;
}

export interface CarbohydrateInput extends BMRInput {
  activityLevel: ActivityLevel;
  goal: WeightGoal;
}

export type GainPace = 'lean' | 'moderate' | 'aggressive';
export type LossPace = 'gentle' | 'moderate' | 'aggressive';

export interface WeightGainInput extends BMRInput {
  activityLevel: ActivityLevel;
  gainPace: GainPace;
  targetWeight: number; // kg or lbs (same unit as input)
}

export interface WeightLossInput extends BMRInput {
  activityLevel: ActivityLevel;
  lossPace: LossPace;
  targetWeight: number; // kg or lbs (same unit as input)
}

export type ProteinGoal =
  | 'sedentary'
  | 'weight_loss'
  | 'active'
  | 'muscle_gain'
  | 'athlete'
  | 'elderly';

export interface ProteinInput {
  weight: number;
  unit: UnitSystem;
  goal: ProteinGoal;
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

export interface CaloriesBurnedResult {
  caloriesBurned: number;
  caloriesPerHour: number;
  met: number;
  activityLabel: string;
}

export interface CarbohydrateResult {
  carbsGrams: number;
  carbPercent: number;
  calories: number;
  bmr: number;
  tdee: number;
  goalLabel: string;
  whoRange: { min: number; max: number };
}

export interface WeightGainResult {
  calories: number;
  bmr: number;
  tdee: number;
  surplus: number;
  gainPaceLabel: string;
  estimatedWeeks: number;
  macros: { carbs: number; protein: number; fat: number };
}

export interface WeightLossResult {
  calories: number;
  bmr: number;
  tdee: number;
  deficit: number;
  lossPaceLabel: string;
  estimatedWeeks: number;
  macros: { carbs: number; protein: number; fat: number };
}

export interface ProteinResult {
  proteinGrams: number;
  proteinCalories: number;
  multiplier: number;
  goalLabel: string;
  whoMinimum: number;
  perMealTarget: number;
}

export interface WaterInput {
  weight: number;
  unit: UnitSystem;
  activityLevel: ActivityLevel;
}

export interface WaterResult {
  waterMl: number;
  waterLitres: number;
  waterFlOz: number;
  perHourMl: number;
  activityLabel: string;
  efsaRef: { men: number; women: number };
}
