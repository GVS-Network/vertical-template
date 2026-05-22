import { useState } from 'react';
import api from '../../../services/api';
import type { OrderLineItem } from '../types';

const LATER_PHASE_MESSAGE = 'Payments configured in a later phase';

interface CheckoutIntentResponse {
  url: string;
  orderId: string;
  providerRef: string;
}

interface CheckoutButtonProps {
  items: OrderLineItem[];
  label?: string;
}

function CheckoutButton({
  items,
  label = 'Checkout',
}: CheckoutButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await api.post<{ data: CheckoutIntentResponse }>(
        '/payments/checkout/intent',
        { items }
      );
      const checkout = data.data;
      if (checkout?.url) {
        window.location.assign(checkout.url);
        return;
      }
      setMessage('Checkout did not return a payment URL.');
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string; code?: string } };
        message?: string;
      };
      const apiMessage = axiosErr.response?.data?.message;
      const status = axiosErr.response?.status;

      if (
        status === 501 ||
        apiMessage?.includes('NotImplementedYet') ||
        apiMessage === LATER_PHASE_MESSAGE ||
        axiosErr.response?.data?.code === 'PAYMENTS_NOT_IMPLEMENTED'
      ) {
        setMessage(LATER_PHASE_MESSAGE);
      } else {
        setMessage(apiMessage ?? axiosErr.message ?? 'Checkout failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const messageClass =
    message === LATER_PHASE_MESSAGE
      ? 'pack-message pack-message--warn'
      : 'pack-message pack-message--error';

  return (
    <div className="pack-inline">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="btn btn-primary"
      >
        {loading ? 'Checking…' : label}
      </button>
      {message && <p className={messageClass}>{message}</p>}
    </div>
  );
}

export default CheckoutButton;
