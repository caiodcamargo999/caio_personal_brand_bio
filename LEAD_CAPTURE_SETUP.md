# LEAD CAPTURE: IMPLEMENTATION GUIDELINES (Sheets, Calendar, Email)

Use this guideline to implement, verify, and operate the lead capture system across projects. It includes setup, testing, customization, and troubleshooting.

## 1) Prerequisites
- Node.js installed and the app able to run with `npm run dev`.
- Access to Google Cloud Console to create a Service Account and enable APIs.
- Ability to place `google-credentials.json` in the project root.

## 2) Google Cloud Setup (one-time per environment)
1. Create or select a project in Google Cloud Console.
2. Enable APIs:
   - Google Sheets API v4
   - Google Calendar API v3
3. Create a Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Assign minimally necessary role (Editor is sufficient for prototyping)
   - Create a JSON key and download it
4. Store the key at the project root as `google-credentials.json` and keep it secret.

Verification checklist:
- The JSON is valid and readable by the app.
- The service account email is noted (you will share resources with it).

## 3) Google Sheets Configuration
1. Create a Google Sheet or choose an existing one.
2. Create columns in this order (first row as headers):
   - A: Name
   - B: WhatsApp
   - C: Email
   - D: Instagram
   - E: Industry/Business
   - F: Main Struggle
   - G: Budget/Investment
   - H: Scheduled Date & Time
   - I: Timestamp
3. Share the Sheet with the Service Account email and grant Editor access.
4. Copy the Spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.

Recommended practices:
- Freeze header row; format date/time columns.
- Keep a dedicated Sheet per environment (dev/staging/prod) and share accordingly.

## 4) Google Calendar Configuration
1. Create or select a calendar for bookings.
2. Set timezone accurately (e.g., `Europe/Madrid`).
3. Configure working hours (e.g., Monday–Friday, 08:00–18:00; no weekends).
4. Share the calendar with the Service Account and grant sufficient permissions to create events.
5. Note the Calendar ID (typically an email-like identifier).

Optional tips:
- Create a dedicated “Bookings” calendar separate from your personal calendar.
- Ensure event guests receive invitations if desired (depends on implementation).

## 5) Environment Variables (.env.local)
Create or update `.env.local` in the project root:
```bash
# Google APIs
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CALENDAR_ID=your_calendar_id_here

# Email (Gmail SMTP example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
MAIL_FROM=your_gmail@gmail.com

# Feature flags / App config
NEXT_PUBLIC_EMAIL_ENABLED=true
```

Notes:
- Restart the dev server after changing env vars.
- Use separate credentials per environment; never commit secrets.

## 6) Gmail SMTP (recommended quick start)
1. Enable 2‑Step Verification on your Google Account.
2. Generate an App Password: `https://myaccount.google.com/apppasswords` (App: Mail, Device: Other → name it).
3. Use the 16‑character password (remove spaces) as `SMTP_PASS`, and your Gmail as `SMTP_USER`/`MAIL_FROM`.

## 7) Start and Verify End‑to‑End
1. Start the dev server:
```bash
npm run dev
```
2. Open the lead capture modal and submit a test lead.
3. Verify all three integrations:
   - Google Sheets: a new row is added with your data.
   - Google Calendar: an event is created at the selected time.
   - Email: a confirmation email is received (if `NEXT_PUBLIC_EMAIL_ENABLED=true`).

## 8) API Tests (direct endpoint checks)
- Leads → Google Sheets write:
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

- Single Email sending:
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/email" -Method POST -ContentType "application/json" -Body '{"to":["test@example.com"],"subject":"Test Email","html":"<h1>Test</h1><p>Hello</p>"}'

