import * as PrismaClientPkg from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: any | undefined;
}

const PrismaClient = (PrismaClientPkg as any).PrismaClient;

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
