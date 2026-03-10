import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    await prisma.$connect();
    console.log("Connected to DB!");
    const count = await prisma.instructor.count();
    console.log("Instructor count:", count);
  } catch (e) {
    console.error("Failed to connect:", (e as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
