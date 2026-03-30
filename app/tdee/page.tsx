import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calculators from '@/data/calculators.json';

export const metadata = {
  title: 'TDEE Calculator — Total Daily Energy Expenditure | FitMetrics',
  description: 'Calculate your Total Daily Energy Expenditure (TDEE) to know exactly how many calories you need per day to lose, maintain, or gain weight.',
};

export default function TDEEPage() {
  const calc = calculators.items.find(c => c.id === 'tdee')!;
  return <CalculatorPageLayout id="tdee" {...calc} />;
}
