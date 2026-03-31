'use client';

import { useState } from 'react';
import type {
  CalculatorType, Gender, UnitSystem, ActivityLevel, WeightGoal, CaloriesBurnedActivity, ProteinGoal, GainPace, LossPace,
} from '@/types';
import {
  calcBMI, calcBMR, calcIBW, calcBodyFat, calcTDEE, calcBodyType, calcCalorie, calcCaloriesBurned, calcCarbohydrate,
  calcProtein, calcWater, calcWeightGain, calcWeightLoss,
  ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS, CALORIES_BURNED_ACTIVITIES, PROTEIN_GOALS, WEIGHT_GAIN_PACES, WEIGHT_LOSS_PACES,
} from '@/lib/calculators';
import styles from './CalculatorWidget.module.scss';

type Props = { type: CalculatorType };

export default function CalculatorWidget({ type }: Props) {
  const [unit, setUnit]         = useState<UnitSystem>('metric');
  const [gender, setGender]     = useState<Gender>('male');
  const [weight, setWeight]     = useState('');
  const [height, setHeight]     = useState('');
  const [age, setAge]           = useState('');
  const [neck, setNeck]         = useState('');
  const [waist, setWaist]       = useState('');
  const [hip, setHip]           = useState('');
  const [bust, setBust]         = useState('');
  const [minutes, setMinutes]   = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('sedentary');
  const [goal, setGoal]         = useState<WeightGoal>('maintain');
  const [gainPace, setGainPace] = useState<GainPace>('moderate');
  const [lossPace, setLossPace] = useState<LossPace>('moderate');
  const [burnActivity, setBurnActivity] = useState<CaloriesBurnedActivity>('walking_brisk');
  const [proteinGoal, setProteinGoal]   = useState<ProteinGoal>('sedentary');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult]     = useState<any | null>(null);
  const [error, setError]       = useState('');

  const wLabel = unit === 'metric' ? 'kg' : 'lbs';
  const hLabel = unit === 'metric' ? 'cm' : 'in';

  function reset() { setResult(null); setError(''); }

  function handleUnitChange(u: UnitSystem) {
    setUnit(u); reset();
    setWeight(''); setHeight(''); setNeck(''); setWaist(''); setHip(''); setBust(''); setTargetWeight('');
  }

  function validate(...vals: string[]) {
    return vals.every(v => v !== '' && !isNaN(Number(v)) && Number(v) > 0);
  }

  function handleCalculate() {
    setError(''); setResult(null);
    try {
      if (type === 'bmi') {
        if (!validate(weight, height)) return setError('Please enter valid weight and height.');
        setResult(calcBMI({ weight: +weight, height: +height, unit }));
      } else if (type === 'bmr') {
        if (!validate(weight, height, age)) return setError('Please enter valid weight, height, and age.');
        setResult(calcBMR({ weight: +weight, height: +height, age: +age, gender, unit }));
      } else if (type === 'ibw') {
        if (!validate(height)) return setError('Please enter a valid height.');
        setResult(calcIBW({ height: +height, gender, unit }));
      } else if (type === 'bodyfat') {
        if (gender === 'female') {
          if (!validate(height, neck, waist, hip)) return setError('Please fill all measurements including hip.');
        } else {
          if (!validate(height, neck, waist)) return setError('Please fill all measurements.');
        }
        setResult(calcBodyFat({ gender, height: +height, neck: +neck, waist: +waist, hip: hip ? +hip : undefined, unit }));
      } else if (type === 'tdee') {
        if (!validate(weight, height, age)) return setError('Please enter valid weight, height, and age.');
        setResult(calcTDEE({ weight: +weight, height: +height, age: +age, gender, unit, activityLevel: activity }));
      } else if (type === 'calorie') {
        if (!validate(weight, height, age)) return setError('Please enter valid weight, height, and age.');
        setResult(calcCalorie({ weight: +weight, height: +height, age: +age, gender, unit, activityLevel: activity, goal }));
      } else if (type === 'bodytype') {
        if (!validate(waist, hip, bust)) return setError('Please enter valid waist, hip, and bust measurements.');
        setResult(calcBodyType({ waist: +waist, hip: +hip, bust: +bust, unit }));
      } else if (type === 'caloriesburned') {
        if (!validate(weight, minutes)) return setError('Please enter valid weight and duration.');
        setResult(calcCaloriesBurned({ weight: +weight, minutes: +minutes, activity: burnActivity, unit }));
      } else if (type === 'carbohydrate') {
        if (!validate(weight, height, age)) return setError('Please enter valid weight, height, and age.');
        setResult(calcCarbohydrate({
          weight: +weight,
          height: +height,
          age: +age,
          gender,
          unit,
          activityLevel: activity,
          goal,
        }));
      } else if (type === 'weightgain') {
        if (!validate(weight, height, age, targetWeight)) return setError('Please enter valid current/target weight, height, and age.');
        if (+targetWeight <= +weight) return setError('Target weight must be greater than current weight.');
        setResult(calcWeightGain({
          weight: +weight,
          targetWeight: +targetWeight,
          height: +height,
          age: +age,
          gender,
          unit,
          activityLevel: activity,
          gainPace,
        }));
      } else if (type === 'weightloss') {
        if (!validate(weight, height, age, targetWeight)) return setError('Please enter valid current/goal weight, height, and age.');
        if (+targetWeight >= +weight) return setError('Goal weight must be lower than current weight.');
        setResult(calcWeightLoss({
          weight: +weight,
          targetWeight: +targetWeight,
          height: +height,
          age: +age,
          gender,
          unit,
          activityLevel: activity,
          lossPace,
        }));
      } else if (type === 'protein') {
        if (!validate(weight)) return setError('Please enter a valid weight.');
        setResult(calcProtein({ weight: +weight, unit, goal: proteinGoal }));
      } else if (type === 'water') {
        if (!validate(weight)) return setError('Please enter a valid weight.');
        setResult(calcWater({ weight: +weight, unit, activityLevel: activity }));
      }
    } catch {
      setError('Something went wrong. Please check your inputs.');
    }
  }

  const showUnitToggle   = true;
  const showGender       = ['bmr', 'ibw', 'bodyfat', 'tdee', 'calorie', 'carbohydrate', 'weightgain', 'weightloss'].includes(type);
  const showWeight       = !['ibw', 'bodyfat', 'bodytype'].includes(type);
  const showHeight       = !['bodytype', 'caloriesburned', 'protein', 'water'].includes(type);
  const showAge          = ['bmr', 'tdee', 'calorie', 'carbohydrate', 'weightgain', 'weightloss'].includes(type);
  const showBody         = type === 'bodyfat';
  const showActivity     = ['tdee', 'calorie', 'carbohydrate', 'weightgain', 'weightloss', 'water'].includes(type);
  const showGoal         = ['calorie', 'carbohydrate'].includes(type);
  const showBodyType     = type === 'bodytype';
  const showDuration     = type === 'caloriesburned';
  const showBurnActivity = type === 'caloriesburned';
  const showProteinGoal  = type === 'protein';
  const showGainPace     = type === 'weightgain';
  const showLossPace     = type === 'weightloss';
  const showTargetWeight = ['weightgain', 'weightloss'].includes(type);

  return (
    <div className={styles.card}>
      <div className={styles.body}>

        {/* Unit toggle */}
        {showUnitToggle && (
          <div className={styles.unitToggle}>
            <span className={styles.toggleLabel}>Unit System</span>
            <div className={styles.toggleBtns}>
              {(['metric', 'imperial'] as UnitSystem[]).map(u => (
                <button
                  key={u}
                  className={`${styles.toggleBtn} ${unit === u ? styles.toggleActive : ''}`}
                  onClick={() => handleUnitChange(u)}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inputs grid */}
        <div className={styles.grid}>

          {showGender && (
            <div className={styles.field}>
              <label className={styles.label}>Gender</label>
              <div className={styles.segmented}>
                {(['male', 'female'] as Gender[]).map(g => (
                  <button
                    key={g}
                    className={`${styles.segBtn} ${gender === g ? styles.segActive : ''}`}
                    onClick={() => { setGender(g); reset(); }}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showWeight && (
            <div className={styles.field}>
              <label className={styles.label}>Weight ({wLabel})</label>
              <input
                className={styles.input}
                type="number" min="1"
                placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                value={weight}
                onChange={e => { setWeight(e.target.value); reset(); }}
              />
            </div>
          )}

          {showHeight && (
            <div className={styles.field}>
              <label className={styles.label}>Height ({hLabel})</label>
              <input
                className={styles.input}
                type="number" min="1"
                placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                value={height}
                onChange={e => { setHeight(e.target.value); reset(); }}
              />
            </div>
          )}

          {showBodyType && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Bust ({hLabel})</label>
                <input className={styles.input} type="number" min="1"
                  placeholder={unit === 'metric' ? 'e.g. 90' : 'e.g. 35'}
                  value={bust} onChange={e => { setBust(e.target.value); reset(); }} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Waist ({hLabel})</label>
                <input className={styles.input} type="number" min="1"
                  placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 28'}
                  value={waist} onChange={e => { setWaist(e.target.value); reset(); }} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Hip ({hLabel})</label>
                <input className={styles.input} type="number" min="1"
                  placeholder={unit === 'metric' ? 'e.g. 95' : 'e.g. 37'}
                  value={hip} onChange={e => { setHip(e.target.value); reset(); }} />
              </div>
            </>
          )}

          {showAge && (
            <div className={styles.field}>
              <label className={styles.label}>Age (years)</label>
              <input
                className={styles.input}
                type="number" min="1" max="120"
                placeholder="e.g. 25"
                value={age}
                onChange={e => { setAge(e.target.value); reset(); }}
              />
            </div>
          )}

          {showTargetWeight && (
            <div className={styles.field}>
              <label className={styles.label}>{type === 'weightloss' ? 'Goal Weight' : 'Target Weight'} ({wLabel})</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                placeholder={type === 'weightloss'
                  ? (unit === 'metric' ? 'e.g. 65' : 'e.g. 143')
                  : (unit === 'metric' ? 'e.g. 75' : 'e.g. 165')}
                value={targetWeight}
                onChange={e => { setTargetWeight(e.target.value); reset(); }}
              />
            </div>
          )}

          {showBody && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Neck ({hLabel})</label>
                <input className={styles.input} type="number" min="1"
                  placeholder={unit === 'metric' ? 'e.g. 38' : 'e.g. 15'}
                  value={neck} onChange={e => { setNeck(e.target.value); reset(); }} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Waist ({hLabel})</label>
                <input className={styles.input} type="number" min="1"
                  placeholder={unit === 'metric' ? 'e.g. 80' : 'e.g. 32'}
                  value={waist} onChange={e => { setWaist(e.target.value); reset(); }} />
              </div>
              {gender === 'female' && (
                <div className={styles.field}>
                  <label className={styles.label}>Hip ({hLabel})</label>
                  <input className={styles.input} type="number" min="1"
                    placeholder={unit === 'metric' ? 'e.g. 95' : 'e.g. 37'}
                    value={hip} onChange={e => { setHip(e.target.value); reset(); }} />
                </div>
              )}
            </>
          )}

          {showActivity && (
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Activity Level</label>
              <select className={styles.select} value={activity}
                onChange={e => { setActivity(e.target.value as ActivityLevel); reset(); }}>
                {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}

          {showGoal && (
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Goal</label>
              <select className={styles.select} value={goal}
                onChange={e => { setGoal(e.target.value as WeightGoal); reset(); }}>
                {Object.entries(GOAL_ADJUSTMENTS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}

          {showDuration && (
            <div className={styles.field}>
              <label className={styles.label}>Duration (minutes)</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                placeholder="e.g. 45"
                value={minutes}
                onChange={e => { setMinutes(e.target.value); reset(); }}
              />
            </div>
          )}

          {showBurnActivity && (
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Activity</label>
              <select className={styles.select} value={burnActivity}
                onChange={e => { setBurnActivity(e.target.value as CaloriesBurnedActivity); reset(); }}>
                {Object.entries(CALORIES_BURNED_ACTIVITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}

          {showProteinGoal && (
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Goal</label>
              <select className={styles.select} value={proteinGoal}
                onChange={e => { setProteinGoal(e.target.value as ProteinGoal); reset(); }}>
                {Object.entries(PROTEIN_GOALS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}

          {showGainPace && (
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Gain Pace</label>
              <select className={styles.select} value={gainPace}
                onChange={e => { setGainPace(e.target.value as GainPace); reset(); }}>
                {Object.entries(WEIGHT_GAIN_PACES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}

          {showLossPace && (
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Loss Pace</label>
              <select className={styles.select} value={lossPace}
                onChange={e => { setLossPace(e.target.value as LossPace); reset(); }}>
                {Object.entries(WEIGHT_LOSS_PACES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.calcBtn} onClick={handleCalculate}>Calculate</button>

        {result && <ResultPanel type={type} result={result} unit={unit} />}
      </div>
    </div>
  );
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResultPanel({ type, result, unit }: { type: CalculatorType; result: any; unit: UnitSystem }) {
  const wUnit = unit === 'metric' ? 'kg' : 'lbs';

  return (
    <div className={styles.result}>
      <h3 className={styles.resultTitle}>Your Result</h3>

      {type === 'bmi' && (
        <>
          <div className={styles.bigNumber} style={{ color: result.color }}>{result.bmi}</div>
          <div className={styles.badge} style={{ background: `${result.color}22`, color: result.color }}>{result.category}</div>
          <BMIScale bmi={result.bmi} />
        </>
      )}

      {type === 'bmr' && (
        <>
          <div className={styles.bigNumber}>{result.bmr}</div>
          <p className={styles.resultNote}>calories / day (at complete rest)</p>
        </>
      )}

      {type === 'ibw' && (
        <>
          <div className={styles.bigNumber}>{result.ibw} <span className={styles.unit}>{wUnit}</span></div>
          <p className={styles.resultNote}>Healthy range: {result.range.min} – {result.range.max} {wUnit}</p>
        </>
      )}

      {type === 'bodyfat' && (
        <>
          <div className={styles.bigNumber} style={{ color: result.color }}>{result.bodyFatPercent}%</div>
          <div className={styles.badge} style={{ background: `${result.color}22`, color: result.color }}>{result.category}</div>
        </>
      )}

      {type === 'tdee' && (
        <>
          <div className={styles.bigNumber}>{result.tdee}</div>
          <p className={styles.resultNote}>calories / day to maintain weight</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>BMR</span>
              <span className={styles.tdeeVal}>{result.bmr} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Activity</span>
              <span className={styles.tdeeVal}>{result.activityLabel}</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>To lose weight</span>
              <span className={styles.tdeeVal}>{result.tdee - 500} kcal/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>To gain weight</span>
              <span className={styles.tdeeVal}>{result.tdee + 500} kcal/day</span>
            </div>
          </div>
        </>
      )}

      {type === 'calorie' && (
        <>
          <div className={styles.bigNumber}>{result.calories}</div>
          <p className={styles.resultNote}>{result.goalLabel}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>BMR</span>
              <span className={styles.tdeeVal}>{result.bmr} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>TDEE (maintenance)</span>
              <span className={styles.tdeeVal}>{result.tdee} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Carbohydrates</span>
              <span className={styles.tdeeVal}>{result.macros.carbs} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Protein</span>
              <span className={styles.tdeeVal}>{result.macros.protein} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Fat</span>
              <span className={styles.tdeeVal}>{result.macros.fat} g/day</span>
            </div>
          </div>
        </>
      )}

      {type === 'bodytype' && (
        <>
          <div className={styles.bigNumber} style={{ color: result.color }}>{result.shape}</div>
          <p className={styles.resultNote}>{result.desc}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Waist-to-Hip Ratio</span>
              <span className={styles.tdeeVal}>{result.whr}</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>WHO Risk Level</span>
              <span className={styles.tdeeVal} style={{ color: result.whrColor }}>{result.whrCategory}</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Shape Risk Profile</span>
              <span className={styles.tdeeVal}>{result.riskLevel}</span>
            </div>
          </div>
        </>
      )}

      {type === 'caloriesburned' && (
        <>
          <div className={styles.bigNumber}>{result.caloriesBurned}</div>
          <p className={styles.resultNote}>calories burned for this session</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Activity</span>
              <span className={styles.tdeeVal}>{result.activityLabel}</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>MET Value</span>
              <span className={styles.tdeeVal}>{result.met}</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Estimated burn rate</span>
              <span className={styles.tdeeVal}>{result.caloriesPerHour} kcal/hour</span>
            </div>
          </div>
        </>
      )}

      {type === 'carbohydrate' && (
        <>
          <div className={styles.bigNumber}>{result.carbsGrams} <span className={styles.unit}>g/day</span></div>
          <p className={styles.resultNote}>Midpoint estimate ({result.carbPercent}%) • {result.goalLabel}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Calorie Target</span>
              <span className={styles.tdeeVal}>{result.calories} kcal/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Carbohydrate Ratio</span>
              <span className={styles.tdeeVal}>{result.carbPercent}%</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>WHO Carb Range</span>
              <span className={styles.tdeeVal}>{result.whoRange.min}–{result.whoRange.max} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>TDEE (maintenance)</span>
              <span className={styles.tdeeVal}>{result.tdee} kcal/day</span>
            </div>
          </div>
        </>
      )}

      {type === 'weightgain' && (
        <>
          <div className={styles.bigNumber}>{result.calories}</div>
          <p className={styles.resultNote}>{result.gainPaceLabel}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>BMR</span>
              <span className={styles.tdeeVal}>{result.bmr} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>TDEE (maintenance)</span>
              <span className={styles.tdeeVal}>{result.tdee} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Daily Surplus</span>
              <span className={styles.tdeeVal}>+{result.surplus} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Estimated Timeline</span>
              <span className={styles.tdeeVal}>{result.estimatedWeeks} weeks</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Carbohydrates</span>
              <span className={styles.tdeeVal}>{result.macros.carbs} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Protein</span>
              <span className={styles.tdeeVal}>{result.macros.protein} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Fat</span>
              <span className={styles.tdeeVal}>{result.macros.fat} g/day</span>
            </div>
          </div>
        </>
      )}

      {type === 'weightloss' && (
        <>
          <div className={styles.bigNumber}>{result.calories}</div>
          <p className={styles.resultNote}>{result.lossPaceLabel}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>BMR</span>
              <span className={styles.tdeeVal}>{result.bmr} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>TDEE (maintenance)</span>
              <span className={styles.tdeeVal}>{result.tdee} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Daily Deficit</span>
              <span className={styles.tdeeVal}>-{result.deficit} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Estimated Timeline</span>
              <span className={styles.tdeeVal}>{result.estimatedWeeks} weeks</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Carbohydrates</span>
              <span className={styles.tdeeVal}>{result.macros.carbs} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Protein</span>
              <span className={styles.tdeeVal}>{result.macros.protein} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Fat</span>
              <span className={styles.tdeeVal}>{result.macros.fat} g/day</span>
            </div>
          </div>
        </>
      )}

      {type === 'water' && (
        <>
          <div className={styles.bigNumber}>{result.waterLitres} <span className={styles.unit}>L/day</span></div>
          <p className={styles.resultNote}>{result.activityLabel}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>In millilitres</span>
              <span className={styles.tdeeVal}>{result.waterMl} mL/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>In fluid ounces</span>
              <span className={styles.tdeeVal}>{result.waterFlOz} fl oz/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Per-hour sipping guide</span>
              <span className={styles.tdeeVal}>{result.perHourMl} mL/hour</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>EFSA Reference (men / women)</span>
              <span className={styles.tdeeVal}>{result.efsaRef.men} L / {result.efsaRef.women} L</span>
            </div>
          </div>
        </>
      )}

      {type === 'protein' && (
        <>
          <div className={styles.bigNumber}>{result.proteinGrams} <span className={styles.unit}>g/day</span></div>
          <p className={styles.resultNote}>{result.goalLabel}</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Multiplier Used</span>
              <span className={styles.tdeeVal}>{result.multiplier} g/kg/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Calories from Protein</span>
              <span className={styles.tdeeVal}>{result.proteinCalories} kcal/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>WHO Minimum (0.83 g/kg)</span>
              <span className={styles.tdeeVal}>{result.whoMinimum} g/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Per-Meal Target (÷3)</span>
              <span className={styles.tdeeVal}>{result.perMealTarget} g/meal</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── BMI Scale ────────────────────────────────────────────────────────────────
function BMIScale({ bmi }: { bmi: number }) {
  const MIN = 15, MAX = 42;
  const range = MAX - MIN;
  const pct = ((Math.min(Math.max(bmi, MIN), MAX) - MIN) / range) * 100;
  const zones = [
    { label: 'Underweight', end: (18.5 - MIN) / range * 100, color: '#3498db' },
    { label: 'Normal',      end: (25   - MIN) / range * 100, color: '#2ecc71' },
    { label: 'Pre-obese',   end: (30   - MIN) / range * 100, color: '#e67e22' },
    { label: 'Obese I',     end: (35   - MIN) / range * 100, color: '#e74c3c' },
    { label: 'Obese II',    end: (40   - MIN) / range * 100, color: '#c0392b' },
    { label: 'Obese III',   end: 100,                        color: '#922b21' },
  ];
  return (
    <div className={styles.scale}>
      <div className={styles.scaleTrack}>
        {zones.map((z, i) => (
          <div key={z.label} className={styles.scaleZone}
            style={{ width: `${z.end - (i > 0 ? zones[i - 1].end : 0)}%`, background: z.color }} />
        ))}
        <div className={styles.scaleMarker} style={{ left: `${pct}%` }} />
      </div>
      <div className={styles.scaleLabels}>
        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span><span>42+</span>
      </div>
    </div>
  );
}
