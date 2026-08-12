import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get current user
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { userIds, title, body, data } = await req.json()

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing userIds' }), { status: 400 })
    }

    // 2. Fetch push tokens for these users
    // Only fetch tokens that belong to the users the sender is authorized to message
    // (In a real app, you'd check friendship/expert status here)
    const { data: tokens, error: dbError } = await supabaseClient
      .from('push_tokens')
      .select('push_token')
      .in('user_id', userIds)

    if (dbError || !tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No tokens found' }), { status: 200 })
    }

    const expoTokens = tokens.map((t: any) => t.push_token)

    // 3. Send to Expo
    const message = {
      to: expoTokens,
      sound: 'default',
      title,
      body,
      data: data || {},
    }

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    const resData = await response.json()

    return new Response(JSON.stringify(resData), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
