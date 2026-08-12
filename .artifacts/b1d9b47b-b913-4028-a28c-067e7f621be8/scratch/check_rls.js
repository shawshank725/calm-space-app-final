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

async function check() {
  // Querying pg_tables to check RLS status is only possible with a service role key or as owner.
  // Since we only have the anon key, we'll try to insert a row into profiles without a session.
  console.log('--- Testing RLS Enforcement (Anon User) ---');

  // 1. Try to read private messages (should be denied)
  const { data: msgData, error: msgError } = await supabase.from('messages').select('*');
  console.log('Messages Read Access:', msgError ? 'DENIED (' + msgError.message + ')' : 'ALLOWED (VULNERABLE - found ' + msgData.length + ' rows)');

  // 2. Try to read full profiles (should be restricted)
  const { data: profData, error: profError } = await supabase.from('profiles').select('*');
  console.log('Profiles Read Access:', profError ? 'DENIED (' + profError.message + ')' : 'ALLOWED (VULNERABLE - found ' + profData.length + ' rows)');

  // 3. Try to update a profile (should be denied)
  const { error: updateError } = await supabase.from('profiles').update({ name: 'Hacked' }).eq('id', 'any-id');
  console.log('Profiles Update Access:', updateError ? 'DENIED (' + updateError.message + ')' : 'ALLOWED (CRITICAL VULNERABILITY)');
}

check();
