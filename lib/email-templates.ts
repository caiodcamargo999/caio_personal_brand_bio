import { LeadFormData } from './types';

export interface EmailTemplateData {
  name: string;
  scheduledTime: string;
  userTimeZone: string;
  industry: string;
  struggle: string;
  budget: string;
  budgetAmount?: number;
}

export function generateConfirmationEmail(
  data: EmailTemplateData,
  locale: string,
  t: (key: string) => string
): { subject: string; html: string } {
  const subject = t('leadCapture.emails.confirmation.subject');
  
  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('leadCapture.emails.confirmation.title')}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { font-size: 28px; font-weight: bold; margin: 0 0 20px 0; }
        .greeting { font-size: 18px; margin: 20px 0; }
        .main-message { font-size: 16px; margin: 20px 0; line-height: 1.8; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #8b5cf6; margin-bottom: 15px; border-bottom: 2px solid #8b5cf6; padding-bottom: 5px; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; width: 120px; color: #666; }
        .detail-value { flex: 1; }
        .list { margin: 15px 0; }
        .list-item { margin: 8px 0; padding-left: 20px; position: relative; }
        .list-item:before { content: "✓"; color: #8b5cf6; font-weight: bold; position: absolute; left: 0; }
        .reminders { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
        .signature { margin: 30px 0; text-align: center; }
        .signature-name { font-size: 18px; font-weight: bold; color: #8b5cf6; }
        .tagline { font-size: 14px; color: #666; font-style: italic; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">${t('leadCapture.emails.confirmation.title')}</div>
        </div>
        
        <div class="content">
          <div class="greeting">${t('leadCapture.emails.confirmation.greeting').replace('{name}', data.name)}</div>
          
          <div class="main-message">${t('leadCapture.emails.confirmation.mainMessage')}</div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.confirmation.callDetails')}</div>
            <div class="detail-row">
              <div class="detail-label">${t('leadCapture.emails.confirmation.when')}:</div>
              <div class="detail-value">${new Date(data.scheduledTime).toLocaleString(locale, { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: data.userTimeZone 
              })} (${data.userTimeZone})</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">${t('leadCapture.emails.confirmation.where')}:</div>
              <div class="detail-value">${t('leadCapture.emails.confirmation.platform')}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">${t('leadCapture.emails.confirmation.duration')}:</div>
              <div class="detail-value">${t('leadCapture.emails.confirmation.durationValue')}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.confirmation.preparation')}</div>
            <div class="list">
              ${(() => {
                try {
                  const prepItems = JSON.parse(t('leadCapture.emails.confirmation.prepItems'));
                  if (Array.isArray(prepItems)) {
                    return prepItems.map((item: string) => 
                      `<div class="list-item">${item}</div>`
                    ).join('');
                  }
                  return `<div class="list-item">${t('leadCapture.emails.confirmation.prepItems')}</div>`;
                } catch {
                  return `<div class="list-item">${t('leadCapture.emails.confirmation.prepItems')}</div>`;
                }
              })()}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.confirmation.valueProposition')}</div>
            <div class="list">
              ${(() => {
                try {
                  const valueItems = JSON.parse(t('leadCapture.emails.confirmation.valueItems'));
                  if (Array.isArray(valueItems)) {
                    return valueItems.map((item: string) => 
                      `<div class="list-item">${item}</div>`
                    ).join('');
                  }
                  return `<div class="list-item">${t('leadCapture.emails.confirmation.valueItems')}</div>`;
                } catch {
                  return `<div class="list-item">${t('leadCapture.emails.confirmation.valueItems')}</div>`;
                }
              })()}
            </div>
          </div>
          
          <div class="reminders">
            <strong>📅 ${t('leadCapture.emails.confirmation.reminders')}</strong>
          </div>
          
          <div class="signature">
            <div class="signature-name">${t('leadCapture.emails.confirmation.signature')}</div>
            <div class="tagline">${t('leadCapture.emails.confirmation.tagline')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent from your lead capture system</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generatePreCallEmail(
  data: EmailTemplateData,
  locale: string,
  t: (key: string) => string
): { subject: string; html: string } {
  const subject = t('leadCapture.emails.preCall.subject');
  
  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('leadCapture.emails.preCall.title')}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { font-size: 28px; font-weight: bold; margin: 0 0 20px 0; }
        .greeting { font-size: 18px; margin: 20px 0; }
        .main-message { font-size: 16px; margin: 20px 0; line-height: 1.8; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #8b5cf6; margin-bottom: 15px; border-bottom: 2px solid #8b5cf6; padding-bottom: 5px; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; width: 120px; color: #666; }
        .detail-value { flex: 1; }
        .list { margin: 15px 0; }
        .list-item { margin: 8px 0; padding-left: 20px; position: relative; }
        .list-item:before { content: "✓"; color: #8b5cf6; font-weight: bold; position: absolute; left: 0; }
        .signature { margin: 30px 0; text-align: center; }
        .signature-name { font-size: 18px; font-weight: bold; color: #8b5cf6; }
        .tagline { font-size: 14px; color: #666; font-style: italic; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">${t('leadCapture.emails.preCall.title')}</div>
        </div>
        
        <div class="content">
          <div class="greeting">${t('leadCapture.emails.preCall.greeting').replace('{name}', data.name)}</div>
          
          <div class="main-message">${t('leadCapture.emails.preCall.mainMessage')}</div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.preCall.callReminder')}</div>
            <div class="detail-row">
              <div class="detail-label">${t('leadCapture.emails.preCall.when')}:</div>
              <div class="detail-value">${new Date(data.scheduledTime).toLocaleString(locale, { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: data.userTimeZone 
              })} (${data.userTimeZone})</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">${t('leadCapture.emails.preCall.where')}:</div>
              <div class="detail-value">Google Meet (link in calendar invite)</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.preCall.preparation')}</div>
            <p>${t('leadCapture.emails.preCall.prepMessage')}</p>
            <div class="list">
              ${(() => {
                try {
                  const prepItems = JSON.parse(t('leadCapture.emails.preCall.prepItems'));
                  if (Array.isArray(prepItems)) {
                    return prepItems.map((item: string) => 
                      `<div class="list-item">${item}</div>`
                    ).join('');
                  }
                  return `<div class="list-item">${t('leadCapture.emails.preCall.prepItems')}</div>`;
                } catch {
                  return `<div class="list-item">${t('leadCapture.emails.preCall.prepItems')}</div>`;
                }
              })()}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.preCall.whatToExpect')}</div>
            <div class="list">
              ${(() => {
                try {
                  const expectItems = JSON.parse(t('leadCapture.emails.preCall.expectItems'));
                  if (Array.isArray(expectItems)) {
                    return expectItems.map((item: string) => 
                      `<div class="list-item">${item}</div>`
                    ).join('');
                  }
                  return `<div class="list-item">${t('leadCapture.emails.preCall.expectItems')}</div>`;
                } catch {
                  return `<div class="list-item">${t('leadCapture.emails.preCall.expectItems')}</div>`;
                }
              })()}
            </div>
          </div>
          
          <div class="signature">
            <div class="signature-name">${t('leadCapture.emails.preCall.signature')}</div>
            <div class="tagline">${t('leadCapture.emails.preCall.tagline')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent from your lead capture system</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateFollowUpEmail(
  data: EmailTemplateData,
  locale: string,
  t: (key: string) => string
): { subject: string; html: string } {
  const subject = t('leadCapture.emails.followUp.subject');
  
  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('leadCapture.emails.followUp.title')}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { font-size: 28px; font-weight: bold; margin: 0 0 20px 0; }
        .greeting { font-size: 18px; margin: 20px 0; }
        .main-message { font-size: 16px; margin: 20px 0; line-height: 1.8; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #8b5cf6; margin-bottom: 15px; border-bottom: 2px solid #8b5cf6; padding-bottom: 5px; }
        .list { margin: 15px 0; }
        .list-item { margin: 8px 0; padding-left: 20px; position: relative; }
        .list-item:before { content: "✓"; color: #8b5cf6; font-weight: bold; position: absolute; left: 0; }
        .cta { background: #8b5cf6; color: white; padding: 15px 25px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .cta a { color: white; text-decoration: none; font-weight: bold; }
        .signature { margin: 30px 0; text-align: center; }
        .signature-name { font-size: 18px; font-weight: bold; color: #8b5cf6; }
        .tagline { font-size: 14px; color: #666; font-style: italic; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">${t('leadCapture.emails.followUp.title')}</div>
        </div>
        
        <div class="content">
          <div class="greeting">${t('leadCapture.emails.followUp.greeting').replace('{name}', data.name)}</div>
          
          <div class="main-message">${t('leadCapture.emails.followUp.mainMessage')}</div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.followUp.nextSteps')}</div>
            <div class="list">
              <div class="list-item">${t('leadCapture.emails.followUp.step1')}</div>
              <div class="list-item">${t('leadCapture.emails.followUp.step2')}</div>
              <div class="list-item">${t('leadCapture.emails.followUp.step3')}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">${t('leadCapture.emails.followUp.resources')}</div>
            <div class="list">
              ${(() => {
                try {
                  const resourceItems = JSON.parse(t('leadCapture.emails.followUp.resourceItems'));
                  if (Array.isArray(resourceItems)) {
                    return resourceItems.map((item: string) => 
                      `<div class="list-item">${item}</div>`
                    ).join('');
                  }
                  return `<div class="list-item">${t('leadCapture.emails.followUp.resourceItems')}</div>`;
                } catch {
                  return `<div class="list-item">${t('leadCapture.emails.followUp.resourceItems')}</div>`;
                }
              })()}
            </div>
          </div>
          
          <div class="cta">
            <a href="mailto:caiorarity@gmail.com">${t('leadCapture.emails.followUp.support')}</a>
          </div>
          
          <div class="signature">
            <div class="signature-name">${t('leadCapture.emails.followUp.signature')}</div>
            <div class="tagline">${t('leadCapture.emails.followUp.tagline')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent from your lead capture system</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}
