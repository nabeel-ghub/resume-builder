import { NextResponse } from 'next/server';
import { createClient } from '~/utils/supabase/server';

//Handle save session with unique-code
export async function GET(request: Request) {
  const { searchParams, origin, protocol } = new URL(request.url);
  const code = searchParams.get('code');

  const host = request.headers.get('host');
  const currentOrigin = `${protocol}//${host}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${currentOrigin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}