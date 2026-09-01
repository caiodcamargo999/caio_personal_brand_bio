import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth, GoogleSheetsService } from '@/lib/google-services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Strict validation - ensure we have name and contact info
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : '';

    if (!name || (!email && !whatsapp)) {
      console.warn('⚠️ Rejected invalid lead submission: missing name or contact info', { name, email, whatsapp });
      return NextResponse.json(
        { success: false, message: 'Lead name and at least one contact method (email or WhatsApp) are required' },
        { status: 400 }
      );
    }

    const sanitizedBody = {
      ...body,
      name,
      email,
      whatsapp,
    };

    // Google Sheets Integration (Non-blocking)
    try {
      const auth = await getGoogleAuth();
      const sheets = new GoogleSheetsService(auth);
      await sheets.appendLeadData(sanitizedBody);
    } catch (sheetsError: any) {
      console.error('❌ Failed to append to Google Sheets:', sheetsError.message);
      if (sheetsError.response?.data) {
        console.error('❌ Google Sheets API Error Details:', JSON.stringify(sheetsError.response.data, null, 2));
      }
      // We continue to Trello even if Sheets fails
    }

    // Trello Integration
    try {
      const { industry, struggle, budget, budgetAmount, source, bookingDetails } = sanitizedBody;

      const description = `
**📋 DETALHES DO LEAD**

**Nome:** ${name}
${email ? `**Email:** ${email}\n` : ''}**WhatsApp:** ${whatsapp}
${industry ? `**Indústria:** ${industry}\n` : ''}**Dificuldade:** ${struggle || 'Não informado'}
**Orçamento:** ${budget || 'Não informado'}
${budgetAmount ? `**Valor do Orçamento:** ${budgetAmount} USD\n` : ''}
_____________________
**ℹ️ OUTRAS INFOS**
**Status:** ${bookingDetails ? '✅ BOOKING CONFIRMED' : '📝 LEAD CAPTURED (FORM ONLY)'}
${source ? `**Origem:** ${source}\n` : ''}${bookingDetails ? `**Data do Booking:** ${bookingDetails.date || bookingDetails.startTime || 'Confirmado'}` : ''}
      `.trim();

      // "NOME DO CARD: NOME DA LEAD"
      const cardTitle = name;

      console.log('Attempting Trello card sync for:', cardTitle);

      if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN || !process.env.TRELLO_LIST_ID) {
        console.error('Missing Trello credentials in environment variables');
      } else {
        // Check if card already exists
        const checkParams = new URLSearchParams({
          key: process.env.TRELLO_API_KEY!,
          token: process.env.TRELLO_API_TOKEN!,
        });
        const checkUrl = `https://api.trello.com/1/lists/${process.env.TRELLO_LIST_ID}/cards?${checkParams.toString()}`;

        let existingCardId: string | null = null;

        try {
          const checkRes = await fetch(checkUrl, { method: 'GET' });
          if (checkRes.ok) {
            const cards = await checkRes.json();
            const normalizeDigits = (str: string) => str?.replace(/\D/g, '') || '';
            const targetEmail = email.toLowerCase();
            const targetDigits = normalizeDigits(whatsapp);
            const targetTitle = name.toLowerCase();

            // Match by name, or by email in description, or by phone in description
            const foundCard = cards.find((c: any) => {
              const cName = (c.name || '').toLowerCase().trim();
              const cDesc = (c.desc || '').toLowerCase();

              if (cName && cName === targetTitle) return true;
              if (targetEmail && cDesc.includes(targetEmail)) return true;
              if (targetDigits && targetDigits.length >= 8) {
                const descDigits = normalizeDigits(cDesc);
                if (descDigits.includes(targetDigits)) return true;
              }
              return false;
            });

            if (foundCard) {
              existingCardId = foundCard.id;
              console.log(`Card "${foundCard.name}" already exists in Trello (ID: ${existingCardId}). Updating description...`);
            }
          }
        } catch (checkErr) {
          console.error("Error checking existing Trello cards:", checkErr);
        }

        const trelloParams = new URLSearchParams({
          key: process.env.TRELLO_API_KEY!,
          token: process.env.TRELLO_API_TOKEN!,
        });

        if (existingCardId) {
          // Update existing card
          trelloParams.append('name', cardTitle);
          trelloParams.append('desc', description);
          const updateUrl = `https://api.trello.com/1/cards/${existingCardId}?${trelloParams.toString()}`;

          const updateRes = await fetch(updateUrl, { method: 'PUT' });
          if (!updateRes.ok) {
            console.error('Failed to update Trello card:', await updateRes.text());
          } else {
            console.log('Trello card updated successfully!');
          }
        } else {
          // Create new card
          trelloParams.append('idList', process.env.TRELLO_LIST_ID!);
          trelloParams.append('name', cardTitle);
          trelloParams.append('desc', description);

          const createUrl = `https://api.trello.com/1/cards?${trelloParams.toString()}`;
          const createRes = await fetch(createUrl, { method: 'POST' });

          if (!createRes.ok) {
            const errorText = await createRes.text();
            console.error('Failed to create Trello card. Status:', createRes.status, 'Response:', errorText);
          } else {
            console.log('Trello card created successfully!');
          }
        }
      }
    } catch (trelloError) {
      console.error('Trello integration error:', trelloError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in leads API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Simple validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!body.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required for updates' },
        { status: 400 }
      );
    }

    const auth = await getGoogleAuth();
    const sheets = new GoogleSheetsService(auth);
    await sheets.updateLeadData(0, body);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating lead in Sheets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update Google Sheets' },
      { status: 500 }
    );
  }
}
