import { NextResponse } from 'next/server';
import { searchJamendo } from '@/lib/api/jamendo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ jamendo: [] });
  }

  try {
    const jamendoRes = await searchJamendo(q, 20);

    return NextResponse.json({
      jamendo: jamendoRes.results || []
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
