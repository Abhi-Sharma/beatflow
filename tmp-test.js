const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log("Anon passed?:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log("ERROR IS:", error);
    console.log("ERROR STR:", JSON.stringify(error));
  } else {
    console.log("DATA IS:", data);
  }
}

test().catch(console.error);
