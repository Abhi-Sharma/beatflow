const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL=["']?(.*?)["']?$/m);
const keyMatch = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=["']?(.*?)["']?$/m);
const anonMatch = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);

const url = urlMatch ? urlMatch[1].trim() : null;
const key = keyMatch ? keyMatch[1].trim() : (anonMatch ? anonMatch[1].trim() : null);

console.log("Using URL:", url);
console.log("Using Key prefix:", key ? key.substring(0, 10) + "..." : null);

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function run() {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("ERROR CAUGHT:");
    console.error(JSON.stringify(error, null, 2));
    console.error("Error Object Keys:", Object.keys(error));
  } else {
    console.log("Success! Data:", data);
  }
}

run();
