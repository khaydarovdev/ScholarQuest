export function extractApiError(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string } } } | undefined;
  return err?.response?.data?.message ?? fallback;
}
