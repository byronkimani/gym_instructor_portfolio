/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  try {
    const user = await prisma.instructor.findUnique({
      where: { email: 'byronkimani@gmail.com' },
    });
    
    if (user) {
      console.log("✅ User found in DB!");
      console.log("Name:", user.name);
      console.log("Email:", user.email);
      console.log("Password Hash snippet:", user.passwordHash.substring(0, 10) + '...');
    } else {
      console.log("❌ User not found in DB.");
    }

  } catch (error: any) {
    console.error("Database query failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
