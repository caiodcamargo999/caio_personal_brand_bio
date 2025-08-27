import { NextRequest, NextResponse } from 'next/server';
import { 
  generatePreCallEmail, 
  generateFollowUpEmail,
  EmailTemplateData 
} from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { 
      action, 
      leadData, 
      locale = 'en' 
    } = await request.json();

    if (!leadData || !leadData.email || !leadData.name) {
      return NextResponse.json(
        { error: 'Lead data with email and name is required' },
        { status: 400 }
      );
    }

    let emailData: any;
    let template: string;

    // Simple translation function for templates
    const t = (key: string) => {
      const keys = key.split('.');
      let value: any = {};
      
      // Load translations based on locale
      try {
        if (locale === 'pt') {
          value = require('@/messages/pt.json');
        } else if (locale === 'es') {
          value = require('@/messages/es.json');
        } else {
          value = require('@/messages/en.json');
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        value = require('@/messages/en.json'); // Fallback to English
      }
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Fallback to key
        }
      }
      
      return typeof value === 'string' ? value : key;
    };

    // Prepare email data
    const templateData: EmailTemplateData = {
      name: leadData.name,
      scheduledTime: leadData.scheduledDateTime || new Date().toISOString(),
      userTimeZone: leadData.userTimeZone || 'UTC',
      industry: leadData.industry || '',
      struggle: leadData.struggle || '',
      budget: leadData.budget || '',
      budgetAmount: leadData.budgetAmount,
    };

    switch (action) {
      case 'preCall':
        const preCall = generatePreCallEmail(templateData, locale, t);
        emailData = {
          to: [leadData.email],
          subject: preCall.subject,
          html: preCall.html,
        };
        template = 'preCall';
        break;

      case 'followUp':
        const followUp = generateFollowUpEmail(templateData, locale, t);
        emailData = {
          to: [leadData.email],
          subject: followUp.subject,
          html: followUp.html,
        };
        template = 'followUp';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "preCall" or "followUp"' },
          { status: 400 }
        );
    }

    // Send email using the email API
    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json().catch(() => ({}));
      console.error('Failed to send email sequence:', emailResponse.status, errorData);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    const result = await emailResponse.json();
    
    return NextResponse.json({
      success: true,
      action,
      template,
      emailId: result.id,
      subject: emailData.subject,
    });

  } catch (error) {
    console.error('Email sequence error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
