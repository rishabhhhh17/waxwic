'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartLine = {
  product_id: string;
  variant_id: string;
  slug: string;
  name: string;
  variant_label: string;
  unit_price_paise: number;
  qty: number;
  image: string;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (line: Omit<CartLine, 'qty'> & { qty?: number }) => void;
  remove: (variant_id: string) => void;
  setQty: (variant_id: string, qty: number) => void;
  clear: () => void;
  totalPaise: () => number;
  itemCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (line) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variant_id === line.variant_id);
          const incomingQty = line.qty ?? 1;
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.variant_id === line.variant_id ? { ...l, qty: l.qty + incomingQty } : l,
              ),
              isOpen: true,
            };
          }
          return {
            lines: [...s.lines, { ...line, qty: incomingQty }],
            isOpen: true,
          };
        }),
      remove: (variant_id) => set((s) => ({ lines: s.lines.filter((l) => l.variant_id !== variant_id) })),
      setQty: (variant_id, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.variant_id === variant_id ? { ...l, qty: Math.max(0, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
      totalPaise: () => get().lines.reduce((acc, l) => acc + l.unit_price_paise * l.qty, 0),
      itemCount: () => get().lines.reduce((acc, l) => acc + l.qty, 0),
    }),
    { name: 'waxwic-cart' },
  ),
);
