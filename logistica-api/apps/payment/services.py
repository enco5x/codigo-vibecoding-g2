import stripe
from django.conf import settings
from decimal import Decimal

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripePaymentService:

    @staticmethod
    def create_checkout_session(cart_items, success_url, cancel_url):
        line_items = []
        for item in cart_items:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item['product'].name,
                    },
                    'unit_amount': int(item['product'].unit_price * 100),
                },
                'quantity': item['quantity'],
            })

        session = stripe.checkout.Session.create(
            line_items=line_items,
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'cart_items': str([{'product_id': i['product'].id, 'quantity': i['quantity']} for i in cart_items]),
            },
        )
        return session

    @staticmethod
    def create_stripe_product(product):
        product_data = {
            'name': product.name,
            'metadata': {
                'product_id': product.id,
                'sku': product.sku,
            },
        }
        if product.description:
            product_data['description'] = product.description[:500]
        stripe_product = stripe.Product.create(**product_data)
        return stripe_product

    @staticmethod
    def create_stripe_price(stripe_product_id, unit_price, currency='usd'):
        price = stripe.Price.create(
            product=stripe_product_id,
            unit_amount=int(unit_price * 100),
            currency=currency,
        )
        return price

    @staticmethod
    def construct_webhook_event(payload, sig_header):
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        return event

    @staticmethod
    def get_session(session_id):
        return stripe.checkout.Session.retrieve(session_id)
