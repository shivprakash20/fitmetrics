import {
  BMIInput, BMIResult,
  BMRInput, BMRResult,
  IBWInput, IBWResult,
  BodyFatInput, BodyFatResult,
  TDEEInput, TDEEResult,
  BodyTypeInput, BodyTypeResult,
  CalorieInput, CalorieResult,
  CarbohydrateInput, CarbohydrateResult,
  WeightGainInput, WeightGainResult, GainPace,
  CaloriesBurnedInput, CaloriesBurnedResult, CaloriesBurnedActivity,
  ProteinInput, ProteinResult, ProteinGoal,
  WaterInput, WaterResult,
  ActivityLevel,
} from '@/types';

// ─── Unit Helpers ─────────────────────────────────────────────────────────────

const toKg   = (lbs: number)  => lbs * 0.453592;
const toCm   = (inch: number) => inch * 2.54;

// ─── BMI ─────────────────────────────────────────────────────────────────────
// Formula: weight(kg) / height(m)²

export function calcBMI(input: BMIInput): BMIResult {
  const weightKg = input.unit === 'imperial' ? toKg(input.weight) : input.weight;
  const heightM  = input.unit === 'imperial' ? toCm(input.height) / 100 : input.height / 100;

  const bmi = weightKg / (heightM * heightM);

  let category: string;
  let color: string;

  if (bmi < 16)        { category = 'Severe Thinness';   color = '#2980b9'; }
  else if (bmi < 17)   { category = 'Moderate Thinness'; color = '#3498db'; }
  else if (bmi < 18.5) { category = 'Mild Thinness';     color = '#5dade2'; }
  else if (bmi < 25)   { category = 'Normal weight';     color = '#2ecc71'; }
  else if (bmi < 30)   { category = 'Pre-obesity';       color = '#e67e22'; }
  else if (bmi < 35)   { category = 'Obesity Class I';   color = '#e74c3c'; }
  else if (bmi < 40)   { category = 'Obesity Class II';  color = '#c0392b'; }
  else                 { category = 'Obesity Class III'; color = '#922b21'; }

  return { bmi: +bmi.toFixed(1), category, color };
}

// ─── BMR ─────────────────────────────────────────────────────────────────────
// Mifflin-St Jeor Equation
// Male:   10×weight(kg) + 6.25×height(cm) − 5×age + 5
// Female: 10×weight(kg) + 6.25×height(cm) − 5×age − 161

export function calcBMR(input: BMRInput): BMRResult {
  const weightKg  = input.unit === 'imperial' ? toKg(input.weight)   : input.weight;
  const heightCm  = input.unit === 'imperial' ? toCm(input.height)   : input.height;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * input.age;
  const bmr  = input.gender === 'male' ? base + 5 : base - 161;

  return { bmr: Math.round(bmr) };
}

// ─── IBW ─────────────────────────────────────────────────────────────────────
// Devine Formula
// Male:   50 + 2.3 × (height_inches − 60)
// Female: 45.5 + 2.3 × (height_inches − 60)

export function calcIBW(input: IBWInput): IBWResult {
  const heightInches = input.unit === 'metric' ? input.height / 2.54 : input.height;
  const extra        = heightInches - 60;

  const ibwKg = input.gender === 'male'
    ? 50 + 2.3 * extra
    : 45.5 + 2.3 * extra;

  const ibw = input.unit === 'imperial' ? ibwKg / 0.453592 : ibwKg;

  return {
    ibw: +ibw.toFixed(1),
    range: { min: +(ibw * 0.9).toFixed(1), max: +(ibw * 1.1).toFixed(1) },
  };
}

// ─── Body Fat % ───────────────────────────────────────────────────────────────
// US Navy Method
// Male:   495 / (1.0324 − 0.19077×log10(waist−neck) + 0.15456×log10(height)) − 450
// Female: 495 / (1.29579 − 0.35004×log10(waist+hip−neck) + 0.22100×log10(height)) − 450
// All measurements in cm

