# ARCHITECTURE - Caio Personal Brand Landing Page

## 🏗️ **Project Structure**

```
caio_personal_brand_lp/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Dynamic locale routing
│   │   ├── layout.tsx           # Locale-specific layout with SEO metadata
│   │   └── page.tsx             # Main page component with lead capture integration
│   ├── api/                     # API routes for backend services
│   │   ├── leads/               # Lead data management endpoints
│   │   │   └── route.ts         # POST/PUT operations for lead data
│   │   └── calendar/            # Calendar operations endpoints
│   │       └── route.ts         # GET available slots, POST event creation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout (minimal)
│   └── page.tsx                 # Root redirect
├── components/                   # React components
│   ├── icons/                   # SVG icon components
│   │   ├── InstagramLogo.tsx
│   │   ├── LinkedInLogo.tsx
│   │   └── XLogo.tsx
│   ├── ui/                      # UI component library
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card component
│   │   ├── dialog.tsx          # Dialog/Modal component
│   │   └── dropdown-menu.tsx   # Dropdown menu component
│   ├── LanguageSwitcher.tsx    # Language selection component
│   └── LeadCaptureModal.tsx    # Interactive lead capture funnel
├── i18n/                        # Internationalization utilities
│   └── request.ts              # IP-based locale detection
├── lib/                         # Utility libraries
│   ├── i18n.tsx                # I18n context and provider
│   ├── utils.ts                # General utilities
│   ├── types.ts                # TypeScript type definitions and form schemas
│   └── google-services.ts      # Google API service wrappers
├── messages/                    # Translation files
│   ├── en.json                 # English translations
│   ├── pt.json                 # Portuguese translations
│   └── es.json                 # Spanish translations
├── public/                      # Static assets
│   └── caio-profile-2026.jpg      # Profile photo (static import)
├── styles/                      # Additional styles
│   └── globals.css             # Global CSS (legacy)
├── middleware.ts                # Next.js middleware
├── next.config.js              # Next.js configuration with optimizations
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── .env.local                  # Environment variables for Google APIs
├── LEAD_CAPTURE_SETUP.md       # Google Cloud Platform setup guide
├── FUTURE_STEPS.md             # Future development roadmap
└── .gitignore                  # Git ignore rules including credentials
```

## 🔧 **Technology Stack**

### **Frontend Framework**
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with modern features
- **TypeScript**: Type-safe development

### **Styling & UI**
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible UI component primitives
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### **Form Management & Validation**
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation and type inference
- **Custom Validation**: WhatsApp country code enforcement, budget logic

### **Backend Services & APIs**
- **Google Sheets API v4**: Real-time lead data collection
- **Google Calendar API v3**: Automated scheduling and event management
- **Google Cloud Platform**: Service account authentication and API management
- **Next.js API Routes**: Serverless backend endpoints

### **Internationalization**
- **Custom I18n Context**: React Context API for state management
- **IP Geolocation**: IP-API.com for country detection
- **Dynamic Routing**: Next.js locale-based routing

### **Development Tools**
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🎯 **Core Architecture Patterns**

### **Component Architecture**
- **Atomic Design**: Components built from smallest units up
- **Composition**: Components composed of smaller, reusable parts
- **Props Interface**: Strong TypeScript typing for component props
- **Custom Hooks**: Logic separation using React hooks

### **State Management**
- **React Context**: Global state for internationalization
- **Local State**: Component-level state with useState
- **Form State**: React Hook Form for complex form management
- **Server State**: Static generation for performance

### **Routing Strategy**
- **App Router**: Next.js 13+ file-based routing
- **Dynamic Routes**: `[locale]` for language-specific paths
- **API Routes**: `/api/leads` and `/api/calendar` for backend services
- **Middleware**: IP detection and automatic redirects
- **Static Generation**: Pre-built pages for all locales

## 🌐 **Internationalization Architecture**

### **Locale Detection Flow**
```
User Request → Middleware → IP Detection → Country Mapping → Locale Selection → Redirect
```

### **Message Loading**
```typescript
// Dynamic import based on locale
const messages = await import(`./messages/${locale}.json`);
```

### **Context Provider Pattern**
```typescript
<I18nProvider initialLocale={locale}>
  {children}
</I18nProvider>
```

### **Translation Function**
```typescript
const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = messages[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Fallback to key
    }
  }
  
  return typeof value === 'string' ? value : key;
};
```

