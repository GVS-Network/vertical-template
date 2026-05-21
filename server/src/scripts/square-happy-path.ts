/**
 * Square SANDBOX happy-path helper (Prompt 3.4).
 *
 * Prerequisites:
 *   - server/.env: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_ENV=sandbox
 *   - server/.env: PAYMENT_PROVIDER=square
 *   - Server running: npm run dev
 *   - Square webhook subscription → SQUARE_WEBHOOK_NOTIFICATION_URL
 *
 * Run: npm run test:square-happy-path --prefix server
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const API = process.env.SQUARE_TEST_API ?? 'http://localhost:3001/api';

async function main(): Promise<void> {
  for (const key of [
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_LOCATION_ID',
  ] as const) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing ${key} in server/.env`);
    }
  }

  let res: Response;
  try {
    res = await fetch(`${API}/payments/checkout/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: 'Square Happy Path Widget', sku: 'HP-001', price: 1500, qty: 1 }],
      }),
    });
  } catch (err) {
    const code =
      err && typeof err === 'object' && 'cause' in err
        ? (err.cause as { code?: string })?.code
        : undefined;
    if (code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot reach ${API} — start the API first: npm run dev (from repo root).`
      );
    }
    throw err;
  }

  const body = (await res.json()) as {
    status?: string;
    data?: { url?: string; orderId?: string; providerRef?: string };
    message?: string;
  };

  if (!res.ok) {
    const hint =
      res.status === 501
        ? ' Add PAYMENT_PROVIDER=square to server/.env and restart npm run dev.'
        : '';
    throw new Error(
      `checkout/intent ${res.status}: ${body.message ?? JSON.stringify(body)}${hint}`
    );
  }

  if (!body.data?.url || !body.data.orderId) {
    throw new Error(`Unexpected response: ${JSON.stringify(body)}`);
  }

  console.log('square-happy-path: checkout link created');
  console.log(`  orderId:      ${body.data.orderId}`);
  console.log(`  providerRef:  ${body.data.providerRef}`);
  console.log(`  payment URL:  ${body.data.url}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open the payment URL and complete checkout in Square Sandbox.');
  console.log(
    '  2. Confirm Square sends order.updated (PAID) to your webhook URL.'
  );
  console.log('  3. Expect Mongo order.status === "paid" (markOrderPaidByProviderRef).');
}

main().catch((err) => {
  console.error('square-happy-path FAILED:', err);
  process.exit(1);
});
