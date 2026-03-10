import { Booking, Session } from '@prisma/client';

export type BookingWithSession = Booking & { session: Session };

const BRAND_NAVY = '#1A1A2E';

// --- Shared Components ---

function renderHeader(title: string) {
  return `
    <div style="background-color: ${BRAND_NAVY}; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; font-size: 24px;">${title}</h1>
    </div>
  `;
}

function renderFooter(instructorName?: string) {
  return `
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-family: sans-serif; font-size: 14px;">
      <p style="margin: 0;">${instructorName ? `Best regards,<br/><strong>${instructorName}</strong><br/><br/>` : ''}</p>
      <p style="margin: 0;">Powered by Jiwambe Gym Instructor</p>
    </div>
  `;
}

function renderContainer(content: string) {
  return `
    <div style="background-color: #f8fafc; padding: 32px 16px; min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        ${content}
      </div>
    </div>
  `;
}

// --- Templates ---

export function bookingRequestInstructorHTML(booking: BookingWithSession): string {
  const content = `
    ${renderHeader('New Booking Request')}
    <div style="padding: 32px; font-family: sans-serif; color: #334155; line-height: 1.6;">
      <p style="margin-top: 0;">You have a new booking request for <strong>${booking.session.title || 'Session'}</strong>.</p>
      
      <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Client:</strong> ${booking.clientName}</p>
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${booking.clientEmail}" style="color: #2563eb;">${booking.clientEmail}</a></p>
        ${booking.clientPhone ? `<p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${booking.clientPhone}</p>` : ''}
        <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${booking.session.startTime.toLocaleString()}</p>
        ${booking.notes ? `<p style="margin: 16px 0 0 0;"><strong>Additional Notes:</strong><br/>${booking.notes}</p>` : ''}
      </div>

      <p>Log in to your dashboard to confirm or decline.</p>
      ${renderFooter()}
    </div>
  `;
  return renderContainer(content);
}

export function bookingRequestClientHTML(booking: BookingWithSession, instructorName: string): string {
  const content = `
    ${renderHeader('Booking Request Received')}
    <div style="padding: 32px; font-family: sans-serif; color: #334155; line-height: 1.6;">
      <p style="margin-top: 0;">Hi <strong>${booking.clientName}</strong>,</p>
      <p>We've received your booking request for <strong>${booking.session.title || 'Session'}</strong> on <strong>${booking.session.startTime.toLocaleString()}</strong>.</p>
      <p>The instructor will review your request and confirm shortly. You will receive another email once your booking is approved.</p>
      ${renderFooter(instructorName)}
    </div>
  `;
  return renderContainer(content);
}

export function bookingConfirmedClientHTML(booking: BookingWithSession, instructorName: string, servicePriceNote?: string | null): string {
  const mpesaPaybill = process.env.NEXT_PUBLIC_MPESA_PAYBILL || '';
  const mpesaTill = process.env.NEXT_PUBLIC_MPESA_TILL || '';
  
  let paymentBlock = '';
  
  if (mpesaPaybill || mpesaTill || servicePriceNote) {
    paymentBlock = `
      <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 6px; margin: 24px 0;">
        <h3 style="color: #047857; margin-top: 0; margin-bottom: 12px; font-size: 18px;">Payment Instructions</h3>
        ${servicePriceNote ? `<p style="margin: 0 0 12px 0;"><strong>Amount:</strong> ${servicePriceNote}</p>` : ''}
        ${mpesaPaybill ? `<p style="margin: 0 0 8px 0;"><strong>M-Pesa Paybill:</strong> ${mpesaPaybill}</p><p style="margin: 0 0 12px 0;"><strong>Account:</strong> ${booking.clientName.split(' ')[0]}</p>` : ''}
        ${!mpesaPaybill && mpesaTill ? `<p style="margin: 0 0 12px 0;"><strong>M-Pesa Buy Goods (Till):</strong> ${mpesaTill}</p>` : ''}
        <p style="margin: 0; font-size: 14px; color: #047857;"><small><em>Please complete payment before your session to secure your spot.</em></small></p>
      </div>
    `;
  }

  const content = `
    ${renderHeader('Your Session is Confirmed!')}
    <div style="padding: 32px; font-family: sans-serif; color: #334155; line-height: 1.6;">
      <p style="margin-top: 0;">Hi <strong>${booking.clientName}</strong>,</p>
      <p>Great news! Your booking for <strong>${booking.session.title || 'Session'}</strong> has been confirmed.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid ${BRAND_NAVY}; margin: 24px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${booking.session.startTime.toLocaleString()}</p>
        <p style="margin: 0;"><strong>Location:</strong> ${booking.session.location || 'TBD'}</p>
      </div>

      ${paymentBlock}
      
      <p>Looking forward to seeing you there!</p>
      ${renderFooter(instructorName)}
    </div>
  `;
  return renderContainer(content);
}

export function bookingDeclinedClientHTML(booking: BookingWithSession, instructorName: string): string {
  const content = `
    ${renderHeader('Booking Update')}
    <div style="padding: 32px; font-family: sans-serif; color: #334155; line-height: 1.6;">
      <p style="margin-top: 0;">Hi <strong>${booking.clientName}</strong>,</p>
      <p>Unfortunately, your booking request for <strong>${booking.session.title || 'Session'}</strong> on <strong>${booking.session.startTime.toLocaleString()}</strong> could not be accommodated at this time.</p>
      
      ${booking.statusNote ? `
      <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; margin: 24px 0; font-style: italic;">
        "${booking.statusNote}"
      </div>` : ''}
      
      <p>Please check our schedule for other available times.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/schedule" style="display: inline-block; background-color: ${BRAND_NAVY}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; font-weight: bold;">View Schedule</a>
      
      ${renderFooter(instructorName)}
    </div>
  `;
  return renderContainer(content);
}

export function bookingCancelledClientHTML(booking: BookingWithSession, instructorName: string): string {
  const content = `
    ${renderHeader('Session Cancelled')}
    <div style="padding: 32px; font-family: sans-serif; color: #334155; line-height: 1.6;">
      <p style="margin-top: 0;">Hi <strong>${booking.clientName}</strong>,</p>
      <p>This is a notification that your confirmed session for <strong>${booking.session.title || 'Session'}</strong> on <strong>${booking.session.startTime.toLocaleString()}</strong> has been cancelled.</p>
      
      ${booking.statusNote ? `
      <div style="background-color: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <strong>Reason:</strong> ${booking.statusNote}
      </div>` : ''}
      
      <p>We apologize for the inconvenience. Please contact us if you have any questions or to reschedule.</p>
      ${renderFooter(instructorName)}
    </div>
  `;
  return renderContainer(content);
}

export function contactFormInstructorHTML(data: { name: string; email: string; message: string }): string {
  const content = `
    ${renderHeader('New Contact Form Submission')}
    <div style="padding: 32px; font-family: sans-serif; color: #334155; line-height: 1.6;">
      <p style="margin-top: 0;">You have received a new message from your website contact form.</p>
      
      <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${data.name}</p>
        <p style="margin: 0 0 16px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
        <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
        <div style="background-color: white; padding: 16px; border: 1px solid #e2e8f0; border-radius: 4px;">
          ${data.message.replace(/\n/g, '<br/>')}
        </div>
      </div>
      
      <a href="mailto:${data.email}" style="display: inline-block; background-color: ${BRAND_NAVY}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 8px;">Reply to ${data.name}</a>
      ${renderFooter()}
    </div>
  `;
  return renderContainer(content);
}
