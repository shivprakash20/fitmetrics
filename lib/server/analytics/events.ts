import { ApiError } from '@/lib/server/http/errors';

export const ANALYTICS_EVENTS = [
  'calculator_used',
  'signup_started',
  'signup_completed',
  'gym_registration_submitted',
  'profile_updated',
  'checkout_started',
  'checkout_completed',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

type Primitive = string | number | boolean | null;

export interface AnalyticsEventPayload {
  event: AnalyticsEventName;
  page?: string;
  properties?: Record<string, Primitive>;
  timestamp?: string;
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}

function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    || value === null
  );
}

function isAnalyticsEventName(input: string): input is AnalyticsEventName {
  return ANALYTICS_EVENTS.includes(input as AnalyticsEventName);
}

export function validateAnalyticsEvent(input: unknown): AnalyticsEventPayload {
  if (!isRecord(input)) {
    throw new ApiError(400, 'INVALID_PAYLOAD', 'Analytics payload must be a JSON object.');
  }

  if (typeof input.event !== 'string' || !isAnalyticsEventName(input.event)) {
    throw new ApiError(400, 'INVALID_EVENT', 'Event name is invalid or not supported.');
  }

  if (input.page !== undefined && typeof input.page !== 'string') {
    throw new ApiError(400, 'INVALID_PAGE', 'Page must be a string when provided.');
  }

  if (input.timestamp !== undefined && typeof input.timestamp !== 'string') {
    throw new ApiError(400, 'INVALID_TIMESTAMP', 'Timestamp must be an ISO string when provided.');
  }

  if (input.properties !== undefined) {
    if (!isRecord(input.properties)) {
      throw new ApiError(400, 'INVALID_PROPERTIES', 'Properties must be a key-value object.');
    }

    for (const value of Object.values(input.properties)) {
      if (!isPrimitive(value)) {
        throw new ApiError(400, 'INVALID_PROPERTIES', 'Property values must be primitive values.');
      }
    }
  }

  return {
    event: input.event,
    page: input.page as string | undefined,
    timestamp: input.timestamp as string | undefined,
    properties: input.properties as Record<string, Primitive> | undefined,
  };
}
