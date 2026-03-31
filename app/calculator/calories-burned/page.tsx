import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calc from '@/data/calculators/caloriesburned.json';
import type { CalculatorType } from '@/types';

export const metadata = {
  title: calc.metadata.title,
  description: calc.metadata.description,
};

export default function CaloriesBurnedPage() {
  const { id, ...props } = calc;
  return <CalculatorPageLayout id={id as CalculatorType} {...props} />;
}
