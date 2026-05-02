import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, signAdminCookie } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'not_configured' }, { status: 500 });

  let body: { password?: string } = {};
  try {
    body = (await req.json()) as { password?: string };
  } catch {}

  const supplied = body.password ?? '';
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return NextResponse.json({ error: 'bad_password' }, { status: 401 });

  const token = await signAdminCookie();
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
