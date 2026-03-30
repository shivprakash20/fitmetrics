import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calculators from '@/data/calculators.json';

export const metadata = {
  title: 'IBW Calculator — Ideal Body Weight | FitMetrics',
  description: 'Calculate your Ideal Body Weight (IBW) using the Devine formula. Get a medically validated weight target based on your height and gender.',
};

export default function IBWPage() {
  const calc = calculators.items.find(c => c.id === 'ibw')!;
  return <CalculatorPageLayout id="ibw" {...calc} />;
}