## 📝 **Lead Capture System Architecture**

### **Form Flow & Data Collection**
```
Modal Trigger → Intro → Name → WhatsApp → Email → Instagram → Industry → Struggle → Budget → Calendar → Confirmation
```

### **Form Schema & Validation**
```typescript
// Zod schema for lead data
const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  whatsapp: z.string().regex(/^\+[1-9]\d{0,3}[\s\-\(\)]*\d{1,4}[\s\-\(\)]*\d{1,4}[\s\-\(\)]*\d{1,4}$/, "Must include country code"),
  email: z.string().email("Invalid email address"),
  instagram: z.string().min(1, "Instagram handle is required"),
  industry: z.string().min(1, "Industry is required"),
  struggle: z.string().min(1, "Main struggle is required"),
  budget: z.union([
    z.literal("no"),
    z.object({
      amount: z.number().positive("Budget must be a positive number")
    }).transform((data) => `yes:${data.amount}`)
  ])
});
```

### **Real-Time Data Persistence**
- **Auto-Save**: Data saved to Google Sheets after each form step
- **Progressive Enhancement**: Form data persists across browser sessions
- **Error Handling**: Graceful fallback for API failures

### **Conditional Logic & Business Rules**
- **Budget Handling**: Numeric input for "yes", redirect for "no"
- **Scheduling Logic**: Skip calendar for non-investors
- **Timezone Support**: User-selected timezone with backend conversion

## 🔌 **Google API Integration Architecture**

### **Authentication Flow**
```
Service Account → JSON Key → Environment Variables → API Client → Google Services
```

### **Google Sheets Service**
```typescript
class GoogleSheetsService {
  async appendLeadData(data: LeadFormData): Promise<void>
  async updateLeadData(id: string, data: Partial<LeadFormData>): Promise<void>
}
```

### **Google Calendar Service**
```typescript
class GoogleCalendarService {
  async getAvailableTimeSlots(date: string, timeZone: string): Promise<TimeSlot[]>
  async createEvent(eventData: CalendarEventData): Promise<string>
}
```

### **API Route Architecture**
```typescript
// /api/leads/route.ts
export async function POST(request: Request): Promise<Response>
export async function PUT(request: Request): Promise<Response>

// /api/calendar/route.ts
export async function GET(request: Request): Promise<Response>
export async function POST(request: Request): Promise<Response>
```

## 📱 **Responsive Design Architecture**

### **Breakpoint Strategy**
- **Mobile First**: Base styles for mobile devices
- **Small**: `sm:` prefix (640px+)
- **Medium**: `md:` prefix (768px+)
- **Large**: `lg:` prefix (1024px+)

### **Component Responsiveness**
- **Flexible Layouts**: CSS Grid and Flexbox
- **Adaptive Typography**: Responsive font sizes
- **Conditional Rendering**: Show/hide elements based on screen size
- **Touch-Friendly**: Mobile-optimized interactions

### **Mobile Optimization Features**
- **Spacing Adjustments**: Optimized margins and padding for mobile
- **Image Sizing**: Responsive profile photo dimensions
- **Typography Scaling**: Adaptive font sizes across breakpoints
- **Touch Targets**: Adequate button sizes for mobile interaction

## 🎨 **Styling Architecture**

### **CSS Strategy**
- **Tailwind Utilities**: Rapid development with utility classes
- **Custom Properties**: CSS variables for design tokens
- **Component Scoping**: Scoped styles for component-specific needs
- **Responsive Variants**: Screen-size specific styling

### **Design Token System**
```typescript
// tailwind.config.ts
colors: {
  background: "#101010",
  foreground: "#ffffff",
  muted: "#A0A0A0",
  card: "#1C1C1C",
  cardBorder: "#2D2D2D",
  primary: {
    DEFAULT: "#8b5cf6",
    foreground: "#ffffff",
  },
}
```

## 🔄 **Data Flow Architecture**

### **Static Data Flow**
```
Translation Files → I18n Context → Components → UI Rendering
```

### **Dynamic Data Flow**
```
User Interaction → Component State → Context Update → UI Re-render
```

### **Lead Capture Data Flow**
```
Form Input → Validation → API Call → Google Sheets → Success/Error → UI Update
```

### **Calendar Data Flow**
```
Date Selection → Timezone Selection → API Call → Google Calendar → Available Slots → UI Display
```

