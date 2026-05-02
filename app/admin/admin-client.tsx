'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, LogOut } from 'lucide-react';
import { formatINR } from '@/lib/utils';

type RzpItem = {
  product_id: string;
  variant_id: string;
  qty: number;
  name?: string;
  variant_label?: string;
};

type RzpPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: number;
  email?: string;
  contact?: string;
  notes?: {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    items?: string;
    shipping?: string;
    event_id?: string;
  };
};

export function AdminClient() {
  const router = useRouter();
  const [payments, setPayments] = useState<RzpPayment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/payments?count=100');
      if (!res.ok) {
        setError(`Failed: ${res.status}`);
        setPayments([]);
        return;
      }
      const data = (await res.json()) as { items: RzpPayment[] };
      setPayments(data.items ?? []);
    } catch (e) {
      setError((e as Error).message);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  const captured = (payments ?? []).filter((p) => p.status === 'captured');
  const totalPaise = captured.reduce((acc, p) => acc + (p.amount ?? 0), 0);

  return (
    <section className="bg-ivory min-h-[80vh] py-10">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[12px] uppercase tracking-widest text-clay">Operations</div>
            <h1 className="font-display text-4xl text-ink mt-1">Orders</h1>
            <p className="text-xs text-smoke mt-1">
              Pulled live from Razorpay. There is no database — this is the source of truth.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 h-10 px-4 border border-line text-sm hover:border-ink disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 h-10 px-4 border border-line text-sm hover:border-ink"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Captured payments" value={String(captured.length)} />
          <Stat label="Captured revenue" value={formatINR(totalPaise)} />
          <Stat label="All events" value={String(payments?.length ?? 0)} />
          <Stat
            label="Last refresh"
            value={loading ? '…' : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          />
        </div>

        {error && (
          <div className="mt-6 border border-clay/40 bg-clay/5 text-clay text-sm px-4 py-3">{error}</div>
        )}

        <div className="mt-8 overflow-x-auto border border-line">
          <table className="min-w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-widest text-smoke">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">IDs</th>
              </tr>
            </thead>
            <tbody>
              {(payments ?? []).map((p) => {
                let items: RzpItem[] = [];
                try {
                  if (p.notes?.items) items = JSON.parse(p.notes.items) as RzpItem[];
                } catch {}
                const customerName = p.notes?.customer_name ?? '—';
                const customerEmail = p.notes?.customer_email ?? p.email ?? '';
                return (
                  <tr key={p.id} className="border-t border-line align-top">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(p.created_at * 1000).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{customerName}</div>
                      <div className="text-xs text-smoke">{customerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      {items.length === 0 ? (
                        <span className="text-smoke">—</span>
                      ) : (
                        <ul className="space-y-1">
                          {items.map((it, i) => (
                            <li key={i} className="text-xs">
                              {it.name ?? it.product_id}{' '}
                              <span className="text-smoke">
                                · {it.variant_label ?? it.variant_id} × {it.qty}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">{p.method}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          'inline-flex items-center px-2 py-0.5 text-xs uppercase tracking-wider ' +
                          (p.status === 'captured'
                            ? 'bg-moss/15 text-moss'
                            : p.status === 'failed'
                              ? 'bg-clay/15 text-clay'
                              : 'bg-line/40 text-smoke')
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                      {formatINR(p.amount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-smoke">
                      <div className="break-all">{p.id}</div>
                      <div className="break-all">{p.order_id}</div>
                    </td>
                  </tr>
                );
              })}
              {!loading && payments?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-smoke">
                    No payments yet. Place a Razorpay test-mode order to see it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream p-4">
      <div className="text-[11px] uppercase tracking-widest text-smoke">{label}</div>
      <div className="font-display text-2xl text-ink mt-1 tabular-nums">{value}</div>
    </div>
  );
}