# curl
curl -X POST http://localhost:3000/api/email -H "Content-Type: application/json" -d "{\"to\":[\"test@example.com\"],\"subject\":\"Test Email\",\"html\":\"<h1>Test</h1><p>Hello</p>\"}"
```
Expected response: `{ "success": true, "id": "..." }`.

## 9) Troubleshooting (detailed)
Common symptoms and fixes:
- Failed to save to API (client console):
  - Ensure `.env.local` contains correct IDs and paths.
  - Confirm `google-credentials.json` exists and is readable.
  - Check that the API route is accessible (server logs).
- 500 Internal Server Error (server):
  - Missing/invalid Google credentials; recreate the service account key.
  - Environment variables not loaded; restart the server.
- Google Sheets “Permission denied”:
  - Share the Sheet with the Service Account email (Editor).
  - Verify Spreadsheet ID is correct.
- Google Calendar event not created:
  - Ensure the Service Account has permissions on the target calendar.
  - Verify Calendar ID and timezone settings.
- Email delivery issues:
  - 500 on `/api/email`: verify SMTP host/port and credentials.
  - Authentication failed: use Gmail app password and remove spaces.
  - Connection timeouts: confirm network egress and correct `SMTP_PORT`.

Operational tips:
- After any env var change, restart `npm run dev`.
- Use server logs to diagnose API route failures.

## 10) Advanced Configuration
- Availability and slot duration: adjust logic in `lib/google-services.ts` (working hours, timezone, slot length).
- Form schema/validation: modify `lib/types.ts`.
- UI/UX customization: edit `components/LeadCaptureModal.tsx` (theme, layout, animations).
- Multi‑language email content: update `messages/*.json` and HTML in `lib/email-templates.ts`.

## 11) Production & Security
- Secrets management: use environment variables or secret stores; never commit keys.
- Separate resources: different Sheets/Calendars per environment; share with the correct Service Account.
- Quotas & reliability: monitor Google API usage; implement retries and logging around API calls.
- Compliance: verify SPF/DKIM/DMARC if using custom domain for email.

## 12) Support & Verification Checklist
- Console shows no network/API errors during form flow.
- New leads appear in the correct spreadsheet tab.
- Calendar event reflects the expected date/time and attendees.
- Emails render properly across clients (Gmail desktop/mobile at minimum).

---

# EMAIL WORKFLOW GUIDELINES

Complete guidance for configuring and operating the email system used by lead capture and scheduling. This document replaces any prior summaries and provides actionable instructions.

## 1) What the System Does
- Sends a confirmation email after a lead books a call.
- Supports pre‑call reminders and post‑call follow‑ups.
- Works in multiple languages (content sourced from `messages/*.json`).
- Uses HTML templates generated by `lib/email-templates.ts`.
- Exposes APIs for direct testing and manual triggers.

## 2) Prerequisites
- SMTP credentials (Gmail SMTP example below) and `NEXT_PUBLIC_EMAIL_ENABLED=true`.
- Working lead capture flow so we have `name`, `email`, scheduled time, and locale.

## 3) Environment Variables (.env.local)
```bash
# Required for email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
MAIL_FROM=your_gmail@gmail.com

# Feature flag
NEXT_PUBLIC_EMAIL_ENABLED=true

# Google OAuth (optional but recommended for Calendar events with Meet + RSVP)
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=your_stored_refresh_token
```

Gmail setup tips:
- Enable 2‑Step Verification and create an App Password at https://myaccount.google.com/apppasswords.
- Use the 16‑character password (remove spaces) as `SMTP_PASS`.

## 4) Templates and Localization
- HTML structure and styling live in `lib/email-templates.ts`.
- Translated strings live in `messages/en.json`, `messages/pt.json`, `messages/es.json`.
- The system picks a locale from the request or falls back to English.

Common template types supported:
- Confirmation (immediately after booking)
- Pre‑Call (e.g., 24h before the call)
- Follow‑Up (after the call with next steps/resources)

## 5) API Endpoints

### 5.1 Send a single email
Endpoint: `POST /api/email`

Body (example using direct HTML):
```json
{
  "to": ["test@example.com"],
  "subject": "Test Email",
  "html": "<h1>Test</h1><p>Hello</p>",
  "replyTo": "optional@domain.com"
}
```

Body (example using a template):
```json
{
  "to": ["john@example.com"],
  "template": "confirmation",
  "locale": "en",
  "data": {
    "name": "John",
    "date": "2025-01-01",
    "time": "15:00",
    "timezone": "Europe/Madrid",
    "duration": "60m",
    "platform": "Google Meet",
    "meetingLink": "https://meet.google.com/xyz-abc"
  }
}
```

Response:
```json
{ "success": true, "id": "message_id_here" }
```

### 5.2 Trigger sequence steps manually
Endpoint: `POST /api/email-sequence`

Body (pre‑call example):
```json
{
  "action": "preCall",
  "leadData": {
    "name": "John",
    "email": "john@example.com",
    "date": "2025-01-02",
    "time": "15:00",
    "timezone": "Europe/Madrid"
  },
  "locale": "en"
}
```

Body (follow‑up example):
```json
{
  "action": "followUp",
  "leadData": {
    "name": "John",
    "email": "john@example.com"
  },
  "locale": "en"
}
```

## 6) Automatic Sending in the App
- When a user completes the lead capture and a calendar event is created, the app sends a confirmation email if `NEXT_PUBLIC_EMAIL_ENABLED=true` and SMTP is configured.
- For reminder/follow‑up automation, use scheduling (below).

## 7) Scheduling (Reminders and Follow‑ups)
Use a job runner to trigger reminders automatically. This project includes a polling endpoint and a Vercel Cron configuration.

### 7.1 Vercel Cron (recommended)
Create `vercel.json` at project root with:
```json
{
  "crons": [
    {
      "path": "/api/email-sequence",
      "schedule": "*/5 * * * *",
      "method": "GET"
    }
  ]
}
```
Deploy to Vercel and the scheduler will call the endpoint every 5 minutes.

### 7.2 What the GET endpoint does
`GET /api/email-sequence` scans upcoming Google Calendar events and sends reminders at:
- 24 hours before
- 2 hours before
- 15 minutes before

It marks each event with flags (`reminder24h`, `reminder2h`, `reminder15m`) in `extendedProperties.private` to prevent duplicates.

Notes:
- The service account must have "Make changes to events" on the calendar.
- Google's native invites will still be sent to attendees; these reminders are complementary.

## 8) Customization
- Adjust HTML layout and styles in `lib/email-templates.ts`.
- Update copy per language in the relevant `messages/*.json`.
- Add new template types by extending the template generator and wiring a new `template` value.

## 9) Testing
Manual tests:
```bash
# Single email
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"to":["test@example.com"],"subject":"Test Email","html":"<h1>Test</h1>"}'

# Sequence step
curl -X POST http://localhost:3000/api/email-sequence \
  -H "Content-Type: application/json" \
  -d '{"action":"preCall","leadData":{"name":"Test","email":"test@example.com"},"locale":"en"}'
```

Expected: `{ "success": true, "id": "..." }` for the single email call; sequence endpoint should return success status for the triggered action.

## 10) Troubleshooting
- 500 on `/api/email`: check SMTP host/port, `SMTP_USER`, `SMTP_PASS`, and that the app password is used.
- Authentication failed: ensure Gmail 2‑Step Verification and correct app password (no spaces).
- No email sent from lead capture: confirm `NEXT_PUBLIC_EMAIL_ENABLED=true` and that the flow reaches email sending logic.
- Locale not applied: verify the locale passed or that fallback to `en` is working.

## 11) Production Notes
- Keep secrets in environment variables; never commit credentials.
- Monitor deliverability (SPF/DKIM/DMARC if using custom domain).
- Add retries and logging for transient SMTP errors.
- Rate limit outbound mail if needed.

---

# STRATEGY & CONSULTATION FUNNEL: COMPLETE IMPLEMENTATION GUIDE

## 🎯 **Overview**
This guide shows how to implement a complete lead capture funnel for Strategy & Consultation services, including:
- Multi-step form with progress tracking
- Google Calendar integration with OAuth 2.0
- Google Sheets data collection
- Automated email reminders
- WhatsApp redirect for non-investors
- Multi-language support (EN/PT/ES)

---

## 📁 **File Structure Overview**

### **🎯 Componentes Principais:**
```
components/
├── LeadCaptureModal.tsx          # Modal principal do funil
├── LanguageSwitcher.tsx          # Seletor de idiomas
└── ui/                           # Componentes de UI (botões, cards, diálogos)
```

### **🌐 Páginas e Rotas:**
```
app/
├── [locale]/                     # Rotas internacionalizadas
│   ├── layout.tsx               # Layout com suporte a idiomas
│   └── page.tsx                 # Página principal com botão do funil
├── page.tsx                      # Redirecionamento da raiz para /bio
└── globals.css                   # Estilos globais
```

### **🔌 APIs e Integrações:**
```
app/api/
├── calendar/                     # Disponibilidade e agendamento
│   └── route.ts
├── email/                        # Envio de emails
│   └── route.ts
├── email-sequence/               # Lembretes automáticos
│   └── route.ts
├── leads/                        # Armazenamento de leads
│   └── route.ts
└── google/oauth/                 # Autenticação OAuth
    ├── route.ts                  # Início da autenticação
    └── callback/route.ts         # Callback OAuth
```

### **📚 Bibliotecas e Utilitários:**
```
lib/
├── email-templates.ts            # Templates de email minimalistas
├── google-services.ts            # Integração com APIs do Google
├── i18n.tsx                     # Sistema de internacionalização
└── types.ts                     # Definições TypeScript
```

### **🌍 Traduções:**
```
messages/
├── en.json                      # Inglês
├── pt.json                      # Português
└── es.json                      # Espanhol
```

### **⚙️ Configurações:**
```
├── vercel.json                  # Configuração cron para lembretes
├── tailwind.config.ts           # Configuração do Tailwind CSS
└── .env.local                   # Variáveis de ambiente
```

---

## 🚀 **Step-by-Step Implementation**

### **Step 1: Project Setup**
```bash
# Create Next.js project
npx create-next-app@latest strategy-consultation-funnel --typescript --tailwind --app

# Install dependencies
npm install framer-motion react-hook-form @hookform/resolvers zod
npm install googleapis nodemailer
npm install @types/nodemailer --save-dev
```

### **Step 2: Create Basic Page Structure**
```tsx
// app/[locale]/page.tsx
import { useI18n } from '@/lib/i18n';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';

export default function HomePage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  
  return (
    <main>
      <Card onClick={() => setIsLeadModalOpen(true)}>
        <h2>Strategy & Consultation</h2>
        <p>Get personalized AI, automation, and business scaling strategies.</p>
        <span>Book Strategy Call →</span>
      </Card>
      
      <LeadCaptureModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </main>
  );
}
```

### **Step 3: Create Lead Capture Modal**
```tsx
// components/LeadCaptureModal.tsx
export function LeadCaptureModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  
  const formSteps = [
    { id: 'intro', title: 'Introduction' },
    { id: 'name', title: 'Name', field: 'name' },
    { id: 'whatsapp', title: 'WhatsApp', field: 'whatsapp' },
    { id: 'email', title: 'Email', field: 'email' },
    { id: 'instagram', title: 'Instagram', field: 'instagram' },
    { id: 'industry', title: 'Industry', field: 'industry' },
    { id: 'struggle', title: 'Main Struggle', field: 'struggle' },
    { id: 'budget', title: 'Budget', field: 'budget' },
    { id: 'budgetAmount', title: 'Budget Amount', field: 'budgetAmount' },
    { id: 'calendar', title: 'Schedule Call', field: 'scheduledDateTime' }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
        </div>
        
        {/* Current step content */}
        <div>{renderCurrentStep()}</div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button onClick={handleBack}>Back</Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### **Step 4: Implement Form Logic**
