import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import calc from '@/data/calculators/bodytype.json';
import type { CalculatorType } from '@/types';

export const metadata = {
  title: calc.metadata.title,
  description: calc.metadata.description,
};

export default function BodyTypePage() {
  const { id, ...props } = calc;
  return <CalculatorPageLayout id={id as CalculatorType} {...props} />;
}
