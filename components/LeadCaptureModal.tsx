"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadFormSchema, LeadFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
    
    // Special validation for budget amount step
    if (currentStep === 8 && watchedValues.budget === 'yes') {
      if (!budgetAmount || budgetAmount <= 0) {
        return; // Don't proceed if no valid budget amount
      }
    }
    
    // Regular field validation
    if (currentField) {
      const isValid = await trigger(currentField);
      if (!isValid) {
        return;
      }
    }
    
    // Skip budget amount step if budget is "no"
    if (currentStep === 7 && watchedValues.budget === 'no') {
      setCurrentStep(currentStep + 2); // Skip directly to calendar step
    } else if (currentStep < formSteps.length - 1) {
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
          setIsSuccess(true);
          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData),
          });
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
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] border-primary/30 bg-gradient-to-tr from-primary/10 via-black/90 to-primary/5 text-white backdrop-blur-2xl flex flex-col mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{t('leadCapture.intro.title')}</DialogTitle>
        </DialogHeader>
        {/* Progress Bar */}
        <div className="w-full bg-card/20 rounded-full h-2 mb-4 sm:mb-6">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Counter */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm text-muted">
            {t('leadCapture.form.stepCounter').replace('{current}', String(currentStep + 1)).replace('{total}', String(formSteps.length))}
          </span>
        </div>

        {/* Form Content - Make scrollable */}
        <div className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto pr-1 sm:pr-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Intro Step */}
              {currentStep === 0 && (
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold">{t('leadCapture.intro.title')}</h2>
                  <p className="text-muted leading-relaxed">
                    {t('leadCapture.intro.message')}
                  </p>
                </div>
              )}

              {/* Form Steps */}
              {currentStep > 0 && currentStep < formSteps.length - 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
                  
                  {currentStepData.type === 'text' && (
                    <input
                      {...register(currentStepData.field!)}
                      type={currentStepData.field === 'whatsapp' ? 'tel' : 'text'}
                      inputMode={currentStepData.field === 'whatsapp' ? 'tel' : undefined}
                      autoComplete={currentStepData.field === 'whatsapp' ? 'tel' : undefined}
                      pattern={currentStepData.field === 'whatsapp' ? "^[+0-9()\\-\\s]*$" : undefined}
                      placeholder={currentStepData.placeholder}
                      className="w-full px-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
                      
                    />
                  )}

                  {currentStepData.type === 'email' && (
                    <input
                      {...register(currentStepData.field!)}
                      type="email"
                      placeholder={currentStepData.placeholder}
                      className="w-full px-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors"
                      
                    />
                  )}

                  {currentStepData.type === 'textarea' && (
                    <textarea
                      {...register(currentStepData.field!)}
                      placeholder={currentStepData.placeholder}
                      rows={4}
                      className="w-full px-4 py-3 bg-card/50 border border-cardBorder rounded-lg text-white placeholder-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      
                    />
                  )}

                  {currentStepData.type === 'select' && (
                    <div className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg border-2 border-cardBorder">
                      <Switch
                        id="budget-toggle"
                        checked={watchedValues[currentStepData.field!] === 'yes'}
                        onCheckedChange={(checked) => {
                          const value = checked ? 'yes' : 'no';
                          setValue(currentStepData.field!, value);
                        }}
                      />
                      <label htmlFor="budget-toggle" className="font-medium text-white">
                        {t('leadCapture.steps.budget.yes')}
                      </label>
                    </div>
                  )}

                  {currentStepData.type === 'number' && watchedValues.budget === 'yes' && (
                    <div className="space-y-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={budgetAmount || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setBudgetAmount(undefined);
                          } else {
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue) && numValue > 0) {
                              setBudgetAmount(numValue);
                            }
                          }
                        }}
                        placeholder={currentStepData.placeholder}
                        className={`w-full px-4 py-3 bg-card/50 border rounded-lg text-white placeholder-muted focus:outline-none transition-colors ${
                          budgetAmount && budgetAmount > 0 
                            ? 'border-green-500 focus:border-green-400' 
                            : 'border-cardBorder focus:border-primary/50'
                        }`}
                      />
                      <p className="text-sm text-muted">{t('leadCapture.steps.budgetAmount.description')}</p>
                      {budgetAmount && budgetAmount > 0 && (
                        <p className="text-sm text-green-400">✓ Valid budget amount</p>
                      )}
                      {budgetAmount !== undefined && budgetAmount <= 0 && (
                        <p className="text-sm text-red-400">Please enter a valid amount greater than 0</p>
                      )}
                    </div>
                  )}

                  {/* Error Display */}
                  {errors[currentStepData.field as keyof LeadFormData] && (
                    <p className="text-red-400 text-sm">
                      {errors[currentStepData.field as keyof LeadFormData]?.message}
                    </p>
                  )}
                </div>
              )}

              {/* Calendar Step */}
              {currentStep === formSteps.length - 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">{t('leadCapture.steps.calendar.title')}</h2>
                  
                  {/* Timezone Selection - Mobile Optimized */}
                  <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
                    <label className="block text-sm font-medium text-center sm:text-left">{t('leadCapture.steps.calendar.timezoneLabel')}</label>
                    <select
                      value={userTimeZone}
                      onChange={(e) => setUserTimeZone(e.target.value)}
                      className="w-full sm:w-auto px-3 py-2 bg-card/50 border border-cardBorder rounded-md text-white focus:outline-none focus:border-primary/50 transition-colors text-center sm:text-left"
                    >
                      <option value="Europe/Madrid">{t('leadCapture.timezones.europeMadrid')}</option>
                      <option value="America/New_York">{t('leadCapture.timezones.americaNewYork')}</option>
                      <option value="America/Sao_Paulo">{t('leadCapture.timezones.americaSaoPaulo')}</option>
                      <option value="Europe/London">{t('leadCapture.timezones.europeLondon')}</option>
                      <option value="Asia/Tokyo">{t('leadCapture.timezones.asiaTokyo')}</option>
                      <option value="Australia/Sydney">{t('leadCapture.timezones.australiaSydney')}</option>
                    </select>
                  </div>

                  {/* Date Selection - Mobile Optimized */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-medium text-center sm:text-left">{t('leadCapture.steps.calendar.dateSelection')}</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2">
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
                            className={`p-2 sm:p-3 rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'border-primary bg-primary/20 text-white'
                                : 'border-cardBorder hover:border-primary/50 bg-card/50'
                            } ${isToday ? 'ring-2 ring-primary/50' : ''}`}
                          >
                            <div className="text-xs font-medium">
                              {date.toLocaleDateString(locale, { weekday: 'short' })}
                            </div>
                            <div className="text-base sm:text-lg font-bold">
                              {date.getDate()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots - Mobile Optimized */}
                  {selectedDate && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-medium text-center sm:text-left">{t('leadCapture.steps.calendar.timeSlots')}</h3>
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {availableSlots.map((slot) => {
                            const isSelected = slot.iso === selectedTime;
                            
                            return (
                              <button
                                key={slot.iso}
                                type="button"
                                onClick={() => handleTimeSlotSelect(slot.iso)}
                                className={`p-3 sm:p-4 rounded-lg border transition-all text-sm sm:text-base ${
                                  isSelected
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-cardBorder hover:border-primary/50 bg-card/50'
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
                          <p className="text-muted text-sm sm:text-base">Loading available time slots...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selection Status - Mobile Optimized */}
                  {selectedDate && selectedTime && (
                    <div className="p-3 sm:p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-xs sm:text-sm text-center">
                        <span className="font-medium">Selected:</span> {selectedDate.toLocaleDateString(locale, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {new Date(selectedTime).toLocaleTimeString(locale, { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZone: userTimeZone 
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 mt-6 border-t border-cardBorder/30">
            <Button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('leadCapture.navigation.back')}</span>
            </Button>

            {currentStep === formSteps.length - 1 ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !selectedTime}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                title={`isSubmitting: ${isSubmitting}, selectedTime: ${selectedTime || 'none'}`}
              >
                <span>{t('leadCapture.navigation.scheduleCall')}</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
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