export function calcBodyFat(input: BodyFatInput): BodyFatResult {
  const toCmVal = (v: number) => input.unit === 'imperial' ? toCm(v) : v;

  const heightCm = toCmVal(input.height);
  const waistCm  = toCmVal(input.waist);
  const neckCm   = toCmVal(input.neck);
  const hipCm    = input.hip ? toCmVal(input.hip) : 0;

  let bodyFatPercent: number;

  if (input.gender === 'male') {
    bodyFatPercent =
      495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    bodyFatPercent =
      495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) - 450;
  }

  bodyFatPercent = Math.max(0, +bodyFatPercent.toFixed(1));

  let category: string;
  let color: string;

  if (input.gender === 'male') {
    if (bodyFatPercent < 6)        { category = 'Essential fat'; color = '#9b59b6'; }
    else if (bodyFatPercent < 14)  { category = 'Athletes';      color = '#2ecc71'; }
    else if (bodyFatPercent < 18)  { category = 'Fitness';       color = '#27ae60'; }
    else if (bodyFatPercent < 25)  { category = 'Average';       color = '#e67e22'; }
    else                           { category = 'Obese';         color = '#e74c3c'; }
  } else {
    if (bodyFatPercent < 14)       { category = 'Essential fat'; color = '#9b59b6'; }
    else if (bodyFatPercent < 21)  { category = 'Athletes';      color = '#2ecc71'; }
    else if (bodyFatPercent < 25)  { category = 'Fitness';       color = '#27ae60'; }
    else if (bodyFatPercent < 32)  { category = 'Average';       color = '#e67e22'; }
    else                           { category = 'Obese';         color = '#e74c3c'; }
  }

  return { bodyFatPercent, category, color };
}

// ─── TDEE ─────────────────────────────────────────────────────────────────────
// TDEE = BMR × Activity Multiplier

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { label: string; factor: number }> = {
  sedentary:   { label: 'Sedentary (little or no exercise)',           factor: 1.2   },
  light:       { label: 'Lightly active (1–3 days/week)',              factor: 1.375 },
  moderate:    { label: 'Moderately active (3–5 days/week)',           factor: 1.55  },
  active:      { label: 'Very active (6–7 days/week)',                 factor: 1.725 },
  very_active: { label: 'Extra active (physical job or 2× training)',  factor: 1.9   },
};

export function calcTDEE(input: TDEEInput): TDEEResult {
  const { bmr }    = calcBMR(input);
  const { label, factor } = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const tdee       = Math.round(bmr * factor);

  return { tdee, bmr, activityLabel: label };
}

export { ACTIVITY_MULTIPLIERS };

// ─── Calorie Intake ───────────────────────────────────────────────────────────
// TDEE adjusted by weight goal delta
// WHO macronutrient split: Carbs 50%, Protein 20%, Fat 30%

const GOAL_ADJUSTMENTS: Record<string, { label: string; delta: number }> = {
  lose_fast: { label: 'Lose weight fast (−1 kg/week)',   delta: -1000 },
  lose:      { label: 'Lose weight (−0.5 kg/week)',      delta: -500  },
  maintain:  { label: 'Maintain current weight',         delta: 0     },
  gain:      { label: 'Gain weight (+0.5 kg/week)',      delta: +500  },
  gain_fast: { label: 'Gain weight fast (+1 kg/week)',   delta: +1000 },
};

export function calcCalorie(input: CalorieInput): CalorieResult {
  const { bmr }           = calcBMR(input);
  const { factor }        = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const tdee              = Math.round(bmr * factor);
  const { label, delta }  = GOAL_ADJUSTMENTS[input.goal];
  const calories          = Math.max(1200, Math.round(tdee + delta));

  // WHO macronutrient distribution: Carbs 50%, Protein 20%, Fat 30%
  const carbs   = Math.round((calories * 0.50) / 4);   // 4 kcal/g
  const protein = Math.round((calories * 0.20) / 4);   // 4 kcal/g
  const fat     = Math.round((calories * 0.30) / 9);   // 9 kcal/g

  return { calories, bmr, tdee, delta, goalLabel: label, macros: { carbs, protein, fat } };
}

