import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing in server/.env");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;