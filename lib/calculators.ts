import {
  BMIInput, BMIResult,
  BMRInput, BMRResult,
  IBWInput, IBWResult,
  BodyFatInput, BodyFatResult,
  TDEEInput, TDEEResult,
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