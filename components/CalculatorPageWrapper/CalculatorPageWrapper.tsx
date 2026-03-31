import { getCurrentUser } from '@/lib/server/auth/session';
import CalculatorPageLayout from '@/components/CalculatorPageLayout/CalculatorPageLayout';
import type { ComponentProps } from 'react';

type LayoutProps = ComponentProps<typeof CalculatorPageLayout>;
type WrapperProps = Omit<LayoutProps, 'userId'>;

// Thin async server component — resolves the current user and injects userId.
// All calculator pages use this instead of CalculatorPageLayout directly so
// they stay as simple non-async server components with no auth boilerplate.
export default async function CalculatorPageWrapper(props: WrapperProps) {
  const user = await getCurrentUser();
  return <CalculatorPageLayout {...props} userId={user?.id} />;
}
