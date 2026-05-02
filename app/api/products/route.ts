import { NextResponse } from 'next/server';
import { getActiveProducts } from '@/lib/products';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({ products: getActiveProducts() });
}
