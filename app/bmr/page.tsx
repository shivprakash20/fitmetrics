import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calculators from '@/data/calculators.json';

export const metadata = {
  title: 'BMR Calculator — Basal Metabolic Rate | FitMetrics',
  description: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Know exactly how many calories your body burns at rest.',
};

export default function BMRPage() {
  const calc = calculators.items.find(c => c.id === 'bmr');
  if (!calc) throw new Error('Calculator config "bmr" not found.');

  const { id: calcId, ...calcProps } = calc;
  if (calcId !== 'bmr') throw new Error(`Calculator ID mismatch for /bmr: ${calcId}`);

  return <CalculatorPageLayout id={calcId} {...calcProps} />;
}
