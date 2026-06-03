import { prisma } from '../lib/prisma.js';
import { HttpError } from './http.js';

export async function requireScholarshipExists(id: number) {
  const scholarship = await prisma.scholarship.findUnique({ where: { id } });
  if (!scholarship) throw new HttpError(404, 'Scholarship not found');
  return scholarship;
}

export function parseIntParam(value: string) {
  return Number(value);
}
