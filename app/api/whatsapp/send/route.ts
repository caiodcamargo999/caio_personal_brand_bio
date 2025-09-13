import { NextRequest, NextResponse } from 'next/server';

// Import the WhatsApp service
let whatsappService: any = null;

// Dynamic import to avoid issues in Next.js
async function getWhatsAppService() {
  if (!whatsappService) {
    try {
      const { whatsappService: service } = await import('@/whatsapp-service');
      whatsappService = service;
    } catch (error) {
      console.error('Failed to import WhatsApp service:', error);
      return null;
    }
  }
  return whatsappService;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();
    
    if (!phone || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'phone and message required' 
      }, { status: 400 });
    }

    const service = await getWhatsAppService();
    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: 'WhatsApp service not available' 
      }, { status: 503 });
    }
    
    if (!service.isReady()) {
      return NextResponse.json({ 
        success: false, 
        error: 'WhatsApp not connected' 
      }, { status: 503 });
    }

    const success = await service.sendMessage(phone, message);
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send message' 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('whatsapp send error', e);
    return NextResponse.json({ 
      success: false, 
      error: 'internal' 
    }, { status: 500 });
  }
}

