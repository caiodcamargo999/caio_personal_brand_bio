import { NextRequest, NextResponse } from 'next/server';
import { 
  generatePreCallEmail, 
  generateFollowUpEmail,
  EmailTemplateData 
} from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { 
      action, 
      leadData, 
      locale = 'en' 
    } = await request.json();

    if (!leadData || !leadData.email || !leadData.name) {
      return NextResponse.json(
        { error: 'Lead data with email and name is required' },
        { status: 400 }
      );
    }

    let emailData: any;
    let template: string;

    // Simple translation function for templates
    const t = (key: string) => {
      const keys = key.split('.');
      let value: any = {};
      
      // Load translations based on locale
      try {
        if (locale === 'pt') {
          value = require('@/messages/pt.json');
        } else if (locale === 'es') {
          value = require('@/messages/es.json');
        } else {
          value = require('@/messages/en.json');
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        value = require('@/messages/en.json'); // Fallback to English
      }
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Fallback to key
        }
      }
      
      return typeof value === 'string' ? value : key;
    };

    // Prepare email data
    const templateData: EmailTemplateData = {
      name: leadData.name,
      scheduledTime: leadData.scheduledDateTime || new Date().toISOString(),
      userTimeZone: leadData.userTimeZone || 'UTC',
      industry: leadData.industry || '',
      struggle: leadData.struggle || '',
      budget: leadData.budget || '',
      budgetAmount: leadData.budgetAmount,
    };

    switch (action) {
      case 'preCall':
        const preCall = generatePreCallEmail(templateData, locale, t);
        emailData = {
          to: [leadData.email],
          subject: preCall.subject,
          html: preCall.html,
        };
        template = 'preCall';
        break;

      case 'followUp':
        const followUp = generateFollowUpEmail(templateData, locale, t);
        emailData = {
          to: [leadData.email],
          subject: followUp.subject,
          html: followUp.html,
        };
        template = 'followUp';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "preCall" or "followUp"' },
          { status: 400 }
        );
    }

    // Send email using the email API
    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json().catch(() => ({}));
      console.error('Failed to send email sequence:', emailResponse.status, errorData);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    const result = await emailResponse.json();
    
    return NextResponse.json({
      success: true,
      action,
      template,
      emailId: result.id,
      subject: emailData.subject,
    });

  } catch (error) {
    console.error('Email sequence error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const lookAheadMinutes = parseInt(url.searchParams.get('lookAhead') || '10', 10); // default 10 minutes window

    // Pull events from Google Calendar for the next 2 days to evaluate reminders
    const { getGoogleAuth, GoogleCalendarService } = await import('@/lib/google-services');
    const auth = await getGoogleAuth();
    const calendar = new (GoogleCalendarService as any)(auth);

    // We'll reuse list logic by calling internal method through events.list instead of public method
    const { google } = await import('googleapis');
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID as string;
    const svc = google.calendar({ version: 'v3', auth });

    const now = new Date();
    const horizon = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const list = await svc.events.list({
      calendarId: CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: horizon.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = list.data.items || [];
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    let sent = 0;

    for (const ev of events) {
      const startISO = ev.start?.dateTime || ev.start?.date;
      if (!startISO) continue;
      const start = new Date(startISO);
      const msUntil = start.getTime() - now.getTime();
      const minutesUntil = Math.floor(msUntil / 60000);

      const flags = ev.extendedProperties?.private || {};

      const shouldSend24h = minutesUntil <= 24 * 60 && minutesUntil > (24 * 60 - lookAheadMinutes) && !flags['reminder24h'];
      const shouldSend2h = minutesUntil <= 120 && minutesUntil > (120 - lookAheadMinutes) && !flags['reminder2h'];
      const shouldSend15m = minutesUntil <= 15 && minutesUntil > (15 - lookAheadMinutes) && !flags['reminder15m'];

      const attendee = (ev.attendees || []).find(a => a.email && a.responseStatus !== 'declined');
      const leadEmail = attendee?.email;
      const leadName = (ev.summary || '').replace(/^Strategy Call with\s+/i, '').trim() || 'there';

      const sendReminder = async (kind: 'preCall') => {
        if (!leadEmail) return;
        await fetch(`${baseUrl}/api/email-sequence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'preCall',
            locale: 'en',
            leadData: {
              name: leadName,
              email: leadEmail,
              scheduledDateTime: start.toISOString(),
              userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          }),
        });
      };

      // If event is the same day (<= 24h), skip the 24h reminder; send 2h/15m only
      const sameDay = minutesUntil <= 24 * 60;
      const willSend = (sameDay ? false : shouldSend24h) || shouldSend2h || shouldSend15m;
      if (willSend) {
        await sendReminder('preCall');
        // Mark flag to avoid duplicates
        const flagKey = (sameDay ? (shouldSend2h ? 'reminder2h' : 'reminder15m') : (shouldSend24h ? 'reminder24h' : (shouldSend2h ? 'reminder2h' : 'reminder15m')));
        await svc.events.patch({
          calendarId: CALENDAR_ID,
          eventId: ev.id!,
          requestBody: {
            extendedProperties: {
              private: { ...flags, [flagKey]: 'true' },
            },
          },
        });
        sent++;
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error('Reminders GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}