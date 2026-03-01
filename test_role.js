import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://lhymsqwhllsumijvktgp.supabase.co',
    'sb_publishable_aJ9ScuTHqIijteoyAHl55g_lQBCqGTi'
);

async function run() {
    const { data, error } = await supabase.from('users').select('id, email, role');
    console.log('Users:', data);
    if (error) console.error('Error:', error);
}
run();
