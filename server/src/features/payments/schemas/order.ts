import mongoose, { Schema, type Document, type Types } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';

export type OrderStatus = 'draft' | 'pending' | 'paid' | 'cancelled';

export type OrderProvider = 'stripe' | 'square' | null;

export interface OrderLineItem {
  name: string;
  sku: string;
  price: number;
  qty: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  tenantId: string;
  items: OrderLineItem[];
  status: OrderStatus;
  total: number;
  paymentRef: string | null;
  provider: OrderProvider;
  createdAt: Date;
}

export type OrderDocument = IOrder & Document;

const orderLineItemSchema = new Schema<OrderLineItem>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    ...tenantIdSchemaDefinition,
    items: { type: [orderLineItemSchema], required: true, default: [] },
    status: {
      type: String,
      enum: ['draft', 'pending', 'paid', 'cancelled'],
      required: true,
      default: 'draft',
    },
    total: { type: Number, required: true, min: 0 },
    paymentRef: { type: String, default: null },
    provider: {
      type: String,
      enum: ['stripe', 'square'],
      default: null,
    },
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: false }
);

applyTenantCompoundIndex(orderSchema, 'createdAt');

export const Order =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', orderSchema);

export type OrderId = Types.ObjectId | string;
