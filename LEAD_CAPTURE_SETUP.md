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

