'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Wrong password.');
        setSubmitting(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network issue. Try again.');
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-ivory min-h-[70vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl text-ink">Admin</h1>
        <p className="mt-1 text-sm text-smoke">Enter the admin password.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-3 bg-ivory border border-line focus:border-ink outline-none"
            placeholder="••••••••"
            autoFocus
          />
          {error && <div className="text-sm text-clay">{error}</div>}
          <button
            type="submit"
            disabled={submitting || password.length === 0}
            className="w-full h-11 bg-ink text-ivory text-[12px] uppercase tracking-wider hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? 'Working…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}
