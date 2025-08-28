import { LeadFormData } from './types';

export interface EmailTemplateData {
  name: string;
  scheduledTime: string;
  userTimeZone: string;
  industry: string;
  struggle: string;
  budget: string;
  budgetAmount?: number;
}

export function generateConfirmationEmail(
  data: EmailTemplateData,
  locale: string,
  t: (key: string) => string
): { subject: string; html: string } {
  const subject = t('leadCapture.emails.confirmation.subject');
  
  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('leadCapture.emails.confirmation.title')}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 640px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .header { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .title { font-size: 22px; font-weight: 700; margin: 0; color: #111827; }
        .content { padding: 24px; }
        .lead { margin: 0 0 16px 0; font-size: 16px; }
        .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; margin: 24px 0 8px; }
        .row { display: flex; margin: 6px 0; }
        .label { width: 120px; color: #6b7280; }
        .value { color: #111827; font-weight: 600; }
        .button { display: inline-block; margin-top: 16px; background: #111827; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="title">Your strategy call is confirmed</div>
          </div>
          <div class="content">
            <p class="lead">Hi ${data.name}, thanks for booking your Strategy & Consultation session. Below are your call details.</p>
            <div class="section-title">Call details</div>
            <div class="row"><div class="label">When</div><div class="value">${new Date(data.scheduledTime).toLocaleString(locale, { dateStyle: 'full', timeStyle: 'short', timeZone: data.userTimeZone })} (${data.userTimeZone})</div></div>
            <div class="row"><div class="label">Where</div><div class="value">Google Meet</div></div>
            <div class="row"><div class="label">Duration</div><div class="value">60 minutes</div></div>
            <a class="button" href="{{MEETING_LINK}}">Join the call</a>
            <div class="section-title">How to get the most from our call</div>
            <p>Come prepared with your top business goal for the next 90 days, your current bottlenecks, and an overview of your acquisition process and tools. This helps us move fast and get you clear, actionable next steps.</p>
          </div>
          <div class="footer">You’ll also receive automatic reminders before the call.</div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generatePreCallEmail(
  data: EmailTemplateData,
  locale: string,
  t: (key: string) => string
): { subject: string; html: string } {
  const subject = 'Reminder: your strategy call is coming up';
  
  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Strategy call reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 640px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .header { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .title { font-size: 20px; font-weight: 700; margin: 0; color: #111827; }
        .content { padding: 24px; }
        .row { display: flex; margin: 6px 0; }
        .label { width: 120px; color: #6b7280; }
        .value { color: #111827; font-weight: 600; }
        .button { display: inline-block; margin-top: 16px; background: #111827; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header"><div class="title">Reminder: your strategy call</div></div>
          <div class="content">
            <p>Hi ${data.name}, this is a quick reminder of our strategy call.</p>
            <div class="row"><div class="label">When</div><div class="value">${new Date(data.scheduledTime).toLocaleString(locale, { dateStyle: 'full', timeStyle: 'short', timeZone: data.userTimeZone })} (${data.userTimeZone})</div></div>
            <div class="row"><div class="label">Where</div><div class="value">Google Meet</div></div>
            <a class="button" href="{{MEETING_LINK}}">Join the call</a>
            <p style="margin-top:16px;">To maximize value, have your top goal, main bottlenecks, and current tools in mind.</p>
          </div>
          <div class="footer">See you soon.</div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateFollowUpEmail(
  data: EmailTemplateData,
  locale: string,
  t: (key: string) => string
): { subject: string; html: string } {
  const subject = 'Thanks for the call — your next steps';
  
  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Next steps</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 640px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .header { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .title { font-size: 20px; font-weight: 700; margin: 0; color: #111827; }
        .content { padding: 24px; }
        .list { margin: 8px 0 0 18px; }
        .button { display: inline-block; margin-top: 16px; background: #111827; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header"><div class="title">Thank you for the strategy call</div></div>
          <div class="content">
            <p>Hi ${data.name}, it was great speaking with you. Here are your next steps:</p>
            <ol class="list">
              <li>Review the action plan we discussed and confirm priorities.</li>
              <li>Book your implementation kickoff.</li>
              <li>Share access to the key tools we listed.</li>
            </ol>
            <a class="button" href="mailto:caiorarity@gmail.com">Reply with questions</a>
          </div>
          <div class="footer">I’m here to help you execute quickly.</div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}
