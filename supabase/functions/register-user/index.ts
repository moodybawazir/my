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
        const { email, fullName, phone } = await req.json()
        if (!email) {
            throw new Error('Email is required')
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        // Generate a strong random password for first-time setup
        const dynamicPassword = crypto.randomUUID() + "Safe2026!";
        let targetUserId = null;

        // Check if user already exists in Auth
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        if (listError) throw listError;

        const existingUser = listData?.users?.find((u: any) => u.email === email)

        if (existingUser) {
            targetUserId = existingUser.id;
            // Just update metadata if they already exist
            await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
                user_metadata: {
                    full_name: fullName || existingUser.user_metadata?.full_name || '',
                    phone: phone || existingUser.user_metadata?.phone || '',
                    role: 'user'
                }
            })
        } else {
            // Create new user via Admin API (bypasses signup disabled)
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: dynamicPassword,
                email_confirm: true,
                user_metadata: {
                    full_name: fullName || '',
                    phone: phone || '',
                    role: 'user'
                }
            })
            if (createError) throw createError;
            if (newUser?.user?.id) targetUserId = newUser.user.id;
        }

        // Sync to public.users
        if (targetUserId) {
            await supabaseAdmin.from('users').upsert({
                id: targetUserId,
                email: email,
                full_name: fullName || 'User',
                role: 'user',
                phone: phone || null
            });
        }

        return new Response(JSON.stringify({ success: true, message: 'User registered successfully' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
