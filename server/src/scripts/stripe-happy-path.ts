/**
 * Stripe TEST happy-path helper (Prompt 3.3).
 *
 * Prerequisites:
 *   - server/.env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, MONGODB_URI
 *   - defaultSiteConfig.payment.provider = 'stripe' (or pass STRIPE_TEST=1)
 *   - Server running: npm run dev
 *   - Webhook forwarding: stripe listen --forward-to localhost:3001/api/payments/webhook/stripe
 *
 * Run: npm run test:stripe-happy-path --prefix server
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const API = process.env.STRIPE_TEST_API ?? 'http://localhost:3001/api';

async function main(): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    throw new Error('Missing STRIPE_SECRET_KEY in server/.env');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET in server/.env');
  }

  const res = await fetch(`${API}/payments/checkout/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ name: 'Happy Path Widget', sku: 'HP-001', price: 1500, qty: 1 }],
    }),
  });

  const body = (await res.json()) as {
    status?: string;
    data?: { url?: string; orderId?: string; providerRef?: string };
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      `checkout/intent ${res.status}: ${body.message ?? JSON.stringify(body)}`
    );
  }

  if (!body.data?.url || !body.data.orderId) {
    throw new Error(`Unexpected response: ${JSON.stringify(body)}`);
  }

  console.log('stripe-happy-path: checkout session created');
  console.log(`  orderId:      ${body.data.orderId}`);
  console.log(`  providerRef:  ${body.data.providerRef}`);
  console.log(`  payment URL:  ${body.data.url}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open the payment URL and complete checkout (test card 4242…).');
  console.log(
    '  2. With stripe listen forwarding webhooks, confirm order status:'
  );
  console.log(
    `     curl -s ${API.replace('/api', '')}/api/... or check Mongo Order ${body.data.orderId}`
  );
  console.log('  3. Expect order.status === "paid" after checkout.session.completed.');
}

main().catch((err) => {
  console.error('stripe-happy-path FAILED:', err);
  process.exit(1);
});
