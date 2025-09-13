import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth } from '@/lib/google-services';
import { google } from 'googleapis';

// Import the WhatsApp service
let whatsappService: any = null;

// Dynamic import to avoid issues in Next.js
async function getWhatsAppService() {
  if (!whatsappService) {
    try {
      const { whatsappService: service } = await import('@/whatsapp-service');
      whatsappService = service;
    } catch (error) {
      console.error('Failed to import WhatsApp service:', error);
      return null;
    }
  }
  return whatsappService;
}

export async function GET(request: NextRequest) {
  try {
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID as string;
    const auth = await getGoogleAuth();
    const svc = google.calendar({ version: 'v3', auth });

    const now = new Date();
    const horizon = new Date(now.getTime() + 2 * 60 * 60 * 1000); // next 2h

    const list = await svc.events.list({
      calendarId: CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: horizon.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = list.data.items || [];
    let sent = 0;

    for (const ev of events) {
      const startISO = ev.start?.dateTime || ev.start?.date;
      if (!startISO) continue;
      const msUntil = new Date(startISO).getTime() - now.getTime();
      const minutesUntil = Math.floor(msUntil / 60000);

      const flags = ev.extendedProperties?.private || {};
      const should1h = minutesUntil <= 60 && minutesUntil > 55 && !flags['waReminder1h'];
      if (!should1h) continue;

      const attendee = (ev.attendees || []).find(a => a.email && a.responseStatus !== 'declined');
      const wa = (ev.description || '').match(/WhatsApp:\s*(\+\d[\d\s-]+)/i)?.[1]?.replace(/\s|-/g, '');
      if (!wa) continue;

      const tz = ev.start?.timeZone || 'Europe/Madrid';
      const whenText = new Date(startISO).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: tz,
      });
      
      // Extract Google Meet link from event description or use fallback
      const meetLink = ev.hangoutLink || ev.conferenceData?.entryPoints?.[0]?.uri || 'Check your email for the link';
      
      const name = (ev.summary || '').replace(/^Strategy Call with\s+/i, '').trim() || 'there';
      const msg = `⏰ Your Strategy Call with Caio starts in 1 hour.

📅 When: ${whenText}
🔗 Google Meet link: ${meetLink}

Be on time. Bring your biggest question. Get answers.`;

      const service = await getWhatsAppService();
      if (!service || !service.isReady()) {
        console.log('WhatsApp service not available, skipping reminder');
        continue;
      }
      
      const res = await service.sendMessage(wa, msg);
      if (res) {
        await svc.events.patch({
          calendarId: CALENDAR_ID,
          eventId: ev.id!,
          requestBody: {
            extendedProperties: { private: { ...flags, waReminder1h: 'true' } },
          },
        });
        sent++;
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (e) {
    console.error('whatsapp reminders error', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

