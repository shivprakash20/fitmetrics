import CalculatorPageWrapper from '@/components/CalculatorPageWrapper/CalculatorPageWrapper';
import calc from '@/data/calculators/tdee.json';
import type { CalculatorType } from '@/types';

export const metadata = {
  title: calc.metadata.title,
  description: calc.metadata.description,
};

export default function TDEEPage() {
  const { id, ...props } = calc;
  return <CalculatorPageWrapper id={id as CalculatorType} {...props} />;
}
