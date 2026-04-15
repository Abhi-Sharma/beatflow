const DEEZER_BASE_URL = 'https://api.deezer.com';

async function testFetch() {
  console.log("Fetching Punjabi Hits...");
  try {
    const res = await fetch(`${DEEZER_BASE_URL}/search?q=Karan%20Aujla&limit=10`);
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Data length:", json.data ? json.data.length : 0);
    if (json.error) {
      console.log("Error Payload:", json.error);
    }
    console.log(JSON.stringify(json).substring(0, 500));
  } catch (e) {
    console.error("Fetch Exception:", e);
  }
}

testFetch();
