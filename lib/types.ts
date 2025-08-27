import { z } from "zod";

// Lead capture form schema (runtime messages are localized via the provided t())
export function createLeadFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('leadCapture.validation.nameRequired')),
    // Normalize formatting (spaces, dashes, parentheses) and validate E.164
    whatsapp: z
      .string()
      .transform((val) => (typeof val === 'string' ? val.replace(/[^\d+]/g, '') : val))
      .refine((val) => /^\+[1-9]\d{7,14}$/.test(val || ''), {
        message: t('leadCapture.validation.whatsappRequired'),
      }),
    email: z.string().email(t('leadCapture.validation.emailRequired')),
    instagram: z.string().min(1, t('leadCapture.validation.instagramRequired')),
    industry: z.string().min(2, t('leadCapture.validation.industryRequired')),
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
  instagram: string;
  industry: string;
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
