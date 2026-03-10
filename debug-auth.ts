import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

async function debugAuth() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const instructor = await prisma.instructor.findUnique({
      where: { email: 'instructor@gym.com' },
    });

    if (!instructor) {
      console.log('❌ Instructor instructor@gym.com NOT FOUND in database.');
      return;
    }

    console.log('✅ Instructor found:', instructor.email);
    
    const isMatched = await bcrypt.compare('password123', instructor.passwordHash);
    console.log('Password "password123" match:', isMatched);

  } catch (error) {
    console.error('Error debugging auth:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();