```tsx
const handleNext = async () => {
  // Validate current field
  const currentField = formSteps[currentStep].field;
  if (currentField) {
    const isValid = await trigger(currentField);
    if (!isValid) return;
  }
  
  // Special logic for budget step
  if (currentStepData.id === 'budget' && watchedValues['budget'] === 'no') {
    // Auto-save lead data
    await saveLeadData();
    // Redirect to WhatsApp
    redirectToWhatsApp();
    return;
  }
  
  // Regular next step
  if (currentStep < formSteps.length - 1) {
    setCurrentStep(currentStep + 1);
  }
};
```

### **Step 5: Google Calendar Integration**
```tsx
// lib/google-services.ts
export async function createEvent(eventData) {
  const auth = await getGoogleAuth();
  const calendar = google.calendar({ version: 'v3', auth });
  
  const event = {
    summary: `Strategy Call with ${eventData.name}`,
    start: { dateTime: eventData.startTime, timeZone: eventData.timezone },
    end: { dateTime: eventData.endTime, timeZone: eventData.timezone },
    attendees: [
      { email: eventData.email },
      { email: 'caiorarity@gmail.com' }
    ],
    conferenceData: {
      createRequest: { requestId: uuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
    }
  };
  
  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });
    
    return response.data;
  } catch (error) {
    console.error('Calendar event creation failed:', error);
    throw error;
  }
}
```

