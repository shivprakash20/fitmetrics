import 'server-only';
import { prisma } from '@/lib/server/db/prisma';

const MAX_PER_CALCULATOR = 2;

// Primary metric key per calculator type — used for trend comparison
const PRIMARY_METRIC: Record<string, string> = {
  bmi:            'bmi',
  bmr:            'bmr',
  ibw:            'ibw',
  bodyfat:        'bodyFatPercent',
  tdee:           'tdee',
  calorie:        'calories',
  carbohydrate:   'carbsGrams',
  caloriesburned: 'caloriesBurned',
  bodytype:       'whr',
  protein:        'proteinGrams',
  water:          'waterLitres',
  'weight-loss':  'calories',
  'weight-gain':  'calories',
  weightloss:     'calories',
  weightgain:     'calories',
};

export type TrendDirection = 'up' | 'down' | 'flat' | 'none';

export interface ReadingWithTrend {
  id: string;
  calculatorType: string;
  inputs: Record<string, unknown>;
  result: Record<string, unknown>;
  savedAt: Date;
  trend: TrendDirection;
  previousValue: number | null;
  currentValue: number | null;
}

export interface ProfileReadings {
  latest: ReadingWithTrend[];
  recent: ReadingWithTrend[];
}

function extractMetric(result: Record<string, unknown>, type: string): number | null {
  const key = PRIMARY_METRIC[type];
  if (!key) return null;
  const val = result[key];
  return typeof val === 'number' ? val : null;
}

function calcTrend(current: number | null, previous: number | null): TrendDirection {
  if (current === null || previous === null) return 'none';
  if (Math.abs(current - previous) < 0.001) return 'flat';
  return current > previous ? 'up' : 'down';
}

// ─── Save a reading, then prune to keep only the latest MAX_PER_CALCULATOR ────
export async function saveReading(
  userId: string,
  calculatorType: string,
  inputs: Record<string, unknown>,
  result: Record<string, unknown>,
) {
  // Prisma Json fields require unknown → unknown cast via intermediate
  await prisma.calculatorReading.create({
    data: {
      userId,
      calculatorType,
      inputs:  inputs  as never,
      result:  result  as never,
    },
  });

  // Prune: delete oldest beyond the limit
  const all = await prisma.calculatorReading.findMany({
    where: { userId, calculatorType },
    orderBy: { savedAt: 'desc' },
    select: { id: true },
  });

  if (all.length > MAX_PER_CALCULATOR) {
    const toDelete = all.slice(MAX_PER_CALCULATOR).map(r => r.id);
    await prisma.calculatorReading.deleteMany({ where: { id: { in: toDelete } } });
  }
}

// ─── Get all readings for the profile dashboard ───────────────────────────────
export async function getReadingsForProfile(userId: string): Promise<ProfileReadings> {
  const all = await prisma.calculatorReading.findMany({
    where: { userId },
    orderBy: { savedAt: 'desc' },
  });

  type DbRow = typeof all[number];

  // Group by calculatorType to compute trends
  const grouped = new Map<string, DbRow[]>();
  for (const r of all) {
    const arr = grouped.get(r.calculatorType) ?? [];
    arr.push(r);
    grouped.set(r.calculatorType, arr);
  }

  function withTrend(r: DbRow, type: string, group: DbRow[]): ReadingWithTrend {
    const res     = r.result as Record<string, unknown>;
    const current = extractMetric(res, type);
    const older   = group.find(g => g.id !== r.id && g.savedAt < r.savedAt);
    const previous = older
      ? extractMetric(older.result as Record<string, unknown>, type)
      : null;
    return {
      id:             r.id,
      calculatorType: r.calculatorType,
      inputs:         r.inputs as Record<string, unknown>,
      result:         res,
      savedAt:        r.savedAt,
      trend:          calcTrend(current, previous),
      currentValue:   current,
      previousValue:  previous,
    };
  }

  // Latest: one per calculator type (first in each group — already sorted desc)
  const latest: ReadingWithTrend[] = [];
  for (const [type, group] of grouped) {
    latest.push(withTrend(group[0], type, group));
  }
  latest.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());

  // Recent: last 5 across all types
  const recent = all.slice(0, 5).map(r => {
    const group = grouped.get(r.calculatorType) ?? [r];
    return withTrend(r, r.calculatorType, group);
  });

  return { latest, recent };
}
