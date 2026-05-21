import type { HydratedDocument } from 'mongoose';
import { scopedForTenant } from '../../db/scoped';
import { createError } from '../../middleware/errorHandler';
import {
  Order,
  type IOrder,
  type OrderId,
  type OrderLineItem,
  type OrderProvider,
} from './schemas/order';

function computeTotal(items: OrderLineItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export async function createOrderDraft(
  tenantId: string,
  items: OrderLineItem[],
  provider: OrderProvider = null
): Promise<IOrder> {
  if (!items.length) {
    throw createError('Order must include at least one item', 400);
  }

  for (const item of items) {
    if (!item.name || !item.sku || item.qty < 1 || item.price < 0) {
      throw createError('Invalid order line item', 400);
    }
  }

  const orders = scopedForTenant(Order, tenantId);
  const doc = await orders.create({
    items,
    status: 'draft',
    total: computeTotal(items),
    paymentRef: null,
    provider,
    createdAt: new Date(),
  });

  return doc.toObject() as IOrder;
}

export async function getOrderById(
  tenantId: string,
  orderId: OrderId
): Promise<IOrder | null> {
  const orders = scopedForTenant(Order, tenantId);
  const doc = (await orders.findById(orderId)) as HydratedDocument<IOrder> | null;
  return doc ? doc.toObject() : null;
}

export async function markOrderPaid(
  tenantId: string,
  orderId: OrderId,
  paymentRef: string
): Promise<IOrder | null> {
  const orders = scopedForTenant(Order, tenantId);
  const existing = await getOrderById(tenantId, orderId);
  if (!existing) {
    return null;
  }

  await orders.updateOne(
    { _id: orderId },
    {
      status: 'paid',
      paymentRef,
    }
  );

  return getOrderById(tenantId, orderId);
}
