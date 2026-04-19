import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { access_token } = await getAccessToken();
    if (!access_token) {
      return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
    }
    // We optionally return the token if client needs it directly,
    // but typically we should proxy requests rather than expose it.
    // Given the task says "Server fetches Spotify access token using client credentials flow. Frontend never sees client secret",
    // Returning just an OK or proxying specific data is better.
    return NextResponse.json({ status: 'ok', message: 'Token retrieved successfully' });
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
