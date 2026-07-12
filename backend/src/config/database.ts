// ============================================================
// EcoSphere — Prisma Database Client (Singleton)
// ============================================================

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.isDev ? ['query', 'error', 'warn'] : ['error'],
  });

if (!env.isProd) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
