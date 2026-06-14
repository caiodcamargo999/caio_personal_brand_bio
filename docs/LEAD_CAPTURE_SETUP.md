# STRATEGY & CONSULTATION FUNNEL: COMPLETE IMPLEMENTATION GUIDE

## 🎯 **Overview**
This guide documents the current lead capture funnel architecture for the Caio Personal Brand project. It handles lead qualification, data storage (Google Sheets), CRM sync (Trello), Calendar booking (Cal.com), and automated reminders (Email & WhatsApp).

---

## 🗂 **Form Structure & Logic (`LeadCaptureModal.tsx`)**
The form is a multi-step modal built with React Hook Form, Zod validation, and Framer Motion for transitions.

### **Steps & Fields**
1. **Intro**: Brief introduction.
2. **Name**: Text input.
3. **WhatsApp**: Text input with a built-in Country Code Selector (`BR`, `US`, `ES`, etc.). The selected prefix is automatically concatenated to the number in the backend.
4. **Email**: Email input.
5. **Industry**: Textarea for business type.
6. **Struggle**: Textarea for the main problem/struggle.
7. **Budget**: Custom Switch Toggle (Yes/No).
   - **No Budget Flow**: Auto-saves lead data to the backend API and immediately redirects the user to a pre-filled WhatsApp conversation with Caio (bypassing the calendar).
   - **Yes Budget Flow**: Proceeds to the calendar step. It also **pre-saves** lead data to the backend API to prevent data loss in case of drop-offs during scheduling.
8. **Calendar (Cal.com)**:
   - Uses the `@calcom/embed-react` embed instead of a custom UI.
   - Embeds a specific Cal.com namespace depending on the user's locale (`call-estrategica-com-o-caio` for PT, `freeconsultancy` for EN/ES).
   - Listens to the `bookingSuccessful` event to finalize the process, update the backend, and trigger notification emails.

---

## 🔌 **Backend Architecture & Integrations**

### **1) Leads API (`/api/leads`)**
Triggered on budget step drop-off, calendar step pre-load, and booking completion.
- **Google Sheets Integration**: Uses `GoogleSheetsService` to append lead data as a new row to the designated Google Spreadsheet.
- **Trello CRM Integration**: 
  - Searches for an existing Trello card in the target list by the lead's name.
  - If found, it updates the card description.
  - If not found, it creates a new card.
  - Updates the card status dynamically based on whether it's a `📝 LEAD CAPTURED (FORM ONLY)` or `✅ BOOKING CONFIRMED`.

### **2) Email Notifications (`/api/email`)**
- Upon successful Cal.com booking, the frontend triggers `/api/email` to send a simple, formatted HTML notification directly to `caiorarity@gmail.com` with the lead's details, scheduled time, and Google Meet link.

### **3) Automated WhatsApp Reminders (`/api/whatsapp/reminders`)**
- Uses a local WhatsApp web client/service running in the Node environment (`whatsapp-service`).
- Scans Google Calendar for events happening in the next 2 hours.
- If an event is 1 hour away and hasn't been reminded yet (tracked via `waReminder1h` flag in Google Calendar event `extendedProperties`), it sends an automated WhatsApp message to the lead with the meeting details and Google Meet link.

---

---

## 📋 **Testing Checklist**
- [ ] Country Code selector maps properly to the final WhatsApp number passed to the backend.
- [ ] "No Budget" toggle redirects to WhatsApp directly and drops the lead into Trello/Sheets.
- [ ] "Yes Budget" proceeds to Cal.com UI correctly rendering the dark theme.
- [ ] Drop-offs before completing Cal.com booking are saved in Trello/Sheets as `FORM ONLY`.
- [ ] Successful Cal.com bookings update the Trello card status to `BOOKING CONFIRMED`.
- [ ] Caio receives an email notification on new bookings.
- [ ] 1-hour automated WhatsApp reminder script executes successfully via the endpoint.
