'use client';

import { useState } from 'react';
import { CalculatorType, Gender, UnitSystem, ActivityLevel } from '@/types';
import {
  calcBMI, calcBMR, calcIBW, calcBodyFat, calcTDEE, ACTIVITY_MULTIPLIERS,
} from '@/lib/calculators';
import styles from './page.module.scss';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS: { id: CalculatorType; label: string; short: string }[] = [
  { id: 'bmi',     label: 'Body Mass Index',           short: 'BMI'  },
  { id: 'bmr',     label: 'Basal Metabolic Rate',      short: 'BMR'  },
  { id: 'ibw',     label: 'Ideal Body Weight',         short: 'IBW'  },
  { id: 'bodyfat', label: 'Body Fat Percentage',       short: 'Body Fat' },
  { id: 'tdee',    label: 'Total Daily Energy',        short: 'TDEE' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CalculatorPage() {
  const [activeTab, setActiveTab]     = useState<CalculatorType>('bmi');
  const [unit, setUnit]               = useState<UnitSystem>('metric');
  const [gender, setGender]           = useState<Gender>('male');
  const [weight, setWeight]           = useState('');
  const [height, setHeight]           = useState('');
  const [age, setAge]                 = useState('');
  const [neck, setNeck]               = useState('');
  const [waist, setWaist]             = useState('');
  const [hip, setHip]                 = useState('');
  const [activity, setActivity]       = useState<ActivityLevel>('sedentary');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult]           = useState<any | null>(null);
  const [error, setError]             = useState('');

  const wLabel = unit === 'metric' ? 'kg' : 'lbs';
  const hLabel = unit === 'metric' ? 'cm' : 'in';

  function resetResult() {
    setResult(null);
    setError('');
  }

  function handleTabChange(tab: CalculatorType) {
    setActiveTab(tab);
    resetResult();
  }

  function handleUnitChange(u: UnitSystem) {
    setUnit(u);
    resetResult();
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
  }

  function validate(...vals: string[]): boolean {
    return vals.every(v => v !== '' && !isNaN(Number(v)) && Number(v) > 0);
  }

  function handleCalculate() {
    setError('');
    setResult(null);

    try {
      if (activeTab === 'bmi') {
        if (!validate(weight, height)) return setError('Please enter valid weight and height.');
        setResult(calcBMI({ weight: +weight, height: +height, unit }));
      }

      else if (activeTab === 'bmr') {
        if (!validate(weight, height, age)) return setError('Please enter valid weight, height, and age.');
        setResult(calcBMR({ weight: +weight, height: +height, age: +age, gender, unit }));
      }

      else if (activeTab === 'ibw') {
        if (!validate(height)) return setError('Please enter a valid height.');
        setResult(calcIBW({ height: +height, gender, unit }));
      }

      else if (activeTab === 'bodyfat') {
        if (gender === 'female') {
          if (!validate(height, neck, waist, hip))
            return setError('Please fill all measurements including hip.');
        } else {
          if (!validate(height, neck, waist))
            return setError('Please fill all measurements.');
        }
        setResult(calcBodyFat({
          gender, height: +height,
          neck: +neck, waist: +waist, hip: hip ? +hip : undefined, unit,
        }));
      }

      else if (activeTab === 'tdee') {
        if (!validate(weight, height, age)) return setError('Please enter valid weight, height, and age.');
        setResult(calcTDEE({ weight: +weight, height: +height, age: +age, gender, unit, activityLevel: activity }));
      }
    } catch {
      setError('Something went wrong. Please check your inputs.');
    }
  }

  const showAge     = ['bmr', 'tdee'].includes(activeTab);
  const showGender  = ['bmr', 'ibw', 'bodyfat', 'tdee'].includes(activeTab);
  const showBody    = activeTab === 'bodyfat';
  const showActivity = activeTab === 'tdee';
  const showWeight  = !['ibw', 'bodyfat'].includes(activeTab);

  return (
    <main className={styles.main}>
      <div className="container">

        {/* Page header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Health Calculators</h1>
          <p className={styles.pageSubtitle}>
            Calculate your key body metrics using clinically validated formulas
          </p>
        </div>

        {/* Calculator card */}
        <div className={styles.card}>

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className={styles.tabShort}>{tab.short}</span>
                <span className={styles.tabFull}>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.body}>

            {/* Unit toggle */}
            <div className={styles.unitToggle}>
              <span className={styles.toggleLabel}>Unit System</span>
              <div className={styles.toggleBtns}>
                <button
                  className={`${styles.toggleBtn} ${unit === 'metric' ? styles.toggleActive : ''}`}
                  onClick={() => handleUnitChange('metric')}
                >
                  Metric
                </button>
                <button
                  className={`${styles.toggleBtn} ${unit === 'imperial' ? styles.toggleActive : ''}`}
                  onClick={() => handleUnitChange('imperial')}
                >
                  Imperial
                </button>
              </div>
            </div>

            {/* Inputs grid */}
            <div className={styles.grid}>

              {/* Gender */}
              {showGender && (
                <div className={styles.field}>
                  <label className={styles.label}>Gender</label>
                  <div className={styles.segmented}>
                    <button
                      className={`${styles.segBtn} ${gender === 'male' ? styles.segActive : ''}`}
                      onClick={() => { setGender('male'); resetResult(); }}
                    >
                      Male
                    </button>
                    <button
                      className={`${styles.segBtn} ${gender === 'female' ? styles.segActive : ''}`}
                      onClick={() => { setGender('female'); resetResult(); }}
                    >
                      Female
                    </button>
                  </div>
                </div>
              )}

              {/* Weight */}
              {showWeight && (
                <div className={styles.field}>
                  <label className={styles.label}>Weight ({wLabel})</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                    value={weight}
                    onChange={e => { setWeight(e.target.value); resetResult(); }}
                  />
                </div>
              )}

              {/* Height */}
              <div className={styles.field}>
                <label className={styles.label}>Height ({hLabel})</label>
                <input
                  className={styles.input}
                  type="number"
                  min="1"
                  placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                  value={height}
                  onChange={e => { setHeight(e.target.value); resetResult(); }}
                />
              </div>

              {/* Age */}
              {showAge && (
                <div className={styles.field}>
                  <label className={styles.label}>Age (years)</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 25"
                    value={age}
                    onChange={e => { setAge(e.target.value); resetResult(); }}
                  />
                </div>
              )}

              {/* Body measurements */}
              {showBody && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label}>Neck ({hLabel})</label>
                    <input
                      className={styles.input}
                      type="number"
                      min="1"
                      placeholder={unit === 'metric' ? 'e.g. 38' : 'e.g. 15'}
                      value={neck}
                      onChange={e => { setNeck(e.target.value); resetResult(); }}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Waist ({hLabel})</label>
                    <input
                      className={styles.input}
                      type="number"
                      min="1"
                      placeholder={unit === 'metric' ? 'e.g. 80' : 'e.g. 32'}
                      value={waist}
                      onChange={e => { setWaist(e.target.value); resetResult(); }}
                    />
                  </div>
                  {gender === 'female' && (
                    <div className={styles.field}>
                      <label className={styles.label}>Hip ({hLabel})</label>
                      <input
                        className={styles.input}
                        type="number"
                        min="1"
                        placeholder={unit === 'metric' ? 'e.g. 95' : 'e.g. 37'}
                        value={hip}
                        onChange={e => { setHip(e.target.value); resetResult(); }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Activity level */}
              {showActivity && (
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>Activity Level</label>
                  <select
                    className={styles.select}
                    value={activity}
                    onChange={e => { setActivity(e.target.value as ActivityLevel); resetResult(); }}
                  >
                    {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Error */}
            {error && <p className={styles.error}>{error}</p>}

            {/* Calculate button */}
            <button className={styles.calcBtn} onClick={handleCalculate}>
              Calculate
            </button>

            {/* Result */}
            {result && <ResultPanel tab={activeTab} result={result} unit={unit} />}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Result Panel ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResultPanel({ tab, result, unit }: { tab: CalculatorType; result: any; unit: UnitSystem }) {
  const wUnit = unit === 'metric' ? 'kg' : 'lbs';

  return (
    <div className={styles.result}>
      <h3 className={styles.resultTitle}>Your Result</h3>

      {tab === 'bmi' && (
        <>
          <div className={styles.bigNumber} style={{ color: result.color as string }}>
            {result.bmi as number}
          </div>
          <div className={styles.badge} style={{ background: `${result.color}22`, color: result.color as string }}>
            {result.category as string}
          </div>
          <BMIScale bmi={result.bmi as number} />
        </>
      )}

      {tab === 'bmr' && (
        <>
          <div className={styles.bigNumber}>{result.bmr as number}</div>
          <p className={styles.resultNote}>calories / day (at complete rest)</p>
        </>
      )}

      {tab === 'ibw' && (
        <>
          <div className={styles.bigNumber}>{result.ibw as number} <span className={styles.unit}>{wUnit}</span></div>
          <p className={styles.resultNote}>
            Healthy range: {(result.range as { min: number; max: number }).min} – {(result.range as { min: number; max: number }).max} {wUnit}
          </p>
        </>
      )}

      {tab === 'bodyfat' && (
        <>
          <div className={styles.bigNumber} style={{ color: result.color as string }}>
            {result.bodyFatPercent as number}%
          </div>
          <div className={styles.badge} style={{ background: `${result.color}22`, color: result.color as string }}>
            {result.category as string}
          </div>
        </>
      )}

      {tab === 'tdee' && (
        <>
          <div className={styles.bigNumber}>{result.tdee as number}</div>
          <p className={styles.resultNote}>calories / day to maintain weight</p>
          <div className={styles.tdeeGrid}>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>BMR</span>
              <span className={styles.tdeeVal}>{result.bmr as number} kcal</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>Activity</span>
              <span className={styles.tdeeVal}>{result.activityLabel as string}</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>To lose weight</span>
              <span className={styles.tdeeVal}>{(result.tdee as number) - 500} kcal/day</span>
            </div>
            <div className={styles.tdeeItem}>
              <span className={styles.tdeeSub}>To gain weight</span>
              <span className={styles.tdeeVal}>{(result.tdee as number) + 500} kcal/day</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── BMI Scale visual ─────────────────────────────────────────────────────────

function BMIScale({ bmi }: { bmi: number }) {
  const MIN = 15, MAX = 40;
  const clamp = Math.min(Math.max(bmi, MIN), MAX);
  const pct   = ((clamp - MIN) / (MAX - MIN)) * 100;

  const zones = [
    { label: 'Under', end: (18.5 - MIN) / (MAX - MIN) * 100, color: '#3498db' },
    { label: 'Normal', end: (25 - MIN) / (MAX - MIN) * 100,  color: '#2ecc71' },
    { label: 'Over',  end: (30 - MIN) / (MAX - MIN) * 100,   color: '#e67e22' },
    { label: 'Obese', end: 100,                               color: '#e74c3c' },
  ];

  return (
    <div className={styles.scale}>
      <div className={styles.scaleTrack}>
        {zones.map((z, i) => (
          <div
            key={z.label}
            className={styles.scaleZone}
            style={{
              width: `${z.end - (i > 0 ? zones[i - 1].end : 0)}%`,
              background: z.color,
            }}
          />
        ))}
        <div className={styles.scaleMarker} style={{ left: `${pct}%` }} />
      </div>
      <div className={styles.scaleLabels}>
        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
      </div>
    </div>
  );
}