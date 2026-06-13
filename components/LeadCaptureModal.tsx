"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadFormSchema, LeadFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TextureButton } from '@/components/ui/texture-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Check, Calendar, MapPin } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useI18n } from '@/lib/i18n';


interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const { t, locale } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Array<{ iso: string, display: string }>>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  const calNamespace = locale === 'pt' ? "call-estrategica-com-o-caio" : "freeconsultancy";
  const calLink = locale === 'pt' ? "caiodecamargo/call-estrategica-com-o-caio" : "caiodecamargo/freeconsultancy";

  const [userTimeZone, setUserTimeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid');
  const [budgetAmount, setBudgetAmount] = useState<number | undefined>();
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsCache, setSlotsCache] = useState<Map<string, Array<{ iso: string, display: string }>>>(new Map());
  const [lastLoadedDate, setLastLoadedDate] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string, flag: string, prefix: string, format: string }>({
    code: 'BR',
    flag: '🇧🇷',
    prefix: '+55',
    format: '(11) 98765-4321'
  });
  // Lista completa de países com bandeiras, prefixos e formatos
  const countries = [
    // América do Sul
    { code: 'BR', flag: '🇧🇷', prefix: '+55', name: 'Brasil', format: '(11) 98765-4321' },
    { code: 'AR', flag: '🇦🇷', prefix: '+54', name: 'Argentina', format: '11 2345-6789' },
    { code: 'CL', flag: '🇨🇱', prefix: '+56', name: 'Chile', format: '9 8765 4321' },
    { code: 'CO', flag: '🇨🇴', prefix: '+57', name: 'Colombia', format: '312 345 6789' },
    { code: 'PE', flag: '🇵🇪', prefix: '+51', name: 'Perú', format: '987 654 321' },
    { code: 'VE', flag: '🇻🇪', prefix: '+58', name: 'Venezuela', format: '412-3456789' },
    { code: 'EC', flag: '🇪🇨', prefix: '+593', name: 'Ecuador', format: '99 123 4567' },
    { code: 'BO', flag: '🇧🇴', prefix: '+591', name: 'Bolivia', format: '71234567' },
    { code: 'PY', flag: '🇵🇾', prefix: '+595', name: 'Paraguay', format: '981 123456' },
    { code: 'UY', flag: '🇺🇾', prefix: '+598', name: 'Uruguay', format: '94 123 456' },
    { code: 'GY', flag: '🇬🇾', prefix: '+592', name: 'Guyana', format: '609 1234' },
    { code: 'SR', flag: '🇸🇷', prefix: '+597', name: 'Suriname', format: '741-2345' },

    // América Central
    { code: 'MX', flag: '🇲🇽', prefix: '+52', name: 'México', format: '55 1234 5678' },
    { code: 'GT', flag: '🇬🇹', prefix: '+502', name: 'Guatemala', format: '5123 4567' },
    { code: 'HN', flag: '🇭🇳', prefix: '+504', name: 'Honduras', format: '9123-4567' },
    { code: 'SV', flag: '🇸🇻', prefix: '+503', name: 'El Salvador', format: '7123-4567' },
    { code: 'NI', flag: '🇳🇮', prefix: '+505', name: 'Nicaragua', format: '8123 4567' },
    { code: 'CR', flag: '🇨🇷', prefix: '+506', name: 'Costa Rica', format: '8312-3456' },
    { code: 'PA', flag: '🇵🇦', prefix: '+507', name: 'Panamá', format: '6123-4567' },
    { code: 'BZ', flag: '🇧🇿', prefix: '+501', name: 'Belize', format: '622-1234' },

    // América do Norte
    { code: 'US', flag: '🇺🇸', prefix: '+1', name: 'USA', format: '(555) 123-4567' },
    { code: 'CA', flag: '🇨🇦', prefix: '+1', name: 'Canada', format: '(555) 123-4567' },

    // Europa Ocidental
    { code: 'ES', flag: '🇪🇸', prefix: '+34', name: 'España', format: '612 34 56 78' },
    { code: 'PT', flag: '🇵🇹', prefix: '+351', name: 'Portugal', format: '912 345 678' },
    { code: 'FR', flag: '🇫🇷', prefix: '+33', name: 'France', format: '6 12 34 56 78' },
    { code: 'IT', flag: '🇮🇹', prefix: '+39', name: 'Italy', format: '312 345 6789' },
    { code: 'DE', flag: '🇩🇪', prefix: '+49', name: 'Germany', format: '151 23456789' },
    { code: 'GB', flag: '🇬🇧', prefix: '+44', name: 'UK', format: '7400 123456' },
    { code: 'IE', flag: '🇮🇪', prefix: '+353', name: 'Ireland', format: '85 123 4567' },
    { code: 'NL', flag: '🇳🇱', prefix: '+31', name: 'Netherlands', format: '6 12345678' },
    { code: 'BE', flag: '🇧🇪', prefix: '+32', name: 'Belgium', format: '470 12 34 56' },
    { code: 'LU', flag: '🇱🇺', prefix: '+352', name: 'Luxembourg', format: '628 123 456' },
    { code: 'CH', flag: '🇨🇭', prefix: '+41', name: 'Switzerland', format: '78 123 45 67' },
    { code: 'AT', flag: '🇦🇹', prefix: '+43', name: 'Austria', format: '664 1234567' },

    // Europa do Norte
    { code: 'SE', flag: '🇸🇪', prefix: '+46', name: 'Sweden', format: '70-123 45 67' },
    { code: 'NO', flag: '🇳🇴', prefix: '+47', name: 'Norway', format: '406 12 345' },
    { code: 'DK', flag: '🇩🇰', prefix: '+45', name: 'Denmark', format: '32 12 34 56' },
    { code: 'FI', flag: '🇫🇮', prefix: '+358', name: 'Finland', format: '41 2345678' },
    { code: 'IS', flag: '🇮🇸', prefix: '+354', name: 'Iceland', format: '611 2345' },

    // Europa do Leste
    { code: 'PL', flag: '🇵🇱', prefix: '+48', name: 'Poland', format: '512 345 678' },
    { code: 'CZ', flag: '🇨🇿', prefix: '+420', name: 'Czech Republic', format: '601 123 456' },
    { code: 'SK', flag: '🇸🇰', prefix: '+421', name: 'Slovakia', format: '912 123 456' },
    { code: 'HU', flag: '🇭🇺', prefix: '+36', name: 'Hungary', format: '20 123 4567' },
    { code: 'RO', flag: '🇷🇴', prefix: '+40', name: 'Romania', format: '712 345 678' },
    { code: 'BG', flag: '🇧🇬', prefix: '+359', name: 'Bulgaria', format: '87 123 4567' },
    { code: 'UA', flag: '🇺🇦', prefix: '+380', name: 'Ukraine', format: '50 123 4567' },
    { code: 'RU', flag: '🇷🇺', prefix: '+7', name: 'Russia', format: '912 345-67-89' },

    // Europa do Sul
    { code: 'GR', flag: '🇬🇷', prefix: '+30', name: 'Greece', format: '691 234 5678' },
    { code: 'HR', flag: '🇭🇷', prefix: '+385', name: 'Croatia', format: '91 234 5678' },
    { code: 'SI', flag: '🇸🇮', prefix: '+386', name: 'Slovenia', format: '31 234 567' },
    { code: 'RS', flag: '🇷🇸', prefix: '+381', name: 'Serbia', format: '60 1234567' },

    // Ásia - Leste
    { code: 'CN', flag: '🇨🇳', prefix: '+86', name: 'China', format: '131 2345 6789' },
    { code: 'JP', flag: '🇯🇵', prefix: '+81', name: 'Japan', format: '90-1234-5678' },
    { code: 'KR', flag: '🇰🇷', prefix: '+82', name: 'South Korea', format: '10-1234-5678' },

    // Ásia - Sudeste
    { code: 'ID', flag: '🇮🇩', prefix: '+62', name: 'Indonesia', format: '812-3456-7890' },
    { code: 'KH', flag: '🇰🇭', prefix: '+855', name: 'Cambodia', format: '12 345 678' },
    { code: 'TH', flag: '🇹🇭', prefix: '+66', name: 'Thailand', format: '81 234 5678' },
    { code: 'VN', flag: '🇻🇳', prefix: '+84', name: 'Vietnam', format: '91 234 56 78' },
    { code: 'SG', flag: '🇸🇬', prefix: '+65', name: 'Singapore', format: '8123 4567' },
    { code: 'MY', flag: '🇲🇾', prefix: '+60', name: 'Malaysia', format: '12-345 6789' },
    { code: 'PH', flag: '🇵🇭', prefix: '+63', name: 'Philippines', format: '905 123 4567' },

    // Ásia - Sul
    { code: 'IN', flag: '🇮🇳', prefix: '+91', name: 'India', format: '81234 56789' },
    { code: 'PK', flag: '🇵🇰', prefix: '+92', name: 'Pakistan', format: '301 2345678' },
    { code: 'BD', flag: '🇧🇩', prefix: '+880', name: 'Bangladesh', format: '1712-345678' },

    // Oceania
    { code: 'AU', flag: '🇦🇺', prefix: '+61', name: 'Australia', format: '412 345 678' },
    { code: 'NZ', flag: '🇳🇿', prefix: '+64', name: 'New Zealand', format: '21 123 4567' },

    // Oriente Médio
    { code: 'AE', flag: '🇦🇪', prefix: '+971', name: 'UAE', format: '50 123 4567' },
    { code: 'SA', flag: '🇸🇦', prefix: '+966', name: 'Saudi Arabia', format: '51 234 5678' },
    { code: 'IL', flag: '🇮🇱', prefix: '+972', name: 'Israel', format: '50-123-4567' },
    { code: 'TR', flag: '🇹🇷', prefix: '+90', name: 'Turkey', format: '501 234 5678' },
  ];

  const formSteps = [
    { id: 'intro', title: t('leadCapture.intro.title'), field: null, type: 'intro' as const, required: false },
    { id: 'name', title: t('leadCapture.steps.name.title'), field: 'name' as keyof LeadFormData, type: 'text' as const, placeholder: t('leadCapture.steps.name.placeholder'), required: true },
    { id: 'whatsapp', title: t('leadCapture.steps.whatsapp.title'), field: 'whatsapp' as keyof LeadFormData, type: 'text' as const, placeholder: t('leadCapture.steps.whatsapp.placeholder'), required: true },
    { id: 'email', title: t('leadCapture.steps.email.title'), field: 'email' as keyof LeadFormData, type: 'email' as const, placeholder: t('leadCapture.steps.email.placeholder'), required: true },
    { id: 'industry', title: t('leadCapture.steps.industry.title'), field: 'industry' as keyof LeadFormData, type: 'textarea' as const, placeholder: t('leadCapture.steps.industry.placeholder'), required: true },
    { id: 'struggle', title: t('leadCapture.steps.struggle.title'), field: 'struggle' as keyof LeadFormData, type: 'textarea' as const, placeholder: t('leadCapture.steps.struggle.placeholder'), required: true },
    { id: 'budget', title: t('leadCapture.steps.budget.title'), field: 'budget' as keyof LeadFormData, type: 'select' as const, options: [{ value: 'yes', label: t('leadCapture.steps.budget.yes') }, { value: 'no', label: t('leadCapture.steps.budget.no') }], required: true },
    { id: 'calendar', title: t('leadCapture.steps.calendar.title'), field: null, type: 'calendar' as const, required: false },
  ];



  const schema = createLeadFormSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<LeadFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Cal.com initialization - Initialize immediately on mount
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: calNamespace });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#9316c0",
            "cal-text": "#ffffff",
            "cal-text-muted": "#9ca3af",
            "cal-bg": "#000000",
          },
          light: {
            "cal-brand": "#5f0f65",
            "cal-text": "#111827",
            "cal-text-muted": "#4b5563",
            "cal-bg": "#ffffff",
          }
        }
      });

      // Listen for booking success directly via Cal API
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          console.log("Cal.com Booking Event Received:", e);

          // Cal.com events can sometimes be nested in detail.data or just data depending on version/context
          const eventData = e.detail?.data || e.data || e;

          if (!eventData) {
            console.error("No data found in booking event");
            setIsSuccess(true); // Still show success UI to avoid getting stuck
            return;
          }

          const fullWhatsApp = `${selectedCountry.prefix}${watchedValuesRef.current.whatsapp}`;
          const finalData = {
            ...watchedValuesRef.current,
            // We trust our form email more than Cal.com's potential extraction
            email: watchedValuesRef.current.email,
            whatsapp: fullWhatsApp,
            budgetAmount,
            scheduledDateTime: eventData?.date || eventData?.startTime || new Date().toISOString(),
            bookingDetails: eventData
          };

          // Mark success immediately to update UI
          setIsSuccess(true);

          // Send data in background
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
          }).catch(err => console.error("Error saving lead:", err));

          // Send immediate WhatsApp confirmation
          let waMessage = '';
          if (locale === 'pt') {
            waMessage = `🎉 Olá ${watchedValuesRef.current.name}, sua Call Estratégica está confirmada!\n\nSeu horário está reservado na agenda. Você receberá o link do Google Meet 1 hora antes de começarmos.\n\nEstou ansioso para batermos um papo! - Caio`;
          } else if (locale === 'es') {
            waMessage = `🎉 ¡Hola ${watchedValuesRef.current.name}, tu Llamada Estratégica está confirmada!\n\nHe reservado tu hora en el calendario. Recibirás el enlace de Google Meet 1 hora antes de que comencemos.\n\n¡Espero con ansias nuestra charla! - Caio`;
          } else {
            waMessage = `🎉 Hey ${watchedValuesRef.current.name}, your Strategy Call is confirmed!\n\nI have locked your time in the calendar. You will receive the Google Meet link 1 hour before we start.\n\nLooking forward to our chat! - Caio`;
          }

          fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: fullWhatsApp,
              message: waMessage
            })
          }).catch(err => console.error("Error sending WhatsApp confirmation:", err));
        }
      });
    })();
  }, [calNamespace]); // Re-run when namespace changes

  // Ref to access latest values inside the callback without re-running effect
  const watchedValuesRef = useRef(watchedValues);
  useEffect(() => {
    watchedValuesRef.current = watchedValues;
  }, [watchedValues]);

  // Preload data when values change, but don't re-initialize the whole API
  useEffect(() => {
    if (watchedValues.name) {
      (async function () {
        const cal = await getCalApi({ namespace: calNamespace });
        cal("preload", {
          name: watchedValues.name,
          email: watchedValues.email, // Passing email back to Cal.com
          notes: `Industry: ${watchedValues.industry}\nStruggle: ${watchedValues.struggle}\nLanguage: ${locale.toUpperCase()}`
        } as any);
      })();
    }
  }, [watchedValues.name, watchedValues.email, watchedValues.industry, watchedValues.struggle, calNamespace]);

  const handleNext = async () => {
    const currentField = formSteps[currentStep].field;

    // Regular field validation
    if (currentField) {
      const isValid = await trigger(currentField);
      if (!isValid) {
        return;
      }
    }

    // Debug: log current step info
    console.log('Current step:', currentStep, 'Step ID:', currentStepData.id, 'Budget value:', watchedValues['budget']);

    // If user selected no budget, auto-save and redirect to WhatsApp instead of showing a button
    if (currentStepData.id === 'budget' && watchedValues['budget'] === 'no') {
      console.log('Redirecting to WhatsApp - no budget selected');
      try {
        // Concatenate country prefix with WhatsApp number
        const fullWhatsApp = `${selectedCountry.prefix}${watchedValues.whatsapp}`;

        const leadData = {
          name: watchedValues.name,
          whatsapp: fullWhatsApp,
          email: watchedValues.email,
          industry: watchedValues.industry,
          struggle: watchedValues.struggle,
          budget: 'no',
          budgetAmount: undefined,
        };

        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        });
      } catch (e) {
        console.error('Failed to save lead before WhatsApp redirect:', e);
      } finally {
        const messages = {
          en: "Hey Caio, I filled the form but I don't have budget to invest.",
          pt: 'Oi Caio, preenchi o formulário mas não tenho orçamento para investir.',
          es: 'Hola Caio, completé el formulario pero no tengo presupuesto para invertir.',
        } as const;
        const whatsappMessage = (messages as any)[locale] || messages.en;
        const whatsappUrl = `https://wa.me/5551993288772?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
      }
      return;
    }

    // Regular next step logic
    if (currentStep < formSteps.length - 1) {
      // PRE-SAVE LEAD: If we are moving to the Calendar step (last step), save the lead data immediately.
      // This ensures we capture the lead even if they don't complete the Cal.com booking.
      if (currentStep + 1 === formSteps.length - 1) {
        console.log("Pre-saving lead data before Calendar...");
        const fullWhatsApp = `${selectedCountry.prefix}${watchedValues.whatsapp}`;
        const leadData = {
          ...watchedValues,
          whatsapp: fullWhatsApp,
          budgetAmount,
          source: 'Form Completion (Pre-Booking)'
        };
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        }).catch(err => console.error("Pre-save lead failed:", err));
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      if (currentStep === formSteps.length - 1 && selectedTime) {
        // Concatenate country prefix with WhatsApp number
        const fullWhatsApp = `${selectedCountry.prefix}${data.whatsapp}`;

        const finalData = {
          ...data,
          whatsapp: fullWhatsApp,
          budgetAmount,
          scheduledDateTime: selectedTime
        };
        const response = await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...finalData, startTime: selectedTime }),
        });

        if (response.ok) {
          const calendarData = await response.json();
          setIsSuccess(true);

          // Save lead data and log problems
          try {
            const saveRes = await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(finalData),
            });
            if (!saveRes.ok) {
              console.error('Leads save failed:', saveRes.status, await saveRes.text());
            }
          } catch (e) {
            console.error('Leads save error:', e);
          }

          // Send notification email to Caio (minimal)
          try {
            await fetch('/api/email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: ['caiorarity@gmail.com'],
                subject: `New Strategy and Consultation Booking: ${data.name}`,
                html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Strategy Call Booked</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 0 auto; padding: 24px; }
    .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    .header { padding: 24px; border-bottom: 1px solid #e5e7eb; }
    .title { font-size: 20px; font-weight: 700; margin: 0; color: #111827; }
    .content { padding: 24px; }
    .row { display: flex; margin: 6px 0; }
    .label { width: 120px; color: #6b7280; }
    .value { color: #111827; font-weight: 600; }
    .button { display: inline-block; margin-top: 16px; background: #111827; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="title">New strategy call booked</div>
      </div>
      <div class="content">
        <div class="row">
          <div class="label">Lead</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="row">
          <div class="label">Email</div>
          <div class="value">${data.email}</div>
        </div>
        <div class="row">
          <div class="label">WhatsApp</div>
          <div class="value">${data.whatsapp}</div>
        </div>
        <div class="row">
          <div class="label">When</div>
          <div class="value">${selectedDate.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(selectedTime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: userTimeZone })} (${userTimeZone})</div>
        </div>
        <a class="button" href="${calendarData.event?.hangoutLink || calendarData.event?.meetLink || '#'}">Open Meet</a>
      </div>
              <div class="footer">Lead will receive Google Calendar invitation with RSVP.</div>
    </div>
  </div>
</body>
</html>`
              })
            });
          } catch (caioEmailError) {
            console.error('Failed to send Caio notification email:', caioEmailError);
          }
        } else {
          console.error('Failed to create calendar event');
        }
      } else {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, budgetAmount }),
        });
        if (currentStep < formSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }
    } catch (error) {
      console.error('Error processing form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalendarDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
    loadTimeSlots(date);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTime(timeSlot);
    setValue('scheduledDateTime', timeSlot);
  };

  // Load time slots for a given date with CACHE
  const loadTimeSlots = async (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check cache first - instant response!
    if (slotsCache.has(dateKey)) {
      setAvailableSlots(slotsCache.get(dateKey)!);
      setLastLoadedDate(dateKey);
      return;
    }

    // Only show loading if we don't have cache
    setIsLoadingSlots(true);
    try {
      const response = await fetch(`/api/calendar?date=${date.toISOString()}&tz=${encodeURIComponent(userTimeZone)}`);
      if (response.ok) {
        const data = await response.json();
        const slots = data.availableSlots || [];

        // Update cache
        setSlotsCache(prev => new Map(prev).set(dateKey, slots));
        setAvailableSlots(slots);
        setLastLoadedDate(dateKey);
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // ULTRA-AGGRESSIVE PRE-LOAD: Start loading from NAME step (step 1)
  useEffect(() => {
    const calendarStepIndex = formSteps.length - 1; // Calendar is last

    // Pre-load as soon as modal opens (step 1 or later)
    if (currentStep >= 1 && isOpen) {
      // Find first available date (skip today if it's past 6 PM BRT or if it's Sunday)
      const findFirstAvailableDate = () => {
        const now = new Date();
        const nowBRT = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const currentHourBRT = nowBRT.getHours();

        for (let i = 0; i < 14; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dayOfWeek = date.getDay();

          // Skip Sundays
          if (dayOfWeek === 0) continue;

          // Skip today if it's past 6 PM BRT (considering 2-hour advance booking)
          if (i === 0 && currentHourBRT >= 18) continue;

          return date;
        }

        // Fallback to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      };

      const firstAvailable = findFirstAvailableDate();

      // Only update selectedDate if we're actually on the calendar step
      if (currentStep === calendarStepIndex) {
        setSelectedDate(firstAvailable);
      }

      // ALWAYS pre-load slots on every step change to ensure they're ready
      loadTimeSlots(firstAvailable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isOpen, formSteps.length]);

  const resetForm = () => {
    setCurrentStep(0);
    setIsSuccess(false);
    setSelectedDate(new Date());
    setSelectedTime('');
  };

  const currentStepData = formSteps[currentStep];
  const progress = ((currentStep + 1) / formSteps.length) * 100;

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl font-sans w-[95%] sm:w-[90%]">
          <DialogHeader>
            <DialogTitle className="sr-only">{t('leadCapture.success.title')}</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('leadCapture.success.title')}</h2>
            <p className="text-muted mb-6">
              {t('leadCapture.success.message')}
            </p>
            <div className="space-y-3 mt-4 w-full flex justify-center">
              <div className="w-full max-w-[200px]">
                <TextureButton variant="primary" onClick={onClose}>
                  {t('leadCapture.success.close')}
                </TextureButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px] w-[95%] sm:w-[90%] p-0 border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl overflow-hidden font-sans">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('leadCapture.intro.title')}</DialogTitle>
        </DialogHeader>
        {/* Header with Progress */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-primary/20">
          {/* Progress Bar */}
          <div className="w-full bg-card/20 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Step Counter and Title */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">
              {t('leadCapture.form.stepCounter').replace('{current}', String(currentStep + 1)).replace('{total}', String(formSteps.length))}
            </span>
            <span className="text-xs text-primary font-medium">
              {Math.round(progress)}% {t('leadCapture.progress.complete')}
            </span>
          </div>

          {/* Current Step Title */}
          <h2 className="text-base sm:text-lg font-semibold text-center bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
            {currentStepData.title}
          </h2>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 max-h-[55vh] max-h-[55dvh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Intro Step */}
              {currentStep === 0 && (
                <div className="text-center space-y-6 py-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{t('leadCapture.intro.title')}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {t('leadCapture.intro.message')}
                  </p>
                </div>
              )}

              {/* Form Steps */}
              {currentStep > 0 && currentStep < formSteps.length - 1 && (
                <div className="space-y-4">
                  {currentStepData.type === 'text' && (
                    <div className="space-y-2">
                      {currentStepData.field === 'whatsapp' ? (
                        <div className="flex gap-3">
                          {/* Country Selector - Minimal */}
                          <select
                            value={selectedCountry.code}
                            onChange={(e) => {
                              const country = countries.find(c => c.code === e.target.value);
                              if (country) setSelectedCountry(country);
                            }}
                            className="h-[50px] w-[90px] sm:w-[110px] pl-2 sm:pl-3 pr-7 sm:pr-9 bg-black/80 border-2 border-white/10 rounded-xl text-white font-sans font-medium text-base sm:text-lg hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 cursor-pointer appearance-none shadow-inner"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(168,85,247,0.6)' viewBox='0 0 20 20'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                              backgroundSize: '16px'
                            }}
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.prefix}
                              </option>
                            ))}
                          </select>

                          {/* WhatsApp Input */}
                          <input
                            {...register(currentStepData.field!)}
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder={selectedCountry.format}
                            className="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-black/80 border-2 border-white/10 rounded-lg text-white font-sans font-medium text-base sm:text-lg placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 shadow-inner"
                            onChange={(e) => {
                              // Only allow numbers, spaces, parentheses, and dashes (NO +)
                              let value = e.target.value.replace(/[^\d() \-]/g, '');
                              e.target.value = value;
                              register(currentStepData.field!).onChange(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNext();
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          {...register(currentStepData.field!)}
                          type="text"
                          placeholder={currentStepData.placeholder}
                          className="w-full px-3 sm:px-4 py-3 bg-black/80 border-2 border-white/10 rounded-lg text-white font-sans font-medium text-base sm:text-lg placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 shadow-inner"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleNext();
                            }
                          }}
                        />
                      )}
                      {errors[currentStepData.field as keyof LeadFormData] && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          {errors[currentStepData.field as keyof LeadFormData]?.message}
                        </p>
                      )}
                    </div>
                  )}

                  {currentStepData.type === 'email' && (
                    <div className="space-y-2">
                      <input
                        {...register(currentStepData.field!)}
                        type="email"
                        placeholder={currentStepData.placeholder}
                        className="w-full px-3 sm:px-4 py-3 bg-black/80 border-2 border-white/10 rounded-lg text-white font-sans font-medium text-base sm:text-lg placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 shadow-inner"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                      />
                      {errors[currentStepData.field as keyof LeadFormData] && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          {errors[currentStepData.field as keyof LeadFormData]?.message}
                        </p>
                      )}
                    </div>
                  )}

                  {currentStepData.type === 'textarea' && (
                    <div className="space-y-2">
                      <textarea
                        {...register(currentStepData.field!)}
                        placeholder={currentStepData.placeholder}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-3 bg-black/80 border-2 border-white/10 rounded-lg text-white font-sans font-medium text-base sm:text-lg placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none shadow-inner"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                      />
                      {errors[currentStepData.field as keyof LeadFormData] && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          {errors[currentStepData.field as keyof LeadFormData]?.message}
                        </p>
                      )}
                    </div>
                  )}

                  {currentStepData.type === 'select' && (
                    <div className="space-y-3">
                      {/* Budget Options */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Yes Option */}
                        <div
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${watchedValues[currentStepData.field!] === 'yes'
                            ? 'bg-primary/20 border-primary text-white'
                            : 'bg-black/80 border-white/10 text-zinc-400 hover:border-primary/50 hover:text-white shadow-inner font-sans'
                            }`}
                          onClick={() => setValue(currentStepData.field!, 'yes')}
                        >
                          <Switch
                            id="budget-toggle-yes"
                            checked={watchedValues[currentStepData.field!] === 'yes'}
                            onCheckedChange={(checked) => {
                              setValue(currentStepData.field!, checked ? 'yes' : 'no');
                            }}
                          />
                          <label htmlFor="budget-toggle-yes" className="font-medium cursor-pointer">
                            {t('leadCapture.steps.budget.yes')}
                          </label>
                        </div>

                        {/* No Option */}
                        <div
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${watchedValues[currentStepData.field!] === 'no'
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                            : 'bg-black/80 border-white/10 text-zinc-400 hover:border-yellow-500/50 hover:text-yellow-300 shadow-inner font-sans'
                            }`}
                          onClick={() => setValue(currentStepData.field!, 'no')}
                        >
                          <Switch
                            id="budget-toggle-no"
                            checked={watchedValues[currentStepData.field!] === 'no'}
                            onCheckedChange={(checked) => {
                              setValue(currentStepData.field!, checked ? 'no' : 'yes');
                            }}
                          />
                          <label htmlFor="budget-toggle-no" className="font-medium cursor-pointer">
                            {t('leadCapture.steps.budget.no')}
                          </label>
                        </div>
                      </div>

                      {/* Notice for No selection */}
                      {watchedValues[currentStepData.field!] === 'no' && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-sm text-yellow-400 text-center">
                            {t('leadCapture.steps.budget.noNotice')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Calendar Step */}
              {currentStep === formSteps.length - 1 && (
                <div className="w-full h-full min-h-[400px] sm:min-h-[500px]">
                  <Cal
                    namespace={calNamespace}
                    calLink={calLink}
                    style={{ width: "100%", height: "100%", minHeight: "400px", overflow: "scroll" }}
                    config={{
                      layout: "month_view",
                      useSlotsViewOnSmallScreen: "true",
                      theme: "dark"
                    }}
                  />

                </div>
              )}
              {/* REMOVED OLD CALENDAR LOGIC */}
              {false && (
                <div className="hidden">

                  {/* Date Selection */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-center">{t('leadCapture.steps.calendar.dateSelection')}</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 14 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const isSelected = selectedDate.toDateString() === date.toDateString();
                        const isToday = i === 0;
                        const isSunday = date.getDay() === 0;

                        // Check if today is past 6 PM BRT (considering 2-hour advance booking)
                        const now = new Date();
                        const nowBRT = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
                        const currentHourBRT = nowBRT.getHours();
                        const isTodayPastBookingTime = i === 0 && currentHourBRT >= 18;

                        const isDisabled = isSunday || isTodayPastBookingTime;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => !isDisabled && handleCalendarDateSelect(date)}
                            disabled={isDisabled}
                            className={`p-2 rounded-lg border transition-all text-center ${isDisabled
                              ? 'opacity-30 cursor-not-allowed bg-card/20 border-cardBorder/30'
                              : isSelected
                                ? 'border-primary bg-primary text-white shadow-lg hover:scale-105'
                                : 'border-cardBorder hover:border-primary/50 bg-card/50 hover:bg-card/70 hover:scale-105'
                              } ${isToday && !isDisabled ? 'ring-2 ring-primary/50' : ''}`}
                          >
                            <div className="text-xs font-medium opacity-80">
                              {date.toLocaleDateString(locale, { weekday: 'short' })}
                            </div>
                            <div className="text-base font-bold">
                              {date.getDate()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-center">{t('leadCapture.steps.calendar.timeSlots')}</h3>
                      {isLoadingSlots ? (
                        <div className="text-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                          <p className="text-muted text-sm">Loading available time slots...</p>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => {
                            const isSelected = slot.iso === selectedTime;

                            return (
                              <button
                                key={slot.iso}
                                type="button"
                                onClick={() => handleTimeSlotSelect(slot.iso)}
                                className={`p-3 rounded-lg border transition-all text-sm hover:scale-105 ${isSelected
                                  ? 'border-primary bg-primary text-white shadow-lg'
                                  : 'border-cardBorder hover:border-primary/50 bg-card/50 hover:bg-card/70'
                                  }`}
                              >
                                {slot.display}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted text-sm">{t('leadCapture.steps.calendar.noSlots')}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selection Status */}
                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <div className="flex items-center gap-3 text-center">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {selectedDate.toLocaleDateString(locale, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted">
                            at {new Date(selectedTime).toLocaleTimeString(locale, {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: userTimeZone
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className={`p-4 sm:p-6 pt-3 sm:pt-4 safe-area-bottom ${currentStep === formSteps.length - 1 ? 'bg-transparent border-t-0' : 'border-t border-primary/20 bg-gradient-to-t from-black/50 to-transparent'}`}>
          <div className="flex justify-between items-center w-full gap-4">
            <div className={`w-[100px] sm:w-[120px] ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}`}>
              <TextureButton
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('leadCapture.navigation.back')}</span>
              </TextureButton>
            </div>

            {currentStep === formSteps.length - 1 ? (
              <></> // Hidden on calendar step
            ) : (
              <div className="w-[100px] sm:w-[120px]">
                <TextureButton
                  variant="primary"
                  onClick={handleNext}
                >
                  <span>{t('leadCapture.navigation.next')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </TextureButton>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

    </Dialog>
  );
}
