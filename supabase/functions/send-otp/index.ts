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
            console.error('RESEND_API_KEY is missing');
            throw new Error('فشل إرسال البريد: مفتاح API غير متوفر');
        }

        console.log(`Attempting to send OTP to ${email}...`);

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Baseerah AI <support@basserahai.com>',
                to: email,
                subject: 'رمز التحقق الخاص بك لـ Baseerah AI',
                html: `
          <div dir="rtl" style="font-family: sans-serif; text-align: center; padding: 20px; color: #0d2226;">
            <h1 style="color: #1e403a;">تسجيل الدخول - Baseerah AI</h1>
            <p style="font-size: 16px;">مرحباً، رمز التحقق الخاص بك هو:</p>
            <div style="margin: 30px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e403a; background: #f0f7f4; padding: 15px 30px; border-radius: 12px; border: 2px solid #e0ede7; display: inline-block;">${otpCode}</span>
            </div>
            <p style="color: #666; font-size: 14px;">هذا الرمز صالح لمدة 15 دقيقة فقط.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد.</p>
          </div>
        `
            })
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
            console.error('Resend API Error:', resendData);
            return new Response(JSON.stringify({
                success: false,
                error: 'فشل إرسال البريد الإلكتروني. يرجى التأكد من البريد والمحاولة لاحقاً',
                details: resendData
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200, // Handle as success in terms of transport but error in logic
            })
        }

        console.log('OTP sent successfully via Resend:', resendData.id);

        return new Response(JSON.stringify({ success: true, message: 'تم إرسال الرمز بنجاح' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error('send-otp internal error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'حدث خطأ غير متوقع أثناء إرسال الرمز'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }
})
