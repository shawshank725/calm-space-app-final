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

async function getEnums() {
  // Query to get enum values
  const { data, error } = await supabase.rpc('get_enum_values', { type_name: 'notification_receiver_type' });

  if (error) {
    // If RPC doesn't exist, try to guess by fetching one notification
    console.log('RPC failed, trying to fetch a notification to see structure...');
    const { data: notes, error: fetchError } = await supabase.from('notifications').select('receiver_type').limit(1);
    if (fetchError) {
      console.log('Fetch failed:', fetchError.message);
    } else {
      console.log('Sample notification:', notes);
    }
  } else {
    console.log('Enum values:', data);
  }
}

getEnums();
