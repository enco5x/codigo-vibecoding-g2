import stripe
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.products.models import Product
from apps.payment.services import StripePaymentService

stripe.api_key = settings.STRIPE_SECRET_KEY

MOCK_PRODUCTS = [
    {
        'sku': 'ELEC-001',
        'name': 'Laptop Dell XPS 15',
        'description': 'Laptop de alto rendimiento con pantalla OLED 15.6 pulgadas, procesador Intel Core i7 de 13a generacion, 16GB RAM, 512GB SSD.',
        'category': 'Electronics',
        'unit_price': 1299.99,
        'weight_kg': 1.86,
        'dimensions': '35.7 x 24.0 x 1.8 cm',
    },
    {
        'sku': 'ELEC-002',
        'name': 'Monitor LG UltraWide 34"',
        'description': 'Monitor curvo UltraWide QHD de 34 pulgadas, 3440x1440, IPS, 144Hz, HDR10, USB-C.',
        'category': 'Electronics',
        'unit_price': 449.99,
        'weight_kg': 6.5,
        'dimensions': '81.6 x 45.5 x 19.5 cm',
    },
    {
        'sku': 'ELEC-003',
        'name': 'Teclado Mecanico Keychron Q1',
        'description': 'Teclado mecanico inalambrico con switches Gateron Brown, backlight RGB, carcasa de aluminio, compatible Mac/Windows.',
        'category': 'Electronics',
        'unit_price': 169.99,
        'weight_kg': 0.92,
        'dimensions': '32.5 x 12.5 x 3.5 cm',
    },
    {
        'sku': 'ELEC-004',
        'name': 'Mouse Logitech MX Master 3S',
        'description': 'Mouse inalambrico ergonomico con scroll MagSpeed, sensor de 8000 DPI, carga USB-C, hasta 70 dias de bateria.',
        'category': 'Electronics',
        'unit_price': 99.99,
        'weight_kg': 0.14,
        'dimensions': '12.4 x 8.4 x 5.1 cm',
    },
    {
        'sku': 'ELEC-005',
        'name': 'Audifonos Sony WH-1000XM5',
        'description': 'Audifonos inalambricos con cancelacion de ruido adaptativa, 30 horas de bateria, audio Hi-Res, Bluetooth 5.2.',
        'category': 'Electronics',
        'unit_price': 349.99,
        'weight_kg': 0.25,
        'dimensions': '25.4 x 20.0 x 8.5 cm',
    },
]


class Command(BaseCommand):
    help = 'Create products in Stripe. Uses mock products if DB has less than 5 ELEC-* products.'

    def handle(self, *args, **options):
        self.stdout.write('Starting Stripe product creation...')

        elec_products = list(Product.objects.filter(is_active=True, sku__startswith='ELEC-'))

        if len(elec_products) < 5:
            self.stdout.write(self.style.WARNING(
                f'DB has only {len(elec_products)} ELEC-* products. Adding mock products...'
            ))
            elec_products = self._add_mock_products(elec_products)

        created_count = 0
        for product in elec_products:
            try:
                stripe_product = StripePaymentService.create_stripe_product(product)
                StripePaymentService.create_stripe_price(
                    stripe_product.id, product.unit_price
                )
                created_count += 1
                self.stdout.write(self.style.SUCCESS(
                    f'Created: {product.name} (SKU: {product.sku}) - '
                ))
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'Error creating {product.name}: {e}'
                ))

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Created {created_count} products in Stripe.'
        ))

    def _add_mock_products(self, existing_products):
        existing_skus = {p.sku for p in existing_products}
        products = list(existing_products)

        for mock_data in MOCK_PRODUCTS:
            if mock_data['sku'] not in existing_skus:
                product, created = Product.objects.get_or_create(
                    sku=mock_data['sku'],
                    defaults={
                        'name': mock_data['name'],
                        'description': mock_data['description'],
                        'category': mock_data['category'],
                        'unit_price': mock_data['unit_price'],
                        'weight_kg': mock_data['weight_kg'],
                        'dimensions': mock_data['dimensions'],
                        'stock_quantity': 50,
                        'is_active': True,
                    }
                )
                if created:
                    products.append(product)
                    self.stdout.write(f'  Added mock: {product.name}')

        return products
