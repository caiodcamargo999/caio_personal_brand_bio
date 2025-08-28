import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
  const redirectUrl = process.env.GOOGLE_OAUTH_REDIRECT_URL!;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const oAuth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
  const { tokens } = await oAuth2.getToken(code);

  return NextResponse.json({
    success: true,
    message: 'Copy this refresh token into .env and restart the server',
    tokens
  });
}