export { GOAL_ADJUSTMENTS };

// ─── Weight Gain ─────────────────────────────────────────────────────────────
// Calorie target for weight gain using configurable surplus
// 1 kg body weight roughly equals 7,700 kcal (population-level estimate)

const WEIGHT_GAIN_PACES: Record<GainPace, { label: string; surplus: number }> = {
  lean:       { label: 'Lean gain (+250 kcal/day)',      surplus: 250 },
  moderate:   { label: 'Moderate gain (+500 kcal/day)',  surplus: 500 },
  aggressive: { label: 'Aggressive gain (+750 kcal/day)',surplus: 750 },
};

export function calcWeightGain(input: WeightGainInput): WeightGainResult {
  const { bmr } = calcBMR(input);
  const { factor } = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const tdee = Math.round(bmr * factor);
  const { label: gainPaceLabel, surplus } = WEIGHT_GAIN_PACES[input.gainPace];

  const calories = Math.max(1200, tdee + surplus);

  const currentWeightKg = input.unit === 'imperial' ? toKg(input.weight) : input.weight;
  const targetWeightKg = input.unit === 'imperial' ? toKg(input.targetWeight) : input.targetWeight;
  const gainKg = Math.max(0, targetWeightKg - currentWeightKg);

  const weeklyGainKg = (surplus * 7) / 7700;
  const estimatedWeeks = weeklyGainKg > 0 ? Math.max(1, Math.ceil(gainKg / weeklyGainKg)) : 0;

  // Practical weight-gain macro split
  const carbs = Math.round((calories * 0.50) / 4);
  const protein = Math.round((calories * 0.25) / 4);
  const fat = Math.round((calories * 0.25) / 9);

  return {
    calories,
    bmr,
    tdee,
    surplus,
    gainPaceLabel,
    estimatedWeeks,
    macros: { carbs, protein, fat },
  };
}

export { WEIGHT_GAIN_PACES };

// ─── Carbohydrate ────────────────────────────────────────────────────────────
// Daily carbohydrate grams based on calorie target.
// Single estimate uses 55% as a practical midpoint and always shows WHO range.
// carbs grams = (calories × carbohydrate %) / 4 kcal per gram

export function calcCarbohydrate(input: CarbohydrateInput): CarbohydrateResult {
  const { bmr } = calcBMR(input);
  const { factor } = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const tdee = Math.round(bmr * factor);

  const { label: goalLabel, delta } = GOAL_ADJUSTMENTS[input.goal];
  const calories = Math.max(1200, Math.round(tdee + delta));

  const percent = 0.55;
  const carbsGrams = Math.round((calories * percent) / 4);

  return {
    carbsGrams,
    carbPercent: Math.round(percent * 100),
    calories,
    bmr,
    tdee,
    goalLabel,
    whoRange: {
      min: Math.round((calories * 0.45) / 4),
      max: Math.round((calories * 0.75) / 4),
    },
  };
}

// ─── Calories Burned ─────────────────────────────────────────────────────────
// Calories burned = MET × body weight (kg) × duration (hours)
// Equivalent minute form: (MET × 3.5 × weight kg / 200) × minutes

const CALORIES_BURNED_ACTIVITIES: Record<CaloriesBurnedActivity, { label: string; met: number }> = {
  walking_slow:      { label: 'Walking (slow, ~3.2 km/h)',        met: 2.8 },
  walking_brisk:     { label: 'Walking (brisk, ~5.6 km/h)',       met: 4.3 },
  running_8kph:      { label: 'Running (~8 km/h)',                met: 8.3 },
  running_10kph:     { label: 'Running (~10 km/h)',               met: 9.8 },
  cycling_leisure:   { label: 'Cycling (leisure, <16 km/h)',      met: 4.0 },
  cycling_vigorous:  { label: 'Cycling (vigorous, 19-22 km/h)',   met: 10.0 },
  swimming_moderate: { label: 'Swimming (moderate effort)',       met: 6.0 },
  jump_rope:         { label: 'Jump rope (moderate-vigorous)',    met: 11.8 },
  strength_training: { label: 'Strength training (general)',      met: 3.5 },
  yoga_hatha:        { label: 'Yoga (Hatha)',                     met: 2.5 },
};

