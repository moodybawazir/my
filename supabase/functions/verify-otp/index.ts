import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, code, fullName, phone } = await req.json()
    if (!email || !code) {
      throw new Error('ÇáÈÑíÏ ÇáÅáßÊÑæäí æÇáÑãÒ ãØáæÈÇä')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify OTP
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single()

    if (otpError || !otpData) {
      throw new Error('ÇáÑãÒ ÛíÑ ÕÍíÍ')
    }

    // Delete OTP
    await supabaseAdmin.from('otp_codes').delete().eq('email', email)

    const dynamicPassword = crypto.randomUUID() + "Safe2026!";
    let targetUserId = null;
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) { throw new Error("List Users Error: " + JSON.stringify(listError)) }

    if (listData?.users) {
      const existingUser = listData.users.find((u: any) => u.email === email)
      if (existingUser) targetUserId = existingUser.id;
    }

    if (targetUserId) {
       const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
        password: dynamicPassword,
        email_confirm: true
      })
      if (updateError) throw new Error('Update Error: ' + JSON.stringify(updateError))
    } else {
       const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: dynamicPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName || '', phone: phone || '', role: 'user' }
      })
      if (createError) throw new Error('Create Error: ' + JSON.stringify(createError) + ' | Msg: ' + createError.message)
      if (newUser?.user?.id) targetUserId = newUser.user.id;
    }

    if (targetUserId) {
       await supabaseAdmin.from('users').upsert({
           id: targetUserId,
           email: email,
           full_name: fullName || 'User',
           role: 'user',
           phone: phone || null
       });
    }

    return new Response(JSON.stringify({ success: true, api_session_key: dynamicPassword }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200, 
    })
  }
})
