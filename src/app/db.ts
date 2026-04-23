import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// adding prisma client options to prisma client here
const prismaClientSingleton = () => {
  const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
  return new PrismaClient({adapter});
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();


if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

// checks for the db connection
export async function dbConnectionTest(): Promise<boolean> {
    try {
        prisma.$connect()
        return true;
    } catch {
        return false;
    }
};