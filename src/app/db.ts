import { PrismaClient } from '@prisma/client';

// adding prisma client options to prisma client here
const prismaClientSingleton = () => {
  return new PrismaClient({accelerateUrl: process.env.DATABASE_URL});
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();


if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export async function dbConnectionTest(): Promise<boolean> {
    try {
        prisma.$connect()
        return true;
    } catch {
        return false;
    }
};