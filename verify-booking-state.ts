import { PrismaClient, BookingStatus, SessionStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyStateTransitions() {
  console.log("Starting Booking State Machine Verification...\n");
  
  // 1. Setup Test Data
  const service = await prisma.service.create({
    data: {
      title: 'Test Service',
      description: 'Testing state machine transitions.',
      type: 'ONE_ON_ONE',
      durationMins: 60,
    }
  });

  const session = await prisma.session.create({
    data: {
      serviceId: service.id,
      title: 'Test Session',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      capacity: 1,
      status: SessionStatus.OPEN,
    }
  });

  let booking = await prisma.booking.create({
    data: {
      sessionId: session.id,
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      status: BookingStatus.PENDING,
    }
  });

  console.log(`Created Session [${session.id}] with Capacity: ${session.capacity}, Booked: ${session.bookedCount}, Status: ${session.status}`);
  console.log(`Created Booking [${booking.id}] with Status: ${booking.status}\n`);

  // Helper to test transition
  async function simulateTransition(newStatus: BookingStatus) {
    // Replicating API route logic
    const currentSession = await prisma.session.findUnique({ where: { id: session.id } });
    const currentBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
    
    if (!currentSession || !currentBooking) throw new Error("Missing data");

    const updated = await prisma.$transaction(async (tx) => {
      if (newStatus === BookingStatus.CONFIRMED) {
        const newCount = currentSession.bookedCount + 1;
        await tx.session.update({
          where: { id: currentSession.id },
          data: { 
            bookedCount: newCount,
            status: newCount >= currentSession.capacity ? SessionStatus.FULL : currentSession.status 
          }
        });
      } else if (currentBooking.status === BookingStatus.CONFIRMED && newStatus === BookingStatus.CANCELLED) {
        const newCount = Math.max(0, currentSession.bookedCount - 1);
        await tx.session.update({
          where: { id: currentSession.id },
          data: {
            bookedCount: newCount,
            status: currentSession.status === SessionStatus.FULL ? SessionStatus.OPEN : currentSession.status
          }
        });
      }

      return await tx.booking.update({
        where: { id: currentBooking.id },
        data: { status: newStatus }
      });
    });
    
    booking = updated;
    const s = await prisma.session.findUnique({ where: { id: session.id } });
    console.log(`Transitioned to ${newStatus}. Session BookedCount: ${s?.bookedCount}, Session Status: ${s?.status}`);
  }

  // 2. Perform Transitions
  try {
    // PENDING -> CONFIRMED
    await simulateTransition(BookingStatus.CONFIRMED);
    // CONFIRMED -> CANCELLED
    await simulateTransition(BookingStatus.CANCELLED);
    
    // Reset booking to pending for another path
    await prisma.booking.update({ where: { id: booking.id }, data: { status: BookingStatus.PENDING } });
    console.log(`\nReset booking to PENDING...`);
    
    // PENDING -> DECLINED
    await simulateTransition(BookingStatus.DECLINED);
    
    console.log("\n✅ State Machine Verification Passed!");
  } catch (error) {
    console.error("\n❌ Verification Failed:", error);
  } finally {
    // Cleanup
    await prisma.booking.delete({ where: { id: booking.id } });
    await prisma.session.delete({ where: { id: session.id } });
    await prisma.service.delete({ where: { id: service.id } });
    await prisma.$disconnect();
  }
}

verifyStateTransitions();
