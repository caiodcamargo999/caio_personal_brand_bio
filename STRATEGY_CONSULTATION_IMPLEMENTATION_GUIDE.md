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
