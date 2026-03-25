import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma_v2: PrismaClient | undefined;
  pool_v2: Pool | undefined;
};

const pool = globalForPrisma.pool_v2 ?? new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma_v2 ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma_v2 = prisma;
  globalForPrisma.pool_v2 = pool;
}
