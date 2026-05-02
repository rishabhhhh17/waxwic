import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'waxwic_admin';

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('ADMIN_SESSION_SECRET is missing or too short');
  return new TextEncoder().encode(s);
}

export async function signAdminCookie() {
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret());
}

export const ADMIN_COOKIE = COOKIE_NAME;

export async function verifyAdmin(): Promise<boolean> {
  try {
    const c = cookies().get(COOKIE_NAME)?.value;
    if (!c) return false;
    const { payload } = await jwtVerify(c, secret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
