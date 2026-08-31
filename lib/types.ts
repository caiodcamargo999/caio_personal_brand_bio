import { z } from "zod";

// Lead capture form schema (runtime messages are localized via the provided t())
export function createLeadFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('leadCapture.validation.nameRequired')),
    // Extract only digits and validate minimum 8 numbers (allows formatting like (51) 99328-8772)
    whatsapp: z
      .string()
      .min(1, t('leadCapture.validation.whatsappRequired'))
      .refine((val) => {
        const digitsOnly = (val || '').replace(/\D/g, '');
        return digitsOnly.length >= 8;
      }, {
        message: t('leadCapture.validation.whatsappRequired'),
      }),
    email: z.string().email(t('leadCapture.validation.emailRequired')),
    industry: z.string().optional(),
    struggle: z.string().min(10, t('leadCapture.validation.struggleRequired')),
    budget: z.enum(["yes", "no"]),
    budgetAmount: z.number().optional(),
    scheduledDateTime: z.string().optional(),
  });
}

// Strongly-typed form data exported independently of schema construction
export type LeadFormData = {
  name: string;
  whatsapp: string;
  email: string;
  industry?: string;
  struggle: string;
  budget: "yes" | "no";
  budgetAmount?: number;
  scheduledDateTime?: string;
};

// Form step configuration
export interface FormStep {
  id: string;
  title: string;
  field: keyof LeadFormData;
  type: "text" | "email" | "textarea" | "select" | "calendar" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required: boolean;
}

// Calendar time slot
export interface TimeSlot {
  time: string;
  available: boolean;
  date: Date;
}

// Google Calendar event
export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{ email: string }>;
}
