const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = 'C:/Users/LENOVO/Documents/GitHub/calm-space-app-final/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('--- DEEP DATABASE VERIFICATION ---');

  const tables = ['profiles', 'messages', 'student_locations', 'community_post', 'post_comment', 'book_request', 'library'];

  for (const table of tables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(5);
    if (error) {
      console.log(`Table [${table}]: DENIED (${error.message})`);
    } else {
      console.log(`Table [${table}]: ALLOWED (${data.length} rows, total count: ${count})`);
    }
  }

  // Test RPC uniqueness checks (should only return boolean)
  const { data: userExists } = await supabase.rpc('check_username_exists', { username_to_check: 'admin' });
  console.log('RPC check_username_exists(admin):', userExists);

  console.log('--- VERIFICATION COMPLETE ---');
}

verify();
