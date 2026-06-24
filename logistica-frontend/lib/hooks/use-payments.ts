import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCheckoutSession, getPaymentOrder } from "@/lib/api/payments"
import type { CheckoutRequest } from "@/lib/types/payment"

export function useCheckout() {
  return useMutation({
    mutationFn: (data: CheckoutRequest) => createCheckoutSession(data).then((r) => r.data),
  })
}

export function usePaymentOrder(id: number) {
  return useQuery({
    queryKey: ["payment-orders", id],
    queryFn: () => getPaymentOrder(id).then((r) => r.data),
    enabled: !!id,
  })
}
