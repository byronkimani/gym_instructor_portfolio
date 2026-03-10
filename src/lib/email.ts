import { Resend } from 'resend';
import { Booking, Session, Instructor } from '@prisma/client';
import {
  bookingRequestInstructorHTML,
  bookingRequestClientHTML,
  bookingConfirmedClientHTML,
  bookingDeclinedClientHTML,
  bookingCancelledClientHTML,
  contactFormInstructorHTML
} from './emailTemplates';

export type BookingWithSession = Booking & { session: Session };

// Initialize Resend
// In development without an API key, this will silently fail rather than crashing if wrapped correctly.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
const FROM_EMAIL = 'noreply@yourdomain.vercel.app'; // Update this to a verified domain in production

// --- Triggers ---

export async function sendBookingRequestClientEmail(booking: BookingWithSession) {
  try {
    // Single-tenant MVP assumes instructor exists for the name
    const instructorName = 'Your Instructor'; 

    await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.clientEmail,
      subject: `Booking Request Received — ${booking.session.title || 'Session'}`,
      html: bookingRequestClientHTML(booking, instructorName),
    });
  } catch (error) {
    console.error('Failed to send bookingRequestClientEmail:', error);
  }
}

export async function sendBookingRequestInstructorEmail(instructorEmail: string, booking: BookingWithSession) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: instructorEmail,
      subject: `New Booking Request — ${booking.session.title || 'Session'}`,
      html: bookingRequestInstructorHTML(booking),
    });
  } catch (error) {
    console.error('Failed to send bookingRequestInstructorEmail:', error);
  }
}

export async function sendBookingConfirmedEmail(instructor: Instructor, booking: BookingWithSession, servicePriceNote?: string | null) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.clientEmail,
      subject: `Your session is confirmed! — ${booking.session.title || 'Session'}`,
      html: bookingConfirmedClientHTML(booking, instructor.name, servicePriceNote),
    });
  } catch (error) {
    console.error('Failed to send bookingConfirmedEmail:', error);
  }
}

export async function sendBookingDeclinedEmail(booking: BookingWithSession) {
  try {
    const instructorName = 'Your Instructor';
    await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.clientEmail,
      subject: `Booking Update — ${booking.session.title || 'Session'}`,
      html: bookingDeclinedClientHTML(booking, instructorName),
    });
  } catch (error) {
    console.error('Failed to send bookingDeclinedEmail:', error);
  }
}

export async function sendBookingCancelledEmail(booking: BookingWithSession) {
  try {
    const instructorName = 'Your Instructor';
    await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.clientEmail,
      subject: `Booking Cancelled — ${booking.session.title || 'Session'}`,
      html: bookingCancelledClientHTML(booking, instructorName),
    });
  } catch (error) {
    console.error('Failed to send bookingCancelledEmail:', error);
  }
}

export async function sendContactFormEmail(instructorEmail: string, data: { name: string; email: string; message: string }) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: instructorEmail,
      subject: `New Contact Form Submission from ${data.name}`,
      html: contactFormInstructorHTML(data),
    });
  } catch (error) {
    console.error('Failed to send contactFormEmail:', error);
  }
}
