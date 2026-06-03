export function parseInterests(input: string): string[] {
  return input.split(',').map((s) => s.trim()).filter(Boolean);
}

export function formatInterests(interests: string[] | null | undefined): string {
  return Array.isArray(interests) ? interests.join(', ') : '';
}
