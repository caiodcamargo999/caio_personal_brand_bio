import { google } from 'googleapis';
import { LeadFormData } from './types';

// Google API configuration
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar'
];

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '';
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || 'Sheet1';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'caiorarity@gmail.com';

// Debug environment variables
console.log('Google API Environment Variables:', {
  SPREADSHEET_ID: SPREADSHEET_ID ? 'SET' : 'NOT SET',
  CALENDAR_ID: CALENDAR_ID,
  OAUTH2_AVAILABLE: !!(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET && process.env.GOOGLE_OAUTH_REFRESH_TOKEN),
  SERVICE_ACCOUNT_AVAILABLE: !!process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Initialize Google Auth
// Prefers OAuth (acting as the user) if GOOGLE_OAUTH_CLIENT_ID/SECRET and GOOGLE_OAUTH_REFRESH_TOKEN are present.
// Falls back to service account key file when OAuth is not configured.
export const getGoogleAuth = async () => {
  try {
    console.log('🔍 Checking OAuth2 configuration...');
    console.log('GOOGLE_OAUTH_CLIENT_ID:', process.env.GOOGLE_OAUTH_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('GOOGLE_OAUTH_CLIENT_SECRET:', process.env.GOOGLE_OAUTH_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('GOOGLE_OAUTH_REFRESH_TOKEN:', process.env.GOOGLE_OAUTH_REFRESH_TOKEN ? 'SET' : 'NOT SET');
    console.log('GOOGLE_OAUTH_REDIRECT_URL:', process.env.GOOGLE_OAUTH_REDIRECT_URL ? 'SET' : 'NOT SET');
    
    const hasOAuth = !!(
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN &&
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );

    console.log('🔍 Has OAuth2 credentials:', hasOAuth);

    if (hasOAuth) {
      console.log('🚀 Setting up OAuth2 client...');
      const oAuth2 = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URL
      );
      oAuth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
      // Force token refresh to ensure validity
      await oAuth2.getAccessToken();
      console.log('✅ Initialized Google OAuth2 client (user-based).');
      return oAuth2 as any;
    }

    console.log('⚠️  OAuth2 not available, falling back to Service Account...');

    // Check for individual service account environment variables first
    const hasServiceAccountEnvVars = !!(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    );

    if (hasServiceAccountEnvVars) {
      console.log('🔑 Using Service Account from environment variables...');
      console.log('Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

      // Parse the private key (handle escaped newlines)
      const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: privateKey,
        },
        scopes: SCOPES,
      });

      console.log('✅ Service Account Google Auth initialized successfully from env vars');
      return auth;
    }

    // Fallback to credentials file
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('Neither OAuth2 nor Service Account credentials are available. Please configure OAuth2 or provide service account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY or GOOGLE_APPLICATION_CREDENTIALS).');
    }

    console.log('📄 Using Service Account from credentials file...');
    console.log('Credentials file path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });
    console.log('✅ Service Account Google Auth initialized successfully from file');
    return auth;
  } catch (error) {
    console.error('Error initializing Google Auth:', error);
    throw error;
  }
};

// Google Sheets service
export class GoogleSheetsService {
  private auth: any;

  constructor(auth: any) {
    this.auth = auth;
  }

  async appendLeadData(data: Partial<LeadFormData>) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });

      const budgetCell = (() => {
        if (data.budget === 'no') return 'no budget';
        if (data.budget === 'yes' && data.budgetAmount) return `${data.budgetAmount} USD`;
        if (data.budget === 'yes') return 'yes';
        return '';
      })();

      const scheduledCell = data.scheduledDateTime
        ? new Date(data.scheduledDateTime).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
          })
        : '';

      // Timestamp in Brasilia timezone
      const timestamp = new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });

      const values = [
        [
          data.name || '',
          data.whatsapp || '',
          data.email || '',
          data.instagram || '',
          data.industry || '',
          data.struggle || '',
          budgetCell,
          scheduledCell,
          timestamp, // Timestamp in Brasilia timezone
        ]
      ];

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Folha1!A:I', // Adjust range based on your sheet
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      throw error;
    }
  }

  async updateLeadData(rowIndex: number, data: Partial<LeadFormData>) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });

      // Find the row with the user's email
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Folha1!A:I',
      });

      // We no longer update rows in place; new submissions should append new rows
      return this.appendLeadData(data);
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      throw error;
    }
  }
}

// Google Calendar service
export class GoogleCalendarService {
  private auth: any;

  constructor(auth: any) {
    this.auth = auth;
  }

