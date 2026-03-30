import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calculators from '@/data/calculators.json';

export const metadata = {
  title: 'BMI Calculator — Body Mass Index | FitMetrics',
  description: 'Calculate your Body Mass Index (BMI) using the WHO standard formula. Find out if you are underweight, normal weight, overweight, or obese.',
};

export default function BMIPage() {
  const calc = calculators.items.find(c => c.id === 'bmi');
  if (!calc) throw new Error('Calculator config "bmi" not found.');

  const { id: calcId, ...calcProps } = calc;
  if (calcId !== 'bmi') throw new Error(`Calculator ID mismatch for /bmi: ${calcId}`);

  return <CalculatorPageLayout id={calcId} {...calcProps} />;
}
