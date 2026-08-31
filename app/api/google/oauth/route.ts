import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.email'
];

export async function GET() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUrl = process.env.GOOGLE_OAUTH_REDIRECT_URL;

  if (!clientId || !clientSecret || !redirectUrl) {
    return NextResponse.json({ error: 'OAuth env vars not set' }, { status: 500 });
  }

  const oAuth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
  const url = oAuth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  return NextResponse.redirect(url);
}


