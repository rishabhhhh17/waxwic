import { NextResponse } from 'next/server';
import { getActiveProducts, getProductBySlug } from '@/lib/products';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateStaticParams() {
  return getActiveProducts().map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ product });
}