  async createEvent(data: LeadFormData, startTime: string) {
    try {
      console.log('Creating calendar event with data:', {
        name: data.name,
        email: data.email,
        startTime,
        calendarId: CALENDAR_ID
      });
      
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      
      // Format budget for calendar display
      let budgetDisplay: string = '';
      if (data.budget === 'yes' && data.budgetAmount) {
        budgetDisplay = `${data.budgetAmount} USD`;
      } else if (data.budget === 'yes' && !data.budgetAmount) {
        budgetDisplay = 'Yes (amount not specified)';
      } else if (data.budget === 'no') {
        budgetDisplay = 'No';
      }

      // Ensure startTime is properly formatted
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      const event: any = {
        summary: `Strategy Call with ${data.name}`,
        description: [
          'You are confirmed for a Strategy & Consultation call.\n',
          'We will align AI, automation, and marketing strategy to accelerate your growth.\n',
          '',
          'What to prepare:',
          '- Your main goal for the next 90 days',
          '- Top 1–2 bottlenecks',
          '- Current tools and sales process',
          '',
          'Lead details:',
          `- Name: ${data.name}`,
          `- WhatsApp: ${data.whatsapp}`,
          `- Email: ${data.email}`,
          `- Instagram: ${data.instagram}`,
          `- Industry: ${data.industry}`,
          `- Main Struggle: ${data.struggle}`,
          `- Budget: ${budgetDisplay}`,
        ].join('\n'),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        // Try to include attendees so Google sends native invitations/RSVP
        attendees: [
          { email: 'caiorarity@gmail.com' },
          { email: data.email },
        ],
        reminders: {
          useDefault: true, // Use Google's default reminder system
        },
        // Ensure attendees receive notifications
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true,
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        // Ensure the event is visible and can be found
        transparency: 'opaque',
        visibility: 'default',
      };

      console.log('Attempting to insert calendar event with config:', {
        calendarId: CALENDAR_ID,
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        supportsAttachments: false
      });
      
      let response;
      try {
        response = await calendar.events.insert({
          calendarId: CALENDAR_ID,
          requestBody: event,
          sendUpdates: 'all', // emails attendees
          conferenceDataVersion: 1,
          supportsAttachments: false,
        });
      } catch (err: any) {
        // Fallback: some personal calendars or service accounts cannot create Google Meet links
        console.warn('Conference creation failed, retrying without conferenceData:', err?.response?.data || err?.message);
        const { conferenceData, ...eventWithoutConference } = event;
        response = await calendar.events.insert({
          calendarId: CALENDAR_ID,
          requestBody: eventWithoutConference as any,
          sendUpdates: 'all',
          supportsAttachments: false,
        });
      }

      // Log the created event for debugging
      console.log('Calendar event created successfully:', {
        eventId: response.data.id,
        hangoutLink: response.data.hangoutLink,
        conferenceData: response.data.conferenceData,
        startTime: response.data.start,
        endTime: response.data.end,
        reminders: response.data.reminders,
        attendees: response.data.attendees,
      });
      
      // Log the event configuration that was sent
      console.log('Event configuration sent to Google:', {
        summary: event.summary,
        start: event.start,
        end: event.end,
        reminders: event.reminders,
        attendees: event.attendees,
        sendUpdates: 'all'
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async getAvailableTimeSlots(date: Date, userTimeZone?: string): Promise<string[]> {
    try {
      console.log('Getting available time slots for date:', date, 'user timezone:', userTimeZone);

      const calendar = google.calendar({ version: 'v3', auth: this.auth });

      // Define office hours in Brasilia time (America/Sao_Paulo)
      const tz = 'America/Sao_Paulo';

      // Helper to create a date in Brasilia timezone
      // Extract YYYY-MM-DD from the input date
      const dateStr = date.toISOString().split('T')[0]; // e.g., "2025-11-14"

      // Create start and end times in Brasilia timezone using ISO 8601 format
      // This ensures we're working with the correct date in Brasilia time
      const startOfDay = new Date(`${dateStr}T08:00:00-03:00`); // 8:00 AM Brasilia (UTC-3)
      const endOfDay = new Date(`${dateStr}T20:00:00-03:00`); // 8:00 PM Brasilia (UTC-3)

      // Check if the selected date is a Sunday (0 = Sunday)
      // Use the date string to avoid timezone confusion
      const dayOfWeek = new Date(dateStr).getUTCDay();
      if (dayOfWeek === 0) {
        console.log('Selected date is Sunday - no available slots');
        return [];
      }

      console.log('Searching for events between:', startOfDay.toISOString(), 'and', endOfDay.toISOString());

      const response = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      console.log('Found existing events:', events.length);

      // Calculate minimum booking time (2 hours from now) in UTC
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      console.log('Current time (UTC):', now.toISOString());
      console.log('Minimum booking time (2h from now, UTC):', minBookingTime.toISOString());

      const availableSlots: string[] = [];

      // Generate 1-hour slots from 8 AM to 8 PM (Monday to Saturday)
      for (let hour = 8; hour < 20; hour++) {
        // Create slot time in Brasilia timezone (UTC-3)
        const slotTime = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00-03:00`);
        const slotEnd = new Date(slotTime.getTime() + 60 * 60 * 1000);

        // Skip slots that are less than 2 hours from now
        // Compare both dates in UTC (they're already Date objects in UTC internally)
        if (slotTime.getTime() < minBookingTime.getTime()) {
          console.log('Skipping slot (too soon):', slotTime.toISOString(), '- slot time:', slotTime.getTime(), 'min time:', minBookingTime.getTime());
          continue;
        }

        // Check if slot conflicts with existing events
        const hasConflict = events.some(event => {
          const eventStart = new Date(event.start?.dateTime || '');
          const eventEnd = new Date(event.end?.dateTime || '');
          return slotTime < eventEnd && slotEnd > eventStart;
        });

        if (!hasConflict) {
          // Store ISO time in Brasilia timezone
          availableSlots.push(slotTime.toISOString());
        }
      }

      console.log('Generated available slots:', availableSlots.length, availableSlots);
      return availableSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return [];
    }
  }
}
