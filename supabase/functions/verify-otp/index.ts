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
            throw new Error('البريد الإلكتروني ورمز التحقق مطلوبان')
        }

        console.log(`Verifying OTP for ${email}...`);

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
            console.error('OTP Verification Failed:', otpError);
            return new Response(JSON.stringify({
                success: false,
                error: 'رمز التحقق غير صحيح أو منتهي الصلاحية'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // Check expiration
        if (new Date(otpData.expires_at) < new Date()) {
            await supabaseAdmin.from('otp_codes').delete().eq('email', email)
            return new Response(JSON.stringify({
                success: false,
                error: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // Delete OTP
        await supabaseAdmin.from('otp_codes').delete().eq('email', email)

        const dynamicPassword = crypto.randomUUID() + "Safe2026!";
        let targetUserId = null;

        console.log(`Fetching user details for ${email}...`);
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

        if (listError) {
            console.error('List Users Error:', listError);
            throw new Error("فشل في استرجاع بيانات المستخدم");
        }

        const existingUser = listData?.users?.find((u: any) => u.email === email)
        if (existingUser) {
            targetUserId = existingUser.id;
            console.log(`Found existing user: ${targetUserId}`);
        }

        if (targetUserId) {
            console.log(`Updating password for user ${targetUserId}...`);
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
                password: dynamicPassword,
                email_confirm: true
            })
            if (updateError) {
                console.error('Update User Error:', updateError);
                throw new Error('فشل في تحديث بيانات الدخول');
            }
        } else {
            console.log(`Creating new user for ${email}...`);
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: dynamicPassword,
                email_confirm: true,
                user_metadata: { full_name: fullName || '', phone: phone || '', role: 'user' }
            })
            if (createError) {
                console.error('Create User Error:', createError);
                throw new Error('فشل في إنشاء حساب جديد: ' + createError.message);
            }
            if (newUser?.user?.id) targetUserId = newUser.user.id;
        }

        if (targetUserId) {
            console.log(`Syncing profile for user ${targetUserId}...`);
            await supabaseAdmin.from('users').upsert({
                id: targetUserId,
                email: email,
                full_name: fullName || 'User',
                role: 'user',
                phone: phone || null
            });
        }

        console.log(`Authentication successful for ${email}`);

        return new Response(JSON.stringify({
            success: true,
            api_session_key: dynamicPassword,
            message: 'تم التحقق بنجاح'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
        })

    } catch (error: any) {
        console.error('verify-otp internal error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'حدث خطأ غير متوقع أثناء عملية التحقق'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
        })
    }
})
