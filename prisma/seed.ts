import "dotenv/config";
import { PrismaClient, ServiceType, SessionStatus, BookingStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seed started...');

  // 1. Instructor
  const passwordHash = await bcrypt.hash('password123', 12);
  const instructor = await prisma.instructor.upsert({
    where: { email: 'instructor@gym.com' },
    update: {},
    create: {
      name: 'Instructor One',
      email: 'instructor@gym.com',
      passwordHash,
      bio: 'Professional gym instructor with 10 years experience.',
    },
  });
  console.log('Instructor created:', instructor.email);

  const userInstructor = await prisma.instructor.upsert({
    where: { email: 'byronkimani@gmail.com' },
    update: {},
    create: {
      name: 'Byron Kimani',
      email: 'byronkimani@gmail.com',
      passwordHash,
      bio: 'Test Instructor account.',
    },
  });
  console.log('Instructor created:', userInstructor.email);

  // 2. Services
  const ptService = await prisma.service.create({
    data: {
      title: '1-on-1 Personal Training',
      description: 'Customized fitness plan and personal guidance.',
      type: ServiceType.ONE_ON_ONE,
      durationMins: 60,
      priceNote: 'From KES 2,000 — pay via M-Pesa after confirmation',
    },
  });

  const hiitService = await prisma.service.create({
    data: {
      title: 'Group HIIT Class',
      description: 'High-intensity interval training in a group setting.',
      type: ServiceType.GROUP,
      durationMins: 60,
      priceNote: 'KES 1,500 — pay via M-Pesa after confirmation',
    },
  });
  console.log('Services created');

  // 3. Sessions (next 14 days)
  const now = new Date();
  const dayInMs = 24 * 60 * 60 * 1000;

  const session1 = await prisma.session.create({
    data: {
      serviceId: ptService.id,
      title: 'Morning 1-on-1 Session',
      startTime: new Date(now.getTime() + 2 * dayInMs),
      endTime: new Date(now.getTime() + 2 * dayInMs + 60 * 60 * 1000),
      capacity: 1,
      location: 'Main Gym Floor',
      status: SessionStatus.OPEN,
    },
  });

  const session2 = await prisma.session.create({
    data: {
      serviceId: hiitService.id,
      title: 'Evening HIIT Blast',
      startTime: new Date(now.getTime() + 3 * dayInMs),
      endTime: new Date(now.getTime() + 3 * dayInMs + 60 * 60 * 1000),
      capacity: 10,
      location: 'Studio B',
      status: SessionStatus.OPEN,
    },
  });

  const session3 = await prisma.session.create({
    data: {
      serviceId: hiitService.id,
      title: 'Weekend Group HIIT',
      startTime: new Date(now.getTime() + 5 * dayInMs),
      endTime: new Date(now.getTime() + 5 * dayInMs + 60 * 60 * 1000),
      capacity: 10,
      location: 'Westlands Gym',
      status: SessionStatus.OPEN,
    },
  });
  console.log('Sessions created');

  // 4. Bookings
  await prisma.booking.createMany({
    data: [
      {
        sessionId: session1.id,
        clientName: 'Jane Mwangi',
        clientEmail: 'jane@example.com',
        clientPhone: '+254712345678',
        notes: 'Interested in weight loss.',
        status: BookingStatus.PENDING,
      },
      {
        sessionId: session2.id,
        clientName: 'John Kamau',
        clientEmail: 'john@example.com',
        clientPhone: '+254722334455',
        status: BookingStatus.CONFIRMED,
      },
      {
        sessionId: session2.id,
        clientName: 'Sarah Otieno',
        clientEmail: 'sarah@example.com',
        status: BookingStatus.PENDING,
      },
      {
        sessionId: session3.id,
        clientName: 'David Kariuki',
        clientEmail: 'david@example.com',
        status: BookingStatus.DECLINED,
      },
      {
        sessionId: session3.id,
        clientName: 'Alice Wambui',
        clientEmail: 'alice@example.com',
        status: BookingStatus.PENDING,
      },
    ],
  });
  console.log('Bookings created');

  console.log('Seed finished successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
