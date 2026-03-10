import { Resend } from 'resend';
import { 
  bookingRequestInstructorHTML,
  bookingRequestClientHTML,
  bookingConfirmedClientHTML,
  bookingDeclinedClientHTML,
  bookingCancelledClientHTML,
  contactFormInstructorHTML
} from './src/lib/emailTemplates';
import fs from 'fs';
import path from 'path';

// Mock Data
const mockSession: any = {
  id: 'sess-123',
  title: 'Morning Yoga Mastery',
  startTime: new Date('2026-04-15T08:00:00Z'),
  location: 'Jiwambe Core Studio',
};

const mockBooking: any = {
  id: 'book-456',
  clientName: 'Jane Smith',
  clientEmail: 'jane@example.com',
  clientPhone: '+254701234567',
  notes: 'Please bring an extra mat if possible.',
  statusNote: 'Unfortunately, I will be out of town this weekend.',
  session: mockSession
};

const mockContact = {
  name: 'New Corporate Client',
  email: 'hr@bigcompany.com',
  message: 'We are looking to hire a resident instructor for our 50 employees. Let me know your rates.'
};

async function verifyEmails() {
  console.log("Generating Email Templates for verification...\n");
  
  const outDir = path.join(__dirname, '.email-previews');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // 1. Generate HTML Strings
  const previews = {
    '1-request-instructor.html': bookingRequestInstructorHTML(mockBooking),
    '2-request-client.html': bookingRequestClientHTML(mockBooking, 'Coach Byron'),
    '3-confirmed-client.html': bookingConfirmedClientHTML(mockBooking, 'Coach Byron', 'KES 1,500'),
    '4-declined-client.html': bookingDeclinedClientHTML(mockBooking, 'Coach Byron'),
    '5-cancelled-client.html': bookingCancelledClientHTML(mockBooking, 'Coach Byron'),
    '6-contact-instructor.html': contactFormInstructorHTML(mockContact)
  };

  // 2. Write to disk so we can open them in browser
  for (const [filename, htmlString] of Object.entries(previews)) {
    const fullPath = path.join(outDir, filename);
    fs.writeFileSync(fullPath, htmlString);
    console.log(`✅ Generated: ${fullPath}`);
  }

  console.log("\nAll templates generated successfully! Open them in your browser to verify styling.");
}

verifyEmails();
