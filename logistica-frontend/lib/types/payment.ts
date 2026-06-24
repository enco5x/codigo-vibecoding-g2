export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded"

export interface CheckoutItem {
  product_id: number
  quantity: number
}

export interface CheckoutRequest {
  items: CheckoutItem[]
  success_url: string
  cancel_url: string
}

export interface CheckoutResponse {
  session_id: string
  session_url: string
  payment_order_id: number
}

export interface PaymentOrder {
  id: number
  shipment: number | null
  shipment_tracking: string | null
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  stripe_customer_email: string | null
  amount_total: string
  currency: string
  status: PaymentStatus
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: number
  quantity: number
  name: string
  sku: string
  unit_price: string
  stock_quantity: number
}
