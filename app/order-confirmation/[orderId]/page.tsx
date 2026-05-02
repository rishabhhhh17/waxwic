import { Suspense } from 'react';
import { ConfirmationClient } from './confirmation-client';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Order placed — Waxwic' };

export default function ConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <Suspense fallback={null}>
      <ConfirmationClient orderId={params.orderId} />
    </Suspense>
  );
}
