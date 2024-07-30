export function patchIfPresent<T, K extends keyof T>(
  source: Partial<T>,
  key: K,
  value: T[K] | undefined | null,
): Partial<T> {
  if (value === undefined) return source;
  (source as any)[key] = value;
  return source;
}
