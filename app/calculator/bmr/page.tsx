import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calculators from '@/data/calculators.json';
import type { CalculatorType } from '@/types';

const calc = calculators.items.find(c => c.id === 'bmr')!;

export const metadata = {
  title: calc.metadata.title,
  description: calc.metadata.description,
};

export default function BMRPage() {
  if (!calc) throw new Error('Calculator config "bmr" not found.');
  const { id: calcId, ...calcProps } = calc;
  return <CalculatorPageLayout id={calcId as CalculatorType} {...calcProps} />;
}
