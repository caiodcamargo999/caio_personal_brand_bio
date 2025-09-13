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
      console.log('Attempting to create calendar event with data:', {
        startTime,
        name: body.name,
        email: body.email,
        budget: body.budget,
        budgetAmount: body.budgetAmount
      });
      
      const auth = await getGoogleAuth();
      console.log('Google Auth initialized successfully');
      
      const calendar = new GoogleCalendarService(auth);
      console.log('Google Calendar service initialized');
      
      const event = await calendar.createEvent(body as any, startTime);

      // Fire-and-forget WhatsApp confirmation (if WhatsApp present)
      try {
        if (body.whatsapp) {
          const hangoutLink = event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri;
          const meetLink = hangoutLink || 'Link will be sent separately';
          
          const msg = `✅ Your Strategy Call with Caio is locked in.

📅 When: ${new Date(startTime).toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'Europe/Madrid' 
          })}

🔗 Google Meet link: ${meetLink}

This call is for you—show up ready, take notes, and walk away with clarity. You'll get a reminder 1 hour before we start.`;
          
          fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/whatsapp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: body.whatsapp, message: msg }),
          }).catch(()=>{});
        }
      } catch {}
      
      // Check if the event was created successfully
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
      
      // Log detailed error information for debugging
      if (liveErr.response) {
        console.error('Error response:', {
          status: liveErr.response.status,
          data: liveErr.response.data,
          headers: liveErr.response.headers
        });
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create calendar event', 
        error: liveErr.message,
        details: liveErr.response?.data || 'No additional details available'
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
