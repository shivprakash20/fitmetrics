import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calculators from '@/data/calculators.json';

export const metadata = {
  title: 'Body Fat Calculator — US Navy Method | FitMetrics',
  description: 'Estimate your body fat percentage using the US Navy circumference method. No equipment needed — just a tape measure.',
};

export default function BodyFatPage() {
  const calc = calculators.items.find(c => c.id === 'bodyfat');
  if (!calc) throw new Error('Calculator config "bodyfat" not found.');

  const { id: calcId, ...calcProps } = calc;
  if (calcId !== 'bodyfat') throw new Error(`Calculator ID mismatch for /body-fat: ${calcId}`);

  return <CalculatorPageLayout id={calcId} {...calcProps} />;
}
