import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth, GoogleSheetsService } from '@/lib/google-services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Simple validation - ensure we have at least some data
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Google Sheets Integration (Non-blocking)
    try {
      const auth = await getGoogleAuth();
      const sheets = new GoogleSheetsService(auth);
      await sheets.appendLeadData(body);
    } catch (sheetsError) {
      console.error('Failed to append to Google Sheets:', sheetsError);
      // We continue to Trello even if Sheets fails
    }

    // Trello Integration
    try {
      const { name, email, whatsapp, instagram, industry, struggle, budget, budgetAmount, source, bookingDetails } = body;

      const description = `
**📋 DETALHES DO LEAD**

**Nome:** ${name}
${email ? `**Email:** ${email}` : ''}
**WhatsApp:** ${whatsapp}
**Instagram:** ${instagram}
**Indústria:** ${industry}
**Dificuldade:** ${struggle}
**Orçamento:** ${budget}
${budgetAmount ? `**Valor do Orçamento:** ${budgetAmount}` : ''}

_____________________
**ℹ️ OUTRAS INFOS**
**Status:** ${bookingDetails ? '✅ BOOKING CONFIRMED' : '📝 LEAD CAPTURED (FORM ONLY)'}
${source ? `**Origem:** ${source}` : ''}
${bookingDetails ? `**Data do Booking:** ${bookingDetails.date}` : ''}
      `.trim();

      // "NOME DO CARD: NOME DA LEAD"
      const cardTitle = name;

      console.log('Attempting Trello card creation...');

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
            // Check if any card has the same name
            const foundCard = cards.find((c: any) => c.name.toLowerCase() === cardTitle.toLowerCase());
            if (foundCard) {
              existingCardId = foundCard.id;
              console.log(`Card "${cardTitle}" already exists (ID: ${existingCardId}). Updating description instead of creating new.`);
            }
          }
        } catch (checkErr) {
          console.error("Error checking existing cards:", checkErr);
        }

        const trelloParams = new URLSearchParams({
          key: process.env.TRELLO_API_KEY!,
          token: process.env.TRELLO_API_TOKEN!,
        });

        if (existingCardId) {
          // Update existing card
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
    // This catch block handles catastrophic failures outside the specific integrations
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
