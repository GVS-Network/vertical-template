import { useState } from 'react';
import api from '../../../services/api';
import type { OrderLineItem } from '../types';

const LATER_PHASE_MESSAGE = 'Payments configured in a later phase';

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
      await api.post('/payments/checkout/intent', { items });
      setMessage('Checkout started (unexpected — provider should not be ready yet).');
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

  return (
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? 'Checking…' : label}
      </button>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message === LATER_PHASE_MESSAGE ? 'text-amber-700' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CheckoutButton;
