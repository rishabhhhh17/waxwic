import { redirect } from 'next/navigation';
import { verifyAdmin } from '@/lib/admin-auth';
import { AdminClient } from './admin-client';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Admin — Waxwic' };

export default async function AdminPage() {
  const ok = await verifyAdmin();
  if (!ok) redirect('/admin/login');
  return <AdminClient />;
}