export function calcCaloriesBurned(input: CaloriesBurnedInput): CaloriesBurnedResult {
  const weightKg = input.unit === 'imperial' ? toKg(input.weight) : input.weight;
  const { label, met } = CALORIES_BURNED_ACTIVITIES[input.activity];

  const caloriesPerHour = met * weightKg;
  const caloriesBurned = caloriesPerHour * (input.minutes / 60);

  return {
    caloriesBurned: Math.round(caloriesBurned),
    caloriesPerHour: Math.round(caloriesPerHour),
    met,
    activityLabel: label,
  };
}

export { CALORIES_BURNED_ACTIVITIES };

// ─── Protein Intake ───────────────────────────────────────────────────────────
// Formula: Protein (g/day) = Body Weight (kg) × Goal Multiplier (g/kg/day)
// WHO/FAO/UNU TRS 935 safe level: 0.83 g/kg/day
// Ranges from ISSN Position Stand (2017) and WHO/FAO/UNU evidence review

const PROTEIN_GOALS: Record<ProteinGoal, { label: string; multiplier: number }> = {
  sedentary:   { label: 'Sedentary adult (WHO safe level)',              multiplier: 0.83 },
  weight_loss: { label: 'Weight loss (preserve lean mass)',              multiplier: 1.2  },
  active:      { label: 'Active / regular fitness training',             multiplier: 1.4  },
  muscle_gain: { label: 'Muscle gain / body recomposition',              multiplier: 1.8  },
  athlete:     { label: 'Athlete (intense or twice-daily training)',     multiplier: 2.0  },
  elderly:     { label: 'Elderly (65+, preserve muscle mass)',           multiplier: 1.2  },
};

export function calcProtein(input: ProteinInput): ProteinResult {
  const weightKg = input.unit === 'imperial' ? toKg(input.weight) : input.weight;
  const { label, multiplier } = PROTEIN_GOALS[input.goal];

  const proteinGrams   = Math.round(weightKg * multiplier);
  const proteinCalories = proteinGrams * 4;
  const whoMinimum     = Math.round(weightKg * 0.83);
  const perMealTarget  = Math.round(proteinGrams / 3);

  return { proteinGrams, proteinCalories, multiplier, goalLabel: label, whoMinimum, perMealTarget };
}

export { PROTEIN_GOALS };

// ─── Water Intake ─────────────────────────────────────────────────────────────
// Base: Weight (kg) × 35 mL/kg/day
// Activity bonus added on top of base.
// EFSA (2010) adequate intake: men 2.5 L/day, women 2.0 L/day (from beverages)
// IOM (2005) total water AI:  men 3.7 L/day, women 2.7 L/day (incl. food water)

const WATER_ACTIVITY_ADJUSTMENTS: Record<ActivityLevel, { label: string; bonusMl: number }> = {
  sedentary:   { label: 'Sedentary (little or no exercise)',          bonusMl: 0    },
  light:       { label: 'Lightly active (1–3 days/week)',             bonusMl: 350  },
  moderate:    { label: 'Moderately active (3–5 days/week)',          bonusMl: 700  },
  active:      { label: 'Very active (6–7 days/week)',                bonusMl: 1050 },
  very_active: { label: 'Extra active (physical job or 2× training)', bonusMl: 1400 },
};

