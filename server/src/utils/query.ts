export function insensitiveContains(value: string): { contains: string; mode: 'insensitive' } {
  return { contains: value, mode: 'insensitive' };
}

export function textSearch(fields: string[], term: string) {
  return fields.map((field) => ({ [field]: insensitiveContains(term) }));
}
