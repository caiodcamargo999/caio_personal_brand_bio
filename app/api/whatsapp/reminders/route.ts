import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth } from '@/lib/google-services';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID as string;
    
    const {
      EVOLUTION_API_URL,
      EVOLUTION_API_KEY,
      EVOLUTION_INSTANCE_NAME
    } = process.env;

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
      console.error('Missing Evolution API credentials in environment variables');
      return NextResponse.json({ success: false, error: 'WhatsApp service is not configured' }, { status: 503 });
    }

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

      // Format phone number properly for Evolution API
      let formattedPhone = wa.replace(/\D/g, '');
      if (!formattedPhone.startsWith('55') && formattedPhone.length <= 11) {
        formattedPhone = '55' + formattedPhone;
      }

      // Determine Language based on explicit calendar note, fallback to phone prefix
      const desc = ev.description || '';
      let isPt = false;
      let isEs = false;
      
      if (/Language:\s*PT/i.test(desc)) {
        isPt = true;
      } else if (/Language:\s*ES/i.test(desc)) {
        isEs = true;
      } else if (/Language:\s*EN/i.test(desc)) {
        // Explicitly EN
      } else {
        // Fallback to phone number prefix if explicit language not found
        isPt = formattedPhone.startsWith('55') || formattedPhone.startsWith('351');
        isEs = ['54','56','57','52','34','598','51','593','503','504','506','507','595','58','591','53','1809','1829','1849'].some(prefix => formattedPhone.startsWith(prefix));
      }
      
      const localeString = isPt ? 'pt-BR' : isEs ? 'es-ES' : 'en-US';

      const tz = ev.start?.timeZone || 'Europe/Madrid';
      const whenText = new Date(startISO).toLocaleString(localeString, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: tz,
      });
      
      // Extract Google Meet link from event description or use fallback
      const meetLink = ev.hangoutLink || ev.conferenceData?.entryPoints?.[0]?.uri || 'Check your email for the link';
      
      const name = (ev.summary || '').replace(/^Strategy Call with\s+/i, '').trim() || 'there';
      
      let msg = '';
      if (isPt) {
        msg = `⏰ Sua Call Estratégica com o Caio começa em 1 hora.

📅 Quando: ${whenText}
🔗 Link do Google Meet: ${meetLink}

Seja pontual. Traga sua maior dúvida. Obtenha respostas.`;
      } else if (isEs) {
        msg = `⏰ Tu Llamada Estratégica con Caio comienza en 1 hora.

📅 Cuándo: ${whenText}
🔗 Enlace de Google Meet: ${meetLink}

Sé puntual. Trae tu mayor duda. Obtén respuestas.`;
      } else {
        msg = `⏰ Your Strategy Call with Caio starts in 1 hour.

📅 When: ${whenText}
🔗 Google Meet link: ${meetLink}

Be on time. Bring your biggest question. Get answers.`;
      }



      // Send via Evolution API
      try {
        const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': EVOLUTION_API_KEY
          },
          body: JSON.stringify({
            number: formattedPhone,
            options: { delay: 1200, presence: 'composing' },
            textMessage: { text: msg }
          })
        });

        if (response.ok) {
          await svc.events.patch({
            calendarId: CALENDAR_ID,
            eventId: ev.id!,
            requestBody: {
              extendedProperties: { private: { ...flags, waReminder1h: 'true' } },
            },
          });
          sent++;
        } else {
          console.error(`Evolution API failed to send reminder to ${formattedPhone}`, await response.text());
        }
      } catch (evolutionError) {
        console.error(`Fetch error reaching Evolution API for ${formattedPhone}:`, evolutionError);
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (e) {
    console.error('whatsapp reminders error', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
