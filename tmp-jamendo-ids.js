const CLIENT_ID = '404b8ba1';

async function getIds(tag) {
  const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=15&tags=${tag}&boost=popularity_total`);
  const data = await res.json();
  return data.results ? data.results.map(t => t.id) : [];
}

async function run() {
  console.log("reels:", await getIds('pop,upbeat'));
  console.log("lofi:", await getIds('lofi'));
  console.log("gaming:", await getIds('gaming'));
  console.log("travel:", await getIds('acoustic'));
  console.log("study:", await getIds('chill'));
  console.log("workout:", await getIds('workout'));
}
run();
