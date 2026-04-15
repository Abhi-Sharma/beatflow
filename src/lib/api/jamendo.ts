const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '404b8ba1';

export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
}

export interface JamendoSearchResponse {
  results: JamendoTrack[];
  headers: {
    results_count: number;
  };
}

export async function searchJamendo(
  query: string,
  limit: number = 20,
  offset: number = 0,
  tags?: string[]
): Promise<JamendoSearchResponse> {
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    limit: limit.toString(),
    offset: offset.toString(),
    include: 'musicinfo',
  });

  if (query) queryParams.append('search', query);
  if (tags && tags.length > 0) queryParams.append('tags', tags.join(','));

  try {
    const res = await fetch(`${JAMENDO_BASE_URL}/tracks/?${queryParams.toString()}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch from Jamendo');
    return await res.json();
  } catch (error) {
    console.error('Jamendo API error:', error);
    return { results: [], headers: { results_count: 0 } };
  }
}

export async function getJamendoCategory(tags: string = 'lofi', limit: number = 20): Promise<JamendoSearchResponse> {
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    limit: limit.toString(),
    tags: tags,
    boost: 'popularity_total',
    include: 'musicinfo'
  });

  try {
    const res = await fetch(`${JAMENDO_BASE_URL}/tracks/?${queryParams.toString()}`, {
      next: { revalidate: 3600 * 12 } // cache for 12 hours
    });
    
    if (!res.ok) throw new Error('Failed to fetch category from Jamendo');
    return await res.json();
  } catch (error) {
    console.error('Jamendo category API error:', error);
    return { results: [], headers: { results_count: 0 } };
  }
}

export async function getJamendoTrending(limit: number = 20): Promise<JamendoSearchResponse> {
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    limit: limit.toString(),
    boost: 'popularity_total',
    include: 'musicinfo' // missing tags to get absolutely everything popular
  });

  try {
    const res = await fetch(`${JAMENDO_BASE_URL}/tracks/?${queryParams.toString()}`, {
      next: { revalidate: 3600 * 12 } 
    });
    
    if (!res.ok) throw new Error('Failed to fetch trending from Jamendo');
    return await res.json();
  } catch (error) {
    console.error('Jamendo trending API error:', error);
    return { results: [], headers: { results_count: 0 } };
  }
}

export async function getJamendoTrack(id: string): Promise<JamendoTrack | null> {
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    id: id,
    include: 'musicinfo'
  });

  try {
    const res = await fetch(`${JAMENDO_BASE_URL}/tracks/?${queryParams.toString()}`, {
      next: { revalidate: 3600 * 24 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch track from Jamendo');
    const json = await res.json();
    return json.results?.[0] || null;
  } catch (error) {
    console.error(`Jamendo getTrack API error:`, error);
    return null;
  }
}

