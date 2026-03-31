'use server';

import { getCurrentUser } from '@/lib/server/auth/session';
import { saveReading } from '@/lib/server/dal/readings';

export interface SaveReadingResult {
  success: boolean;
  error?: 'unauthenticated' | 'invalid' | 'server_error';
}

export async function saveReadingAction(
  calculatorType: string,
  inputs: Record<string, unknown>,
  result: Record<string, unknown>,
): Promise<SaveReadingResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'unauthenticated' };
    if (!calculatorType || !inputs || !result) return { success: false, error: 'invalid' };

    await saveReading(user.id, calculatorType, inputs, result);
    return { success: true };
  } catch {
    return { success: false, error: 'server_error' };
  }
}
