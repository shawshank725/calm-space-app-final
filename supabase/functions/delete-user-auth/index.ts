import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get current user's session
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    console.log(`Requested full account deletion for user: ${user.id}`)

    // 2. Delete the user from auth.users (requires service role)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
      return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, message: 'User account and data scheduled for deletion' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
