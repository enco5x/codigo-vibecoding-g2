import { api } from "@/lib/api/client"
import type { CheckoutRequest, CheckoutResponse, PaymentOrder } from "@/lib/types/payment"

export function createCheckoutSession(data: CheckoutRequest) {
  return api.post<CheckoutResponse>("/payments/checkout/", data)
}

export function getPaymentOrder(id: number) {
  return api.get<PaymentOrder>(`/payments/orders/${id}/`)
}
