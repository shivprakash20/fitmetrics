'use client';

import { useState } from 'react';
import type { CalculatorType, Gender, UnitSystem, ActivityLevel } from '@/types';
import { calcBMI, calcBMR, calcIBW, calcBodyFat, calcTDEE, ACTIVITY_MULTIPLIERS } from '@/lib/calculators';
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
  const [activity, setActivity] = useState<ActivityLevel>('sedentary');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult]     = useState<any | null>(null);
  const [error, setError]       = useState('');

  const wLabel = unit === 'metric' ? 'kg' : 'lbs';
  const hLabel = unit === 'metric' ? 'cm' : 'in';

  function reset() { setResult(null); setError(''); }

  function handleUnitChange(u: UnitSystem) {
    setUnit(u); reset();
    setWeight(''); setHeight(''); setNeck(''); setWaist(''); setHip('');
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
      }
    } catch {
      setError('Something went wrong. Please check your inputs.');
    }
  }

  const showGender   = ['bmr', 'ibw', 'bodyfat', 'tdee'].includes(type);
  const showWeight   = !['ibw', 'bodyfat'].includes(type);
  const showAge      = ['bmr', 'tdee'].includes(type);
  const showBody     = type === 'bodyfat';
  const showActivity = type === 'tdee';

  return (
    <div className={styles.card}>
      <div className={styles.body}>

        {/* Unit toggle */}
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
    </div>
  );
}

// ─── BMI Scale ────────────────────────────────────────────────────────────────
function BMIScale({ bmi }: { bmi: number }) {
  const MIN = 15, MAX = 40;
  const pct = ((Math.min(Math.max(bmi, MIN), MAX) - MIN) / (MAX - MIN)) * 100;
  const zones = [
    { label: 'Under', end: (18.5 - MIN) / (MAX - MIN) * 100, color: '#3498db' },
    { label: 'Normal', end: (25 - MIN) / (MAX - MIN) * 100,  color: '#2ecc71' },
    { label: 'Over',   end: (30 - MIN) / (MAX - MIN) * 100,  color: '#e67e22' },
    { label: 'Obese',  end: 100,                              color: '#e74c3c' },
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
        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
      </div>
    </div>
  );
}
