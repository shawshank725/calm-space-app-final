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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('--- LIVE DATABASE VERIFICATION ---');

  // 1. Check if public_profiles view exists
  const { data: viewData, error: viewError } = await supabase
    .from('public_profiles')
    .select('*')
    .limit(1);

  if (viewError) {
    console.log('public_profiles view check: FAILED');
    console.log('Error:', viewError.message);
  } else {
    console.log('public_profiles view check: SUCCESS');
  }

  // 2. Attempt User Enumeration
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('registration_number');

  if (profError) {
    console.log('ENUMERATION ATTACK (Profiles): DENIED - ' + profError.message);
  } else if (profiles && profiles.length > 0) {
    console.log(`ENUMERATION ATTACK (Profiles): SUCCESS (VULNERABLE). Found ${profiles.length} profiles.`);
  } else {
    console.log('ENUMERATION ATTACK (Profiles): No data returned');
  }

  // 3. Attempt Message Leak
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*');

  if (msgError) {
    console.log('MESSAGE LEAK ATTACK: DENIED - ' + msgError.message);
  } else if (messages && messages.length > 0) {
    console.log(`MESSAGE LEAK ATTACK: SUCCESS (VULNERABLE). Found ${messages.length} messages.`);
  } else {
    console.log('MESSAGE LEAK ATTACK: No data returned');
  }

  // 4. Check RPC existence
  const { data: rpcData, error: rpcError } = await supabase.rpc('check_username_exists', { username_to_check: 'admin' });
  if (rpcError && rpcError.message.includes('does not exist')) {
    console.log('check_username_exists RPC: NOT FOUND');
  } else {
    console.log('check_username_exists RPC: FOUND');
  }

  console.log('--- VERIFICATION COMPLETE ---');
}

verify();