### **Step 6: Google OAuth Setup**
```tsx
// app/api/google/oauth/route.ts
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.email'
];

export async function GET() {
  const oAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  );
  
  const url = oAuth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  
  return NextResponse.redirect(url);
}
```

### **Step 7: Lead Data Storage**
```tsx
// app/api/leads/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  try {
    const auth = await getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const values = [
      [
        data.name,
        data.whatsapp,
        data.email,
        data.instagram,
        data.industry,
        data.struggle,
        data.budget === 'yes' ? `${data.budgetAmount} USD` : 'no budget',
        data.scheduledDateTime || '',
        new Date().toISOString()
      ]
    ];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:I',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save lead:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
```

### **Step 8: Email System**
```tsx
// lib/email-templates.ts
export function generateConfirmationEmail(data, locale, t) {
  return {
    subject: t('leadCapture.emails.confirmation.subject'),
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 640px; margin: 0 auto; padding: 24px; }
            .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; }
            .button { background: #111827; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <h2>Your strategy call is confirmed</h2>
              <p>Hi ${data.name}, thanks for booking your Strategy & Consultation session.</p>
              <div>When: ${data.scheduledTime}</div>
              <div>Where: Google Meet</div>
              <a class="button" href="{{MEETING_LINK}}">Join the call</a>
            </div>
          </div>
        </body>
      </html>
    `
  };
}
```

### **Step 9: Automated Reminders**
```tsx
// app/api/email-sequence/route.ts
export async function GET() {
  try {
    const auth = await getGoogleAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Get upcoming events
    const now = new Date();
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h from now
    
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    const events = response.data.items || [];
    
    for (const event of events) {
      const startTime = new Date(event.start.dateTime);
      const timeUntilEvent = startTime.getTime() - now.getTime();
      const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60);
      
      // Send appropriate reminder
      if (hoursUntilEvent <= 2 && hoursUntilEvent > 1.5) {
        await sendReminder(event, '2h');
      } else if (hoursUntilEvent <= 0.25 && hoursUntilEvent > 0) {
        await sendReminder(event, '15min');
      }
    }
    
    return NextResponse.json({ success: true, eventsProcessed: events.length });
  } catch (error) {
    console.error('Email sequence error:', error);
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}
```

### **Step 10: Internationalization**
```tsx
// lib/i18n.tsx
export function useI18n() {
  const locale = useParams().locale as string;
  const messages = getMessages(locale);
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { t, locale };
}
```

---

## 🔧 **Environment Variables**
```bash
# .env.local
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/google/oauth/callback
GOOGLE_OAUTH_REFRESH_TOKEN=your_refresh_token

GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CALENDAR_ID=your_calendar_id

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=your_email@gmail.com
```

---

## 📋 **Testing Checklist**
- [ ] Form validation works for all fields
- [ ] Progress bar updates correctly
- [ ] WhatsApp redirect works for "no budget" users
- [ ] Google Calendar event creation succeeds
- [ ] Google Meet link is generated
- [ ] Lead data is saved to Google Sheets
- [ ] Email notifications are sent
- [ ] Automated reminders work (24h, 2h, 15min)
- [ ] Multi-language support works
- [ ] Mobile responsiveness is good

---

## 🚀 **Deployment**
```bash
# Build and deploy
npm run build
npm run start

# Or deploy to Vercel
vercel --prod
```

---

## 📚 **Key Features Implemented**
1. **Multi-step form** with progress tracking
2. **Smart budget logic** with WhatsApp redirect
3. **Google Calendar integration** with OAuth 2.0
4. **Google Sheets data collection**
5. **Automated email reminders**
6. **Multi-language support** (EN/PT/ES)
7. **Mobile-first responsive design**
8. **Professional email templates**
9. **Real-time availability checking**
10. **Lead qualification and routing**

This implementation provides a complete, professional lead capture system that can be easily customized and scaled for different business needs.

