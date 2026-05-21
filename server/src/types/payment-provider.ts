/**
 * Payment seam contract (type-only in phase 1). Implementations land in phase 3
 * under server/src/providers/ or features/payments/providers/.
 */
export interface PaymentProvider {
  charge(orderId: string): Promise<{ providerRef: string }>;
  refund(providerRef: string): Promise<{ providerRef: string }>;
  listProducts(): Promise<readonly unknown[]>;
  syncInventory(products: readonly unknown[]): Promise<void>;
}
