import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: true },
});

const email = `codex-verify-${Date.now()}@example.com`;
const password = 'Supabase123!';

console.log('Testing Supabase signup/login for', email);

const signUp = await supabase.auth.signUp({ email, password });
console.log('signUp', {
  userId: signUp.data.user?.id,
  gotSession: Boolean(signUp.data.session),
  error: signUp.error?.message || null,
});
if (signUp.error) console.error('signUp error details', signUp.error);

let session = signUp.data.session;
if (!session) {
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  console.log('signIn', {
    userId: signIn.data.user?.id,
    gotSession: Boolean(signIn.data.session),
    error: signIn.error?.message || null,
  });
  if (signIn.error) console.error('signIn error details', signIn.error);
  session = signIn.data.session;
}

if (!session) {
  console.error('No session obtained; email confirmation may be required.');
  process.exit(2);
}

const user = session.user;
const payload = {
  id: user.id,
  email: user.email,
  auth_provider: user.app_metadata?.provider ?? 'email',
  last_sign_in_at: user.last_sign_in_at ?? user.created_at,
  created_at: user.created_at,
  updated_at: new Date().toISOString(),
};

const profile = await supabase.from('user_profiles').upsert(payload, { onConflict: 'id' });
console.log('user_profiles upsert', { error: profile.error?.message || null });

const users = await supabase.from('users').upsert(payload, { onConflict: 'id' });
console.log('users upsert', { error: users.error?.message || null });

const profileRow = await supabase.from('user_profiles')
  .select('id,email,auth_provider,last_sign_in_at,created_at,updated_at')
  .eq('id', user.id)
  .maybeSingle();
console.log('profile row', profileRow.data);

const usersRow = await supabase.from('users')
  .select('id,email,auth_provider,last_sign_in_at,created_at,updated_at')
  .eq('id', user.id)
  .maybeSingle();
console.log('users row', usersRow.data);

console.log('Done');
