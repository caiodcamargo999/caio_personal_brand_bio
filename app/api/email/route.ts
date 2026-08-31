import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { 
  generateConfirmationEmail, 
  generatePreCallEmail, 
  generateFollowUpEmail,
  EmailTemplateData 
} from '@/lib/email-templates';

type EmailPayload = {
  to: string[]; // recipients
  subject: string;
  html: string;
  template?: 'confirmation' | 'preCall' | 'followUp';
  templateData?: EmailTemplateData;
  locale?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, template, templateData, locale = 'en' } = body as EmailPayload;

    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json({ success: false, message: 'Missing recipients' }, { status: 400 });
    }

    let finalSubject = subject;
    let finalHtml = html;

    // If using a template, generate the email content
    if (template && templateData) {
      const data: EmailTemplateData = templateData;
      
      // Simple translation function for templates
      const t = (key: string) => {
        // For now, return English translations directly
        // In production, you'd want to use a proper i18n library
        const translations: any = {
          'leadCapture.emails.confirmation.subject': '🎯 Strategy Call Confirmed - Let\'s Scale Your Business',
          'leadCapture.emails.confirmation.title': 'You\'re Booked! 🚀',
          'leadCapture.emails.confirmation.greeting': `Hi ${data.name},`,
          'leadCapture.emails.confirmation.mainMessage': 'Congratulations! Your Strategy & Consultation call has been confirmed. This is where we\'ll unlock the growth potential of your business through AI, automation, and strategic marketing.',
          'leadCapture.emails.confirmation.callDetails': 'Call Details',
          'leadCapture.emails.confirmation.when': 'When',
          'leadCapture.emails.confirmation.where': 'Where',
          'leadCapture.emails.confirmation.duration': 'Duration',
          'leadCapture.emails.confirmation.timezone': 'Timezone',
          'leadCapture.emails.confirmation.platform': 'Google Meet (link in calendar invite)',
          'leadCapture.emails.confirmation.durationValue': '60 minutes',
          'leadCapture.emails.confirmation.preparation': 'What to Prepare',
          'leadCapture.emails.confirmation.prepItems': [
            'Your main goal for the next 90 days',
            'Top 1-2 bottlenecks holding you back',
            'Current tools and sales process overview',
            'Specific results you want to achieve'
          ],
          'leadCapture.emails.confirmation.valueProposition': 'What You\'ll Get',
          'leadCapture.emails.confirmation.valueItems': [
            'Custom AI & automation strategy for your business',
            'Marketing & sales process optimization plan',
            '90-day roadmap with clear milestones',
            'Implementation priorities and next steps'
          ],
          'leadCapture.emails.confirmation.reminders': 'We\'ll send reminders 24h and 2h before the call. Need to reschedule? Just reply to this email.',
          'leadCapture.emails.confirmation.signature': '— Caio de Camargo',
          'leadCapture.emails.confirmation.tagline': 'Strategic Growth Partner | AI & Automation Expert'
        };
        
        const keys = key.split('.');
        let value: any = translations;
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key; // Fallback to key
          }
        }
        
        return typeof value === 'string' ? value : key;
      };

      // Generate template-based email
      switch (template) {
        case 'confirmation':
          const confirmation = generateConfirmationEmail(data, locale, t);
          finalSubject = confirmation.subject;
          finalHtml = confirmation.html;
          break;
        case 'preCall':
          const preCall = generatePreCallEmail(data, locale, t);
          finalSubject = preCall.subject;
          finalHtml = preCall.html;
          break;
        case 'followUp':
          const followUp = generateFollowUpEmail(data, locale, t);
          finalSubject = followUp.subject;
          finalHtml = followUp.html;
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid template type' },
            { status: 400 }
          );
      }
    }

    // Validate final content
    if (!finalSubject || !finalHtml) {
      return NextResponse.json({ success: false, message: 'Missing subject or html' }, { status: 400 });
    }

    // Configure transporter. Use SMTP creds in env.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.MAIL_FROM || 'no-reply@yourdomain.com';

    const info = await transporter.sendMail({
      from,
      to: to.join(', '),
      subject: finalSubject,
      html: finalHtml,
    });

    return NextResponse.json({ 
      success: true, 
      id: info.messageId,
      template: template || 'custom',
      subject: finalSubject,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}


