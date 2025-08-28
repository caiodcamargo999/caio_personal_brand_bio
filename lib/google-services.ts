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
  CREDENTIALS_PATH: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'SET' : 'NOT SET'
});

// Initialize Google Auth
export const getGoogleAuth = async () => {
  try {
    console.log('Initializing Google Auth with:', {
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES
    });
    
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
    }
    
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: SCOPES,
    });
    
    console.log('Google Auth initialized successfully');
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

      const values = [
        [
          data.name || '',
          data.whatsapp || '',
          data.email || '',
          data.instagram || '',
          data.industry || '',
          data.struggle || '',
          data.budgetAmount ? `${data.budgetAmount} USD` : (data.budget || ''),
          data.scheduledDateTime ? new Date(data.scheduledDateTime).toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
          new Date().toISOString(), // Timestamp
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

      const rows = response.data.values || [];
      const userRowIndex = rows.findIndex((row: any[]) => row[2] === data.email);

      if (userRowIndex === -1) {
        // If user not found, append a new row
        return this.appendLeadData(data);
      }

      // If user is found, update the existing row
      const existingRow = rows[userRowIndex] || [];
      const updatedRow = [
        data.name || existingRow[0] || '',
        data.whatsapp || existingRow[1] || '',
        data.email || existingRow[2] || '',
        data.instagram || existingRow[3] || '',
        data.industry || existingRow[4] || '',
        data.struggle || existingRow[5] || '',
        data.budgetAmount ? `${data.budgetAmount} USD` : (data.budget || existingRow[6] || ''),
        data.scheduledDateTime ? new Date(data.scheduledDateTime).toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : (existingRow[7] || ''),
        new Date().toISOString(),
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Folha1!A${userRowIndex + 1}:I${userRowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedRow],
        },
      });

      return true;
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
          timeZone: 'Europe/Madrid',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Europe/Madrid',
        },
        // Note: Service accounts cannot add attendees without domain-wide delegation
        // The event will be created in the calendar but attendees won't be automatically added
        // attendees: [
        //   { email: 'caiorarity@gmail.com' },
        //   { email: data.email },
        // ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'email', minutes: 120 }, // 2 hours before
            { method: 'popup', minutes: 15 },
          ],
        },
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
      
      const response = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        supportsAttachments: false,
      });

      // Log the created event for debugging
      console.log('Calendar event created successfully:', {
        eventId: response.data.id,
        hangoutLink: response.data.hangoutLink,
        conferenceData: response.data.conferenceData,
        startTime: response.data.start,
        endTime: response.data.end,
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
      
      // Define office hours in Madrid time
      const tz = 'Europe/Madrid';
      const startOfDay = new Date(date);
      startOfDay.setHours(8, 0, 0, 0); // 8:00 AM Madrid
      
      const endOfDay = new Date(date);
      endOfDay.setHours(18, 0, 0, 0); // 6:00 PM Madrid

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

      const availableSlots: string[] = [];

      // Generate 1-hour slots from 8 AM to 6 PM
      for (let hour = 8; hour < 18; hour++) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(slotTime.getTime() + 60 * 60 * 1000);
        
        // Check if slot conflicts with existing events
        const hasConflict = events.some(event => {
          const eventStart = new Date(event.start?.dateTime || '');
          const eventEnd = new Date(event.end?.dateTime || '');
          return slotTime < eventEnd && slotEnd > eventStart;
        });

        if (!hasConflict) {
          // If user requested a timezone, we still store ISO in Madrid; client/server will format with tz param
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
