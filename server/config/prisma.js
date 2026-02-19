import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

export default prisma;