## 🚀 **Performance Architecture**

### **Optimization Strategies**
- **Static Generation**: Pre-built pages for all locales
- **Image Optimization**: Next.js Image component with static imports
- **Code Splitting**: Automatic bundle splitting
- **Lazy Loading**: Component-level lazy loading

### **Caching Strategy**
- **Build-time Caching**: Static generation
- **Runtime Caching**: React component memoization
- **Asset Caching**: Static asset optimization

### **SEO Optimizations**
```typescript
// next.config.js optimizations
compress: true,
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
}
```

## 🔒 **Security Architecture**

### **Security Measures**
- **Input Validation**: TypeScript type safety + Zod schema validation
- **XSS Prevention**: React's built-in protection
- **CSRF Protection**: Next.js built-in security
- **Content Security**: Secure external links
- **Environment Variables**: Secure credential management

### **External Integrations**
- **Google APIs**: OAuth 2.0 service account authentication
- **WhatsApp**: Secure messaging protocol
- **Social Media**: Secure external linking

### **Data Protection**
- **Lead Data**: Stored securely in Google Sheets with service account access
- **Calendar Events**: Private calendar with controlled sharing
- **User Privacy**: Minimal data collection, clear purpose

## 📊 **Monitoring & Analytics**

### **Performance Monitoring**
- **Core Web Vitals**: Next.js built-in metrics
- **Bundle Analysis**: Build-time optimization
- **Runtime Performance**: React DevTools

### **User Analytics**
- **Page Views**: Next.js analytics
- **Language Usage**: Custom tracking
- **Interaction Metrics**: User behavior analysis
- **Lead Conversion**: Form completion tracking

## 🔧 **Development Workflow**

### **Build Process**
```bash
npm run build    # Production build
npm run dev      # Development server
npm run lint     # Code linting
```

### **Environment Setup**
```bash
# Required environment variables
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_CALENDAR_ID=your-calendar-id
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### **Deployment Strategy**
- **Static Export**: Build-time generation
- **CDN Ready**: Optimized for content delivery
- **Environment Config**: Environment-specific settings
- **Google API Keys**: Secure credential management

## 🧪 **Testing Strategy**

### **Testing Levels**
- **Unit Testing**: Component-level testing
- **Integration Testing**: Component interaction testing
- **E2E Testing**: User journey testing
- **Performance Testing**: Load and speed testing

### **Testing Tools**
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Lighthouse**: Performance testing

## 🔮 **Future Architecture Considerations**

### **Scalability Plans**
- **Micro-frontends**: Component-level scaling
- **API Integration**: Enhanced backend service integration
- **Database Integration**: Content management system
- **Real-time Features**: WebSocket integration
- **Email Marketing**: Automated email sequences
- **CRM Integration**: Customer relationship management

### **Maintenance Strategy**
- **Component Library**: Reusable component system
- **Documentation**: Comprehensive technical docs
- **Code Standards**: Consistent coding patterns
- **Update Strategy**: Regular dependency updates
- **API Versioning**: Google API version management

## 📋 **Implementation Checklist**

### **Google Cloud Platform Setup**
- [ ] Enable Google Sheets API v4
- [ ] Enable Google Calendar API v3
- [ ] Create service account with appropriate permissions
- [ ] Generate and secure JSON key file
- [ ] Configure environment variables

### **Google Sheets Configuration**
- [ ] Create spreadsheet with proper column headers
- [ ] Share with service account email
- [ ] Test API connectivity
- [ ] Verify data persistence

### **Google Calendar Configuration**
- [ ] Set calendar timezone to Europe/Madrid
- [ ] Share calendar with service account
- [ ] Configure working hours (8 AM - 6 PM)
- [ ] Test event creation and slot availability

### **Form Implementation**
- [ ] Multi-step form with progress indicators
- [ ] Real-time validation and error handling
- [ ] Auto-save functionality
- [ ] Conditional logic for budget handling
- [ ] Timezone selection and calendar integration

### **Mobile Optimization**
- [ ] Responsive design across all breakpoints
- [ ] Touch-friendly interactions
- [ ] Optimized spacing and typography
- [ ] Performance optimization for mobile devices

---

*This document covers the technical architecture and implementation details. For project overview, see OVERVIEW.md. For design specifications, see DESIGN_RULES.md.*

