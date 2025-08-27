import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth, GoogleCalendarService } from '@/lib/google-services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const tz = searchParams.get('tz') || 'Europe/Madrid';
    
    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Helper to convert a Date to a zoned Date object that reflects the
    // wall-clock time in the provided IANA timezone. Useful for comparisons.
    const toZonedDate = (d: Date, timeZone: string): Date => {
      // Using toLocaleString trick to get a Date representing the same
      // clock time in the target timezone.
      return new Date(d.toLocaleString('en-US', { timeZone }));
    };

    // Live Google Calendar
    try {
      const auth = await getGoogleAuth();
      const calendar = new GoogleCalendarService(auth);
      const slots = await calendar.getAvailableTimeSlots(new Date(date), tz);

      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: tz || 'Europe/Madrid',
      });

      // Filter out past times if the selected date is "today" in the selected timezone
      const now = new Date();
      const nowInTz = toZonedDate(now, tz);
      const selectedDateInTz = toZonedDate(new Date(date), tz);

      const isSameDayInTz =
        nowInTz.getFullYear() === selectedDateInTz.getFullYear() &&
        nowInTz.getMonth() === selectedDateInTz.getMonth() &&
        nowInTz.getDate() === selectedDateInTz.getDate();

      const filteredSlots = isSameDayInTz
        ? slots.filter((iso) => {
            const slotLocal = toZonedDate(new Date(iso), tz);
            return slotLocal.getTime() > nowInTz.getTime();
          })
        : slots;

      const result = filteredSlots.map((iso) => ({ iso, display: formatter.format(new Date(iso)) }));

      return NextResponse.json({ success: true, availableSlots: result, timeZone: tz });
    } catch (liveErr) {
      console.error('Google Calendar error:', liveErr);
      return NextResponse.json({ success: false, message: 'Google Calendar error. Check credentials/sharing and server logs.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Calendar GET fatal error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startTime, name, email } = body as any;

    if (!startTime) {
      return NextResponse.json(
        { success: false, message: 'Start time is required' },
        { status: 400 }
      );
    }

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Try live Google Calendar event creation
    try {
      const auth = await getGoogleAuth();
      const calendar = new GoogleCalendarService(auth);
      const event = await calendar.createEvent(body as any, startTime);
      
      // Check if the event was created successfully and has a Google Meet link
      if (event && event.id) {
        const hangoutLink = event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri;
        
        if (hangoutLink) {
          console.log('Google Meet link generated:', hangoutLink);
          return NextResponse.json({ 
            success: true, 
            event: {
              ...event,
              hangoutLink,
              meetLink: hangoutLink
            }
          });
        } else {
          console.warn('Event created but no Google Meet link generated');
          return NextResponse.json({ 
            success: true, 
            event,
            warning: 'Event created but Google Meet link not available'
          });
        }
      } else {
        throw new Error('Event creation failed - no event ID returned');
      }
    } catch (liveErr: any) {
      console.error('Live Google Calendar event creation failed:', liveErr);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create calendar event', 
        error: liveErr.message 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Calendar POST error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
