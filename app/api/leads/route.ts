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

    const auth = await getGoogleAuth();
    const sheets = new GoogleSheetsService(auth);

    // Upsert by email: if email exists, update; else append
    if (body.email) {
      try {
        await sheets.updateLeadData(0, body);
      } catch (e: any) {
        // If the update failed because the user isn't found, append instead
        await sheets.appendLeadData(body);
      }
    } else {
      await sheets.appendLeadData(body);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error writing lead to Sheets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to write to Google Sheets' },
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
