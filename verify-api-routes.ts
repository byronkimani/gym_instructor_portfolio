import { PrismaClient, ServiceType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_BASE = 'http://localhost:3000/api';

async function fetchWithAuth(url: string, method: string = 'GET', body?: any) {
  // Mock session token since requireAuth reads from NextAuth cookies
  // To avoid dealing with NextAuth cookie signing in a crude test script,
  // we'll bypass the raw fetch for instructor actions and just test the public ones thoroughly,
  // or test the instructor bounces without auth.
  return fetch(`${API_BASE}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
}

async function runApiTests() {
  console.log("Starting API Integration Verification...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Bouncing unauthenticated instructor routes
    // -------------------------------------------------------------
    console.log("--- Security Tests ---");
    const getClientsRes = await fetchWithAuth('/clients');
    assert(getClientsRes.status === 401, 'Instructor GET /api/clients securely bounces (401)');

    const postSessionRes = await fetchWithAuth('/sessions', 'POST', { serviceId: 'mock' });
    assert(postSessionRes.status === 401, 'Instructor POST /api/sessions securely bounces (401)');

    // -------------------------------------------------------------
    // Test 2: Public GET /api/sessions
    // -------------------------------------------------------------
    console.log("\n--- Public Sessions API Tests ---");
    const getSessionsRes = await fetch(`${API_BASE}/sessions`);
    const sessionData = await getSessionsRes.json();
    
    assert(getSessionsRes.status === 200, 'Public GET /api/sessions returns 200 OK');
    assert(Array.isArray(sessionData.sessions), 'Returns an array of sessions');
    
    if (sessionData.sessions.length > 0) {
      const activeSession = sessionData.sessions[0];
      assert(
        typeof activeSession.spotsLeft === 'number' && activeSession.spotsLeft === activeSession.capacity - activeSession.bookedCount,
        'spotsLeft is correctly computed dynamically'
      );
    } else {
      console.warn("⚠️  No seeded sessions found to verify spotsLeft.");
    }

    // -------------------------------------------------------------
    // Test 3: Public POST /api/bookings
    // -------------------------------------------------------------
    console.log("\n--- Public Bookings API Tests ---");
    
    // Attempt invalid format first
    const invalidBooking = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'invalid-id',
        clientName: 'S', // too short
        clientEmail: 'bad-email'
      })
    });
    
    assert(invalidBooking.status === 400, 'POST /api/bookings rejects invalid payload structure (400)');
    
    // We can't trivially e2e test a completely valid booking creation via HTTP in this isolated script
    // because we need a valid `sessionId` from a seeded OPEN session.
    // We already know one exists from Test 2, so let's use it.
    if (sessionData.sessions.length > 0) {
      const validSessionId = sessionData.sessions[0].id;
      
      const validBooking = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: validSessionId,
          clientName: 'Integration Test Bot',
          clientEmail: 'bot@example.com',
          clientPhone: '+254700000000',
          notes: 'Testing end-to-end booking'
        })
      });
      
      const validBookingData = await validBooking.json();
      
      if (validBooking.status === 201) {
         assert(true, 'POST /api/bookings successfully creates valid booking (201)');
         assert(validBookingData.booking.status === 'PENDING', 'New booking defaults to PENDING status');
         assert(validBookingData.booking.clientName === 'Integration Test Bot', 'Data mapping correctly parsed');
         
         // Clean up the created booking locally
         await prisma.booking.delete({ where: { id: validBookingData.booking.id }});
      } else {
         assert(false, `POST /api/bookings failed to create (Status: ${validBooking.status}) - ${JSON.stringify(validBookingData)}`);
      }
    }

    // -------------------------------------------------------------
    // Test 4: Public POST /api/contact
    // -------------------------------------------------------------
    console.log("\n--- Public Contact form API Tests ---");
    
    const contactRes = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Curious Potential Client',
        email: 'client@example.com',
        message: 'Do you offer couples training? I want to join with my wife.'
      })
    });

    assert(contactRes.status === 201, 'POST /api/contact successfully accepts valid form (201)');


    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
    if (failed > 0) process.exit(1);

  } catch (err) {
    console.error("\n❌ Test execution failed", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runApiTests();
