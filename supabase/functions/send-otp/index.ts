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
        const { email } = await req.json()
        if (!email) {
            throw new Error('البريد الإلكتروني مطلوب')
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Expires in 15 minutes
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 15)

        // Save to otp_codes table
        const { error: dbError } = await supabaseAdmin
            .from('otp_codes')
            .upsert({
                email,
                code: otpCode,
                expires_at: expiresAt.toISOString()
            }, { onConflict: 'email' })

        if (dbError) {
            throw new Error('فشل في حفظ كود التحقق')
        }

        // Send email using Resend API
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (!resendApiKey) {
            throw new Error('RESEND_API_KEY is not configured');
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Baseerah AI <onboarding@resend.dev>', // Should use a verified domain in production if possible.
                to: email,
                subject: 'رمز التحقق الخاص بك لـ Baseerah AI',
                html: `
          <div dir="rtl" style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h1 style="color: #0d2226;">تسجيل الدخول - Baseerah AI</h1>
            <p>رمز التحقق الخاص بك هو:</p>
            <h2 style="font-size: 36px; letter-spacing: 5px; color: #1e403a; background: #f0f0f0; padding: 15px; border-radius: 10px; display: inline-block;">${otpCode}</h2>
            <p style="color: #666; font-size: 14px;">صالح لمدة 15 دقيقة.</p>
          </div>
        `
            })
        });

        if (!resendResponse.ok) {
            const errorData = await resendResponse.json();
            console.error('Resend Error:', errorData);
            throw new Error('فشل في إرسال البريد الإلكتروني. يرجى التأكد من صحة البريد.');
        }

        return new Response(JSON.stringify({ success: true }), {
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
