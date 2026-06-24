import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from apps.products.models import Product
from .models import PaymentOrder
from .services import StripePaymentService
from .serializers import PaymentOrderSerializer, CheckoutSessionSerializer

logger = logging.getLogger(__name__)


@extend_schema(
    summary='Create Stripe Checkout Session',
    description='Creates a Stripe Checkout Session for a cart of products. Send a list of products with quantities to generate a payment session.',
    request=CheckoutSessionSerializer,
    responses={
        201: OpenApiResponse(
            response=dict,
            description='Checkout session created successfully',
            examples=[
                OpenApiExample(
                    name='Success Response',
                    value={
                        'session_id': 'cs_test_a1b2c3...',
                        'session_url': 'https://checkout.stripe.com/pay/cs_test_a1b2c3...',
                        'payment_order_id': 1,
                    }
                )
            ]
        ),
        400: OpenApiResponse(description='Invalid request data or product not found'),
    },
    tags=['Payments'],
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    serializer = CheckoutSessionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    items_data = serializer.validated_data['items']
    success_url = serializer.validated_data['success_url']
    cancel_url = serializer.validated_data['cancel_url']

    cart_items = []
    for item_data in items_data:
        product = get_object_or_404(Product, id=item_data['product_id'], is_active=True)
        cart_items.append({
            'product': product,
            'quantity': item_data['quantity'],
        })

    try:
        session = StripePaymentService.create_checkout_session(cart_items, success_url, cancel_url)

        amount_total = sum(
            item['product'].unit_price * item['quantity'] for item in cart_items
        )

        payment_order = PaymentOrder.objects.create(
            stripe_session_id=session.id,
            amount_total=amount_total,
            currency='usd',
            status='pending',
        )

        return Response({
            'session_id': session.id,
            'session_url': session.url,
            'payment_order_id': payment_order.id,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error creating checkout session: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema(
    summary='Get Payment Order Details',
    description='Retrieve details of a specific payment order by its ID.',
    responses={
        200: PaymentOrderSerializer,
        404: OpenApiResponse(description='Payment order not found'),
    },
    tags=['Payments'],
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_order_detail(request, pk):
    payment_order = get_object_or_404(PaymentOrder, pk=pk)
    serializer = PaymentOrderSerializer(payment_order)
    return Response(serializer.data)


@extend_schema(
    summary='Stripe Webhook',
    description='Webhook endpoint for Stripe to send payment event notifications. Verifies the webhook signature before processing.',
    exclude=True,
)
@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    if not sig_header:
        return JsonResponse({'error': 'Missing signature'}, status=400)

    try:
        event = StripePaymentService.construct_webhook_event(payload, sig_header)
    except Exception as e:
        logger.error(f"Webhook signature verification failed: {e}")
        return JsonResponse({'error': str(e)}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)

    return JsonResponse({'status': 'success'}, status=200)


def handle_checkout_completed(session):
    try:
        payment_order = PaymentOrder.objects.get(stripe_session_id=session['id'])
        payment_order.status = 'completed'
        payment_order.stripe_payment_intent_id = session.get('payment_intent', '')
        payment_order.stripe_customer_email = session.get('customer_details', {}).get('email', '')
        payment_order.save()

        logger.info(f"Payment completed for order {payment_order.id}")
    except PaymentOrder.DoesNotExist:
        logger.error(f"PaymentOrder not found for session {session['id']}")
