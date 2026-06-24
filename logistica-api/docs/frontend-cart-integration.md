# Frontend Integration - Shopping Cart & Stripe Checkout

## Overview

Documentacion para implementar carrito de compras y checkout con Stripe en el frontend.

**Base URL:** `http://127.0.0.1:8000/api/v1/`

**Auth:** JWT Bearer token en header `Authorization: Bearer <token>`

---

## 1. Products API

### List Products

```
GET /api/v1/products/
```

**Response 200:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "sku": "ELEC-001",
      "name": "Laptop Dell XPS 15",
      "category": "Electronics",
      "unit_price": "1299.99",
      "stock_quantity": 50,
      "is_active": true,
      "supplier_name": "Tech Supplies Inc",
      "warehouse_name": "Main Warehouse"
    }
  ]
}
```

### Get Product by SKU

```
GET /api/v1/products/by-sku/{sku}/
```

---

## 2. Checkout API

### Create Checkout Session

```
POST /api/v1/payments/checkout/
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 3, "quantity": 1}
  ],
  "success_url": "https://tu-frontend.com/payment/success",
  "cancel_url": "https://tu-frontend.com/payment/cancel"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| items | array | Yes | Lista de productos en el carrito |
| items[].product_id | int | Yes | ID del producto |
| items[].quantity | int | Yes | Cantidad (minimo 1) |
| success_url | string | Yes | URL a redirigir despues del pago exitoso |
| cancel_url | string | Yes | URL a redirigir si el usuario cancela |

**Response 201:**
```json
{
  "session_id": "cs_test_a1b2c3d4e5f6",
  "session_url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6",
  "payment_order_id": 1
}
```

**Response 400:**
```json
{
  "error": "Product not found or inactive"
}
```

**Response 404:**
```json
{
  "detail": "No Product matches the given query."
}
```

### Get Payment Order Details

```
GET /api/v1/payments/orders/{id}/
```

**Response 200:**
```json
{
  "id": 1,
  "shipment": null,
  "shipment_tracking": null,
  "stripe_session_id": "cs_test_a1b2c3d4e5f6",
  "stripe_payment_intent_id": "pi_1234567890",
  "stripe_customer_email": "customer@email.com",
  "amount_total": "2749.97",
  "currency": "usd",
  "status": "completed",
  "created_at": "2026-06-23T10:30:00Z",
  "updated_at": "2026-06-23T10:35:00Z"
}
```

**Payment Status Values:**
| Status | Description |
|--------|-------------|
| `pending` | Pago en proceso |
| `completed` | Pago exitoso |
| `failed` | Pago fallido |
| `cancelled` | Pago cancelado por el usuario |
| `refunded` | Pago reembolsado |

---

## 3. Implementation Flow

### Step 1: Load Products

```javascript
const response = await fetch('/api/v1/products/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
// data.results = array de productos
```

### Step 2: Add to Cart (Local State)

```javascript
// Ejemplo con React state
const [cart, setCart] = useState([]);

const addToCart = (product, quantity = 1) => {
  setCart(prev => {
    const existing = prev.find(item => item.product_id === product.id);
    if (existing) {
      return prev.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    }
    return [...prev, { product_id: product.id, quantity, product }];
  });
};

const removeFromCart = (productId) => {
  setCart(prev => prev.filter(item => item.product_id !== productId));
};

const updateQuantity = (productId, quantity) => {
  if (quantity < 1) return removeFromCart(productId);
  setCart(prev =>
    prev.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    )
  );
};
```

### Step 3: Calculate Total

```javascript
const getCartTotal = () => {
  return cart.reduce((total, item) => {
    return total + (item.product.unit_price * item.quantity);
  }, 0);
};
```

### Step 4: Create Checkout Session

```javascript
const handleCheckout = async () => {
  const items = cart.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity
  }));

  const response = await fetch('/api/v1/payments/checkout/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items,
      success_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`
    })
  });

  if (response.ok) {
    const data = await response.json();
    // Redirigir a Stripe Checkout
    window.location.href = data.session_url;
  } else {
    const error = await response.json();
    alert(`Error: ${error.error || 'Failed to create checkout'}`);
  }
};
```

### Step 5: Handle Success/Cancel Pages

```javascript
// payment/success/page.jsx
useEffect(() => {
  // Opcional: verificar estado del pago
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  if (sessionId) {
    // Puedes consultar el estado del pago
    fetch(`/api/v1/payments/orders/?session_id=${sessionId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // Limpiar carrito
  localStorage.removeItem('cart');
}, []);
```

---

## 4. Cart Component Example (React)

```jsx
import { useState, useEffect } from 'react';

function ShoppingCart() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((sum, item) =>
    sum + (item.unit_price * item.quantity), 0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/payments/checkout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          })),
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`
        })
      });

      const data = await response.json();
      window.location.href = data.session_url;
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>${item.unit_price}</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Checkout with Stripe'}
          </button>
        </>
      )}
    </div>
  );
}
```

---

## 5. Webhook Events (Backend)

El backend recibe estos eventos de Stripe automaticamente:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Actualiza `PaymentOrder` status a `completed` |

No necesitas implementar nada en el frontend para esto.

---

## 6. Environment Variables (Frontend)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 7. Error Handling

| Status Code | Description | Action |
|-------------|-------------|--------|
| 400 | Invalid request data | Check items format |
| 401 | Unauthorized | Refresh JWT token |
| 404 | Product not found | Verify product_id exists |
| 500 | Server error | Retry or contact backend team |

---

## 8. Testing Checklist

- [ ] Load products list
- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove product from cart
- [ ] Persist cart in localStorage
- [ ] Create checkout session
- [ ] Redirect to Stripe Checkout
- [ ] Complete payment (test card: 4242 4242 4242 4242)
- [ ] Success page redirect
- [ ] Cancel page redirect
- [ ] Cart clears after successful payment

---

## 9. Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0025 0000 3155` | Requires 3D Secure |

**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits
