"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadFormSchema, LeadFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Check, Calendar, MapPin } from 'lucide-react';
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
  const [availableSlots, setAvailableSlots] = useState<Array<{iso: string, display: string}>>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userTimeZone, setUserTimeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid');
  const [budgetAmount, setBudgetAmount] = useState<number | undefined>();

  const formSteps = [
    { id: 'intro', title: t('leadCapture.intro.title'), field: null, type: 'intro' as const, required: false },
    { id: 'name', title: t('leadCapture.steps.name.title'), field: 'name' as keyof LeadFormData, type: 'text' as const, placeholder: t('leadCapture.steps.name.placeholder'), required: true },
    { id: 'whatsapp', title: t('leadCapture.steps.whatsapp.title'), field: 'whatsapp' as keyof LeadFormData, type: 'text' as const, placeholder: t('leadCapture.steps.whatsapp.placeholder'), required: true },
    { id: 'email', title: t('leadCapture.steps.email.title'), field: 'email' as keyof LeadFormData, type: 'email' as const, placeholder: t('leadCapture.steps.email.placeholder'), required: true },
    { id: 'instagram', title: t('leadCapture.steps.instagram.title'), field: 'instagram' as keyof LeadFormData, type: 'text' as const, placeholder: t('leadCapture.steps.instagram.placeholder'), required: true },
    { id: 'industry', title: t('leadCapture.steps.industry.title'), field: 'industry' as keyof LeadFormData, type: 'textarea' as const, placeholder: t('leadCapture.steps.industry.placeholder'), required: true },
    { id: 'struggle', title: t('leadCapture.steps.struggle.title'), field: 'struggle' as keyof LeadFormData, type: 'textarea' as const, placeholder: t('leadCapture.steps.struggle.placeholder'), required: true },
    { id: 'budget', title: t('leadCapture.steps.budget.title'), field: 'budget' as keyof LeadFormData, type: 'select' as const, options: [{ value: 'yes', label: t('leadCapture.steps.budget.yes') }, { value: 'no', label: t('leadCapture.steps.budget.no') }], required: true },
    { id: 'budgetAmount', title: t('leadCapture.steps.budgetAmount.title'), field: null, type: 'number' as const, placeholder: t('leadCapture.steps.budgetAmount.placeholder'), required: false },
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
        const leadData = {
          name: watchedValues.name,
          whatsapp: watchedValues.whatsapp,
          email: watchedValues.email,
          instagram: watchedValues.instagram,
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
        const finalData = {
          ...data,
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
          <div class="label">Instagram</div>
          <div class="value">${data.instagram}</div>
        </div>
        <div class="row">
          <div class="label">When</div>
          <div class="value">${selectedDate.toLocaleDateString(locale,{weekday:'long',year:'numeric',month:'long',day:'numeric'})} ${new Date(selectedTime).toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit',timeZone:userTimeZone})} (${userTimeZone})</div>
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
    loadAvailableTimeSlots();
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTime(timeSlot);
    setValue('scheduledDateTime', timeSlot);
  };

  const loadAvailableTimeSlots = useCallback(async () => {
    try {
      const response = await fetch(`/api/calendar?date=${selectedDate.toISOString()}&tz=${encodeURIComponent(userTimeZone)}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.availableSlots || []);
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  }, [selectedDate, userTimeZone]);

  useEffect(() => {
    loadAvailableTimeSlots();
  }, [loadAvailableTimeSlots]);

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
        <DialogContent className="max-w-md border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl">
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
            <div className="space-y-3">
              <Button onClick={onClose} className="w-full">
                {t('leadCapture.success.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px] p-0 border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('leadCapture.intro.title')}</DialogTitle>
        </DialogHeader>
        {/* Header with Progress */}
        <div className="p-6 pb-4 border-b border-primary/20">
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
            <span className="text-xs text-muted font-medium">
              {t('leadCapture.form.stepCounter').replace('{current}', String(currentStep + 1)).replace('{total}', String(formSteps.length))}
            </span>
            <span className="text-xs text-primary font-medium">
              {Math.round(progress)}% {t('leadCapture.progress.complete')}
            </span>
          </div>

          {/* Current Step Title */}
          <h2 className="text-lg font-semibold text-center bg-gradient-to-tr from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
            {currentStepData.title}
          </h2>
        </div>

        {/* Form Content */}
        <div className="p-6 pt-4 max-h-[60vh] overflow-y-auto">
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
                  <h3 className="text-xl font-semibold">{t('leadCapture.intro.title')}</h3>
                  <p className="text-muted leading-relaxed text-sm">
                    {t('leadCapture.intro.message')}
                  </p>
                </div>
              )}

              {/* Form Steps */}
              {currentStep > 0 && currentStep < formSteps.length - 1 && (
                <div className="space-y-4">
                  {currentStepData.type === 'text' && (
                    <div className="space-y-2">
                      <input
                        {...register(currentStepData.field!)}
                        type={currentStepData.field === 'whatsapp' ? 'tel' : 'text'}
                        inputMode={currentStepData.field === 'whatsapp' ? 'tel' : undefined}
                        autoComplete={currentStepData.field === 'whatsapp' ? 'tel' : undefined}
                        pattern={currentStepData.field === 'whatsapp' ? "^[0-9() +\\-]*$" : undefined}
                        placeholder={currentStepData.placeholder}
                        className="w-full px-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
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
                        className="w-full px-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
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
                        className="w-full px-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
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
                      <div className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg border-2 border-cardBorder hover:border-primary/30 transition-colors">
                        <Switch
                          id="budget-toggle"
                          checked={watchedValues[currentStepData.field!] === 'yes'}
                          onCheckedChange={(checked) => {
                            const value = checked ? 'yes' : 'no';
                            setValue(currentStepData.field!, value);
                          }}
                        />
                        <label htmlFor="budget-toggle" className="font-medium text-white cursor-pointer">
                          {t('leadCapture.steps.budget.yes')}
                        </label>
                      </div>
                      {watchedValues[currentStepData.field!] === 'no' && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-sm text-yellow-400 text-center">
                            {t('leadCapture.steps.budget.noNotice')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStepData.type === 'number' && watchedValues.budget === 'yes' && (
                    <div className="space-y-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">{locale === 'pt' ? 'R$' : '$'}</span>
                        <input
                          type="number"
                          value={budgetAmount || ''}
                          onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || undefined)}
                          placeholder={t('leadCapture.steps.budgetAmount.placeholder')}
                          className="w-full pl-8 pr-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          min="0"
                          step="100"
                        />
                      </div>
                      <p className="text-sm text-muted">{t('leadCapture.steps.budgetAmount.description')}</p>
                      {budgetAmount && budgetAmount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <Check className="w-4 h-4" />
                          Valid budget amount
                        </div>
                      )}
                      {budgetAmount !== undefined && budgetAmount <= 0 && (
                        <div className="flex items-center gap-2 text-sm text-red-400">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          Please enter a valid amount greater than 0
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Calendar Step */}
              {currentStep === formSteps.length - 1 && (
                <div className="space-y-6">
                  {/* Timezone Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-center">{t('leadCapture.steps.calendar.timezoneLabel')}</label>
                    <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg border border-cardBorder">
                      <MapPin className="w-4 h-4 text-muted" />
                      <select
                        value={userTimeZone}
                        onChange={(e) => setUserTimeZone(e.target.value)}
                        className="flex-1 bg-card/70 text-white border border-primary/40 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-center"
                      >
                        <option value="Europe/Madrid">{t('leadCapture.timezones.europeMadrid')}</option>
                        <option value="America/New_York">{t('leadCapture.timezones.americaNewYork')}</option>
                        <option value="America/Sao_Paulo">{t('leadCapture.timezones.americaSaoPaulo')}</option>
                        <option value="Europe/London">{t('leadCapture.timezones.europeLondon')}</option>
                        <option value="Asia/Tokyo">{t('leadCapture.timezones.asiaTokyo')}</option>
                        <option value="Asia/Dubai">{t('leadCapture.timezones.asiaDubai')}</option>
                        <option value="Asia/Makassar">{t('leadCapture.timezones.asiaBali')}</option>
                        <option value="Australia/Sydney">{t('leadCapture.timezones.australiaSydney')}</option>
                        <option value="UTC">UTC</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-center">{t('leadCapture.steps.calendar.dateSelection')}</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 14 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const isSelected = selectedDate.toDateString() === date.toDateString();
                        const isToday = i === 0;
                        
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleCalendarDateSelect(date)}
                            className={`p-2 rounded-lg border transition-all text-center hover:scale-105 ${
                              isSelected
                                ? 'border-primary bg-primary text-white shadow-lg'
                                : 'border-cardBorder hover:border-primary/50 bg-card/50 hover:bg-card/70'
                            } ${isToday ? 'ring-2 ring-primary/50' : ''}`}
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
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => {
                            const isSelected = slot.iso === selectedTime;
                            
                            return (
                              <button
                                key={slot.iso}
                                type="button"
                                onClick={() => handleTimeSlotSelect(slot.iso)}
                                className={`p-3 rounded-lg border transition-all text-sm hover:scale-105 ${
                                  isSelected
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
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                          <p className="text-muted text-sm">Loading available time slots...</p>
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
        <div className="p-6 pt-4 border-t border-primary/20 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2 border-cardBorder hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('leadCapture.navigation.back')}</span>
            </Button>

            {currentStep === formSteps.length - 1 ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !selectedTime}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>{t('leadCapture.navigation.scheduleCall')}</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span>{t('leadCapture.navigation.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