export function calcWater(input: WaterInput): WaterResult {
  const weightKg = input.unit === 'imperial' ? toKg(input.weight) : input.weight;
  const { label, bonusMl } = WATER_ACTIVITY_ADJUSTMENTS[input.activityLevel];

  const waterMl     = Math.round(weightKg * 35 + bonusMl);
  const waterLitres = +(waterMl / 1000).toFixed(2);
  const waterFlOz   = Math.round(waterMl * 0.033814);
  const perHourMl   = Math.round(waterMl / 16); // spread across 16 waking hours

  return {
    waterMl,
    waterLitres,
    waterFlOz,
    perHourMl,
    activityLabel: label,
    efsaRef: { men: 2.5, women: 2.0 },
  };
}

export { WATER_ACTIVITY_ADJUSTMENTS };

// ─── Body Type ────────────────────────────────────────────────────────────────
// Body shape derived from bust / waist / hip ratios
// WHR (Waist-to-Hip Ratio) uses WHO thresholds for cardiovascular risk

export function calcBodyType(input: BodyTypeInput): BodyTypeResult {
  const toCmVal = (v: number) => input.unit === 'imperial' ? toCm(v) : v;

  const waist = toCmVal(input.waist);
  const hip   = toCmVal(input.hip);
  const bust  = toCmVal(input.bust);

  const whr = +(waist / hip).toFixed(2);

  // WHO WHR thresholds (abdominal obesity risk)
  // Male thresholds not applicable here — shape calculator is gender-neutral
  // using female thresholds as the general population baseline
  let whrCategory: string;
  let whrColor: string;
  if (whr < 0.80)       { whrCategory = 'Low Risk';      whrColor = '#2ecc71'; }
  else if (whr < 0.85)  { whrCategory = 'Moderate Risk'; whrColor = '#e67e22'; }
  else                  { whrCategory = 'High Risk';      whrColor = '#e74c3c'; }

  // Body shape classification via bust / waist / hip ratios
  const bustHipDiff  = bust - hip;
  const hipBustDiff  = hip - bust;
  const waistHipRatio  = waist / hip;
  const waistBustRatio = waist / bust;

  let shape: string;
  let color: string;
  let desc: string;
  let riskLevel: string;

  if (waistHipRatio >= 0.85 || waistBustRatio >= 0.85) {
    shape     = 'Apple';
    color     = '#e74c3c';
    desc      = 'Weight is concentrated around the midsection. Central fat distribution is associated with the highest cardiovascular and metabolic risk — the most important shape to address proactively.';
    riskLevel = 'High';
  } else if (hipBustDiff >= 5 && waistHipRatio < 0.75) {
    shape     = 'Pear';
    color     = '#3498db';
    desc      = 'Hips are notably wider than bust, with a well-defined waist. Peripheral fat distribution carries significantly lower cardiovascular risk than central fat. A positive shape profile from a metabolic standpoint.';
    riskLevel = 'Low to Moderate';
  } else if (Math.abs(bustHipDiff) <= 5 && waistHipRatio < 0.75) {
    shape     = 'Hourglass';
    color     = '#9b59b6';
    desc      = 'Bust and hips are balanced with a clearly defined, narrow waist. Fat is distributed peripherally rather than centrally. Health outcomes depend primarily on overall body fat percentage, not shape alone.';
    riskLevel = 'Low';
  } else if (bustHipDiff >= 5 && waistBustRatio >= 0.75) {
    shape     = 'Inverted Triangle';
    color     = '#e67e22';
    desc      = 'Bust and shoulders are wider than hips with less waist definition. Often associated with higher muscle mass in the upper body. Risk depends on total body fat percentage and cardiovascular fitness.';
    riskLevel = 'Low to Moderate';
  } else {
    shape     = 'Rectangle';
    color     = '#27ae60';
    desc      = 'Bust, waist, and hips are close in measurement with minimal waist definition. A straight, athletic build. Health risk depends on total body fat and lifestyle — the lack of curvature can occasionally mask early central fat accumulation.';
    riskLevel = 'Low to Moderate';
  }

  return { shape, whr, whrCategory, whrColor, color, desc, riskLevel };
}
