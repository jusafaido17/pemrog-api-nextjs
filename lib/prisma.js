// import { PrismaClient } from "@/app/generated/prisma/client"; //comment client lama
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(withAccelerate()); 

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
