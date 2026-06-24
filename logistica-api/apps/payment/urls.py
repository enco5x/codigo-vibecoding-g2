from django.urls import path
from . import views

urlpatterns = [
    path('checkout/', views.create_checkout_session, name='create-checkout-session'),
    path('orders/<int:pk>/', views.payment_order_detail, name='payment-order-detail'),
    path('webhook/', views.stripe_webhook, name='stripe-webhook'),
]
