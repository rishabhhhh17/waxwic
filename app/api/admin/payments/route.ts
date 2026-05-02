import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { razorpay } from '@/lib/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const ok = await verifyAdmin();
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const count = Math.max(1, Math.min(100, Number(url.searchParams.get('count') ?? '100')));

  try {
    const list = await razorpay().payments.all({ count });
    return NextResponse.json({ items: list.items ?? [] });
  } catch (e) {
    return NextResponse.json(
      { error: 'razorpay_failed', detail: (e as Error).message, items: [] },
      { status: 502 },
    );
  }
}
