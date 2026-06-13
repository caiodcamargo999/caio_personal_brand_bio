import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();
    
    if (!phone || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'phone and message required' 
      }, { status: 400 });
    }

    const {
      EVOLUTION_API_URL,
      EVOLUTION_API_KEY,
      EVOLUTION_INSTANCE_NAME
    } = process.env;

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
      console.error('Missing Evolution API credentials in environment variables');
      return NextResponse.json({ 
        success: false, 
        error: 'WhatsApp service is not configured correctly' 
      }, { status: 503 });
    }

    // Format phone number properly for Evolution API
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55') && formattedPhone.length <= 11) {
      formattedPhone = '55' + formattedPhone;
    }

    const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      body: JSON.stringify({
        number: formattedPhone,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        textMessage: {
          text: message
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Evolution API error:', response.status, errorData);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send message via Evolution API' 
      }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('whatsapp send error', e);
    return NextResponse.json({ 
      success: false, 
      error: 'internal server error' 
    }, { status: 500 });
  }
}
