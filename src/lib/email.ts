import { Booking, Session, Instructor } from '@prisma/client';

export type BookingWithSession = Booking & {
  session: Session;
};

// Simulate sending an email without explicitly requiring a paid Resend API key for local MVP dev
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(`\n\n📧 --- EMAIL SENT ---
To: ${to}
Subject: ${subject}
Body: 
${html.substring(0, 150)}...
---------------------\n\n`);
  
  // Return success to the router
  return { success: true };
}

export async function sendBookingRequestClientEmail(booking: BookingWithSession) {
  await sendEmail({
    to: booking.clientEmail,
    subject: `Booking Request Received — ${booking.session.title || 'Session'}`,
    html: `<p>Hi ${booking.clientName},</p>
           <p>We've received your booking request for the session on <strong>${booking.session.startTime.toLocaleString()}</strong>.</p>
           <p>The instructor will review your request and confirm shortly.</p>`,
  });
}

export async function sendBookingRequestInstructorEmail(instructorEmail: string, booking: BookingWithSession) {
  await sendEmail({
    to: instructorEmail,
    subject: `New Booking Request — ${booking.session.title || 'Session'}`,
    html: `<p>You have a new booking request from <strong>${booking.clientName}</strong> (${booking.clientEmail}).</p>
           <p>Log in to your dashboard to confirm or decline.</p>`,
  });
}

export async function sendBookingConfirmedEmail(instructor: Instructor, booking: BookingWithSession, servicePriceNote?: string | null) {
  await sendEmail({
    to: booking.clientEmail,
    subject: `Your session is confirmed! — ${booking.session.title || 'Session'}`,
    html: `<p>Hi ${booking.clientName},</p>
           <p><strong>${instructor.name}</strong> has confirmed your booking for <strong>${booking.session.startTime.toLocaleString()}</strong>.</p>
           <p>Location: ${booking.session.location || 'TBD'}</p>
           <p><strong>Payment Instructions:</strong></p>
           <p>${servicePriceNote || 'Please pay securely in person.'}</p>
           <p><small>Please complete payment before your session to secure your spot.</small></p>`,
  });
}

export async function sendBookingDeclinedEmail(booking: BookingWithSession) {
  await sendEmail({
    to: booking.clientEmail,
    subject: `Booking Update — ${booking.session.title || 'Session'}`,
    html: `<p>Hi ${booking.clientName},</p>
           <p>Unfortunately, your booking request for <strong>${booking.session.startTime.toLocaleString()}</strong> could not be accommodated at this time.</p>
           ${booking.statusNote ? `<p>Instructor note: <em>${booking.statusNote}</em></p>` : ''}`,
  });
}

export async function sendBookingCancelledEmail(booking: BookingWithSession) {
  await sendEmail({
    to: booking.clientEmail,
    subject: `Booking Cancelled — ${booking.session.title || 'Session'}`,
    html: `<p>Hi ${booking.clientName},</p>
           <p>Your confirmed booking for <strong>${booking.session.startTime.toLocaleString()}</strong> has been cancelled.</p>
           ${booking.statusNote ? `<p>Instructor note: <em>${booking.statusNote}</em></p>` : ''}`,
  });
}

export async function sendContactFormEmail(instructorEmail: string, data: { name: string; email: string; message: string }) {
  await sendEmail({
    to: instructorEmail,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `<p><strong>Name:</strong> ${data.name}</p>
           <p><strong>Email:</strong> ${data.email}</p>
           <p><strong>Message:</strong></p>
           <p>${data.message}</p>`,
  });
}
