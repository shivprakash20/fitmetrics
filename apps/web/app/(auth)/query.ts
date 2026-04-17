export type QueryValue = string | string[] | undefined;
export type QueryParams = Record<string, QueryValue>;

export function getQueryValue(params: QueryParams, key: string): string {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}
