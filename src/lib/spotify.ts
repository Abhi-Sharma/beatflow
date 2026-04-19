const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

export const getAccessToken = async () => {
  if (!client_id || !client_secret) {
    console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET map to a real application.");
    return { access_token: '' };
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    next: {
      revalidate: 3600, // Spotify tokens expire in 1 hour
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch Spotify access token", await response.text());
    return { access_token: '' };
  }

  return response.json();
};

export const spotifyFetch = async (endpoint: string) => {
  const { access_token } = await getAccessToken();
  if (!access_token) return null;

  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 3600, // cache for 1 hour for mostly static discovery endpoints
    }
  });

  if (!res.ok) {
    console.error(`Spotify API error on ${endpoint}`, await res.text());
    return null;
  }

  return res.json();
};
