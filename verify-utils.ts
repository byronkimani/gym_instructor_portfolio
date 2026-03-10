import { 
  CreateBookingSchema, 
  UpdateBookingStatusSchema, 
  CreateSessionSchema, 
  ContactFormSchema 
} from './src/lib/validations';
import { rateLimit } from './src/lib/rateLimit';

async function runTests() {
  console.log("Running Schema & API Utility Tests...\n");

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

  // --- 1. Zod Schemas ---
  console.log("--- Testing Zod Schemas ---");
  
  // CreateBookingSchema
  const validBooking = CreateBookingSchema.safeParse({
    sessionId: "cmmkw48pv00014e8avkn108lo", // typical cuid
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "+254712345678"
  });
  assert(validBooking.success, "CreateBookingSchema accepts valid input");

  const invalidBooking = CreateBookingSchema.safeParse({
    sessionId: "123", // invalid cuid
    clientName: "J", // too short
    clientEmail: "not-an-email"
  });
  assert(!invalidBooking.success, "CreateBookingSchema rejects invalid input");

  // UpdateBookingStatusSchema
  assert(UpdateBookingStatusSchema.safeParse({ status: 'CONFIRMED' }).success, "UpdateBookingStatusSchema accepts CONFIRMED");
  assert(!UpdateBookingStatusSchema.safeParse({ status: 'PENDING' }).success, "UpdateBookingStatusSchema rejects PENDING");

  // CreateSessionSchema
  const validSession = CreateSessionSchema.safeParse({
    serviceId: "cmmkw48pv00014e8avkn108lo",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    capacity: 10
  });
  assert(validSession.success, "CreateSessionSchema accepts valid input");

  const invalidSession = CreateSessionSchema.safeParse({
    serviceId: "cmmkw48pv00014e8avkn108lo",
    startTime: "2026-04", // not full datetime
    endTime: new Date().toISOString(),
    capacity: 0 // below 1 minimum
  });
  assert(!invalidSession.success, "CreateSessionSchema rejects invalid input");

  // --- 3. Rate Limiter ---
  console.log("\n--- Testing Rate Limiter ---");
  const IP = "192.168.1.100";
  let rlStatus;
  
  // Fire 5 allowed requests
  for(let i=1; i<=5; i++) {
    rlStatus = rateLimit(IP);
    assert(rlStatus.allowed, `Rate limiter allows request ${i}/5`);
  }
  
  // Fire the 6th - should be blocked
  rlStatus = rateLimit(IP);
  assert(!rlStatus.allowed, "Rate limiter BLOCKS request 6/5");
  assert(typeof rlStatus.retryAfter === 'number', "Rate limiter provides retryAfter seconds when blocked");

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
