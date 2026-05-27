from django.test import TestCase
from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from decimal import Decimal

from apps.shipment.models import Shipment, ShipmentItem
from apps.shipment.serializers import (
    ShipmentListSerializer,
    ShipmentDetailSerializer,
    ShipmentCreateSerializer,
    ShipmentItemSerializer,
    ShipmentStatusUpdateSerializer,
)
from apps.customer.models import Customer
from apps.warehouse.models import Warehouse
from apps.products.models import Product
from apps.supplier.models import Supplier


# ──────────────────────────────────────────────
#  Shipment Model
# ──────────────────────────────────────────────

class ShipmentModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.customer = Customer.objects.create(company_name="Test Customer")

    def test_create_shipment_minimal(self):
        s = Shipment.objects.create(
            tracking_number="TRK-001",
            customer=self.customer,
            destination_address="123 Main St",
            destination_city="NYC",
            destination_country="USA",
        )
        self.assertEqual(s.tracking_number, "TRK-001")
        self.assertEqual(s.customer, self.customer)
        self.assertEqual(s.destination_address, "123 Main St")
        self.assertEqual(s.status, "pending")
        self.assertEqual(s.shipping_cost, Decimal("0.00"))
        self.assertIsNone(s.warehouse)
        self.assertEqual(s.origin_address, "")

    def test_shipment_str_returns_tracking(self):
        s = Shipment.objects.create(
            tracking_number="ABC-123", customer=self.customer,
            destination_address="Addr", destination_city="NYC", destination_country="USA",
        )
        self.assertEqual(str(s), "ABC-123")

    def test_shipment_unique_tracking(self):
        Shipment.objects.create(
            tracking_number="UNIQUE", customer=self.customer,
            destination_address="A", destination_city="C", destination_country="C",
        )
        with self.assertRaises(IntegrityError):
            Shipment.objects.create(
                tracking_number="UNIQUE", customer=self.customer,
                destination_address="B", destination_city="D", destination_country="E",
            )

    def test_create_shipment_all_fields(self):
        warehouse = Warehouse.objects.create(name="WH", code="W01")
        s = Shipment.objects.create(
            tracking_number="FULL-01",
            customer=self.customer,
            warehouse=warehouse,
            origin_address="Origin St",
            destination_address="Dest St",
            destination_city="LA",
            destination_country="USA",
            status="in_transit",
            scheduled_pickup="2026-06-01T10:00:00Z",
            scheduled_delivery="2026-06-05T10:00:00Z",
            shipping_cost=150.00,
            weight_kg=10.5,
            notes="Fragile",
        )
        self.assertEqual(s.warehouse, warehouse)
        self.assertEqual(s.status, "in_transit")
        self.assertEqual(float(s.shipping_cost), 150.00)
        self.assertEqual(float(s.weight_kg), 10.5)

    def test_shipment_default_status(self):
        s = Shipment.objects.create(
            tracking_number="DEF-01", customer=self.customer,
            destination_address="A", destination_city="C", destination_country="C",
        )
        self.assertEqual(s.status, "pending")

    def test_shipment_ordering(self):
        s1 = Shipment.objects.create(
            tracking_number="C", customer=self.customer,
            destination_address="A", destination_city="C", destination_country="C",
        )
        s2 = Shipment.objects.create(
            tracking_number="B", customer=self.customer,
            destination_address="A", destination_city="C", destination_country="C",
        )
        s3 = Shipment.objects.create(
            tracking_number="A", customer=self.customer,
            destination_address="A", destination_city="C", destination_country="C",
        )
        qs = Shipment.objects.all()
        self.assertEqual(qs[0].tracking_number, "A")
        self.assertEqual(qs[1].tracking_number, "B")
        self.assertEqual(qs[2].tracking_number, "C")


class ShipmentItemModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        customer = Customer.objects.create(company_name="C")
        cls.shipment = Shipment.objects.create(
            tracking_number="SHP-ITM", customer=customer,
            destination_address="A", destination_city="C", destination_country="C",
        )
        cls.product = Product.objects.create(sku="ITM-SKU", name="Item Product")

    def test_create_shipment_item(self):
        item = ShipmentItem.objects.create(
            shipment=self.shipment,
            product=self.product,
            quantity=3,
            unit_price=25.00,
        )
        self.assertEqual(item.quantity, 3)
        self.assertEqual(item.unit_price, Decimal("25.00"))
        self.assertEqual(item.shipment, self.shipment)
        self.assertEqual(item.product, self.product)

    def test_shipment_item_str(self):
        item = ShipmentItem.objects.create(
            shipment=self.shipment, product=self.product,
            quantity=2, unit_price=10.00,
        )
        self.assertIn("Item Product", str(item))
        self.assertIn("x2", str(item))

    def test_shipment_item_default_quantity(self):
        item = ShipmentItem.objects.create(
            shipment=self.shipment, product=self.product,
            unit_price=5.00,
        )
        self.assertEqual(item.quantity, 1)

    def test_shipment_item_cascade_delete(self):
        ShipmentItem.objects.create(
            shipment=self.shipment, product=self.product,
            quantity=1, unit_price=1.00,
        )
        self.assertEqual(ShipmentItem.objects.count(), 1)
        self.shipment.delete()
        self.assertEqual(ShipmentItem.objects.count(), 0)


# ──────────────────────────────────────────────
#  Shipment Serializers
# ──────────────────────────────────────────────

class ShipmentListSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        customer = Customer.objects.create(company_name="List Corp")
        cls.shipment = Shipment.objects.create(
            tracking_number="LST-01", customer=customer,
            destination_address="A", destination_city="NYC", destination_country="USA",
            shipping_cost=50.00,
        )

    def test_serializer_contains_expected_fields(self):
        serializer = ShipmentListSerializer(self.shipment)
        expected = {'id', 'tracking_number', 'customer_name', 'status',
                     'status_display', 'destination_city',
                     'scheduled_delivery', 'shipping_cost', 'created_at'}
        self.assertEqual(set(serializer.data.keys()), expected)

    def test_serializer_shows_customer_name(self):
        serializer = ShipmentListSerializer(self.shipment)
        self.assertEqual(serializer.data['customer_name'], "List Corp")


class ShipmentDetailSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        customer = Customer.objects.create(company_name="Detail Corp")
        warehouse = Warehouse.objects.create(name="Detail WH", code="DWH")
        product = Product.objects.create(sku="DTL-P", name="Detail Prod")
        cls.shipment = Shipment.objects.create(
            tracking_number="DTL-01", customer=customer,
            warehouse=warehouse,
            destination_address="Addr", destination_city="City",
            destination_country="Country",
        )
        ShipmentItem.objects.create(
            shipment=cls.shipment, product=product,
            quantity=5, unit_price=10.00,
        )

    def test_serializer_nested_customer_and_warehouse(self):
        serializer = ShipmentDetailSerializer(self.shipment)
        data = serializer.data
        self.assertIn('customer', data)
        self.assertIn('warehouse', data)
        self.assertEqual(data['customer']['company_name'], "Detail Corp")
        self.assertEqual(data['warehouse']['name'], "Detail WH")

    def test_serializer_nested_items(self):
        serializer = ShipmentDetailSerializer(self.shipment)
        self.assertIn('items', serializer.data)
        self.assertEqual(len(serializer.data['items']), 1)
        self.assertIn('product_name', serializer.data['items'][0])

    def test_serializer_status_display(self):
        serializer = ShipmentDetailSerializer(self.shipment)
        self.assertIn('status_display', serializer.data)


class ShipmentCreateSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.customer = Customer.objects.create(company_name="Create Corp")

    def test_valid_data(self):
        data = {
            'customer': self.customer.id,
            'destination_address': '123 Dest St',
            'destination_city': 'Chicago',
            'destination_country': 'USA',
        }
        serializer = ShipmentCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_customer(self):
        data = {
            'destination_address': 'Addr',
            'destination_city': 'City',
            'destination_country': 'Country',
        }
        serializer = ShipmentCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('customer', serializer.errors)

    def test_invalid_missing_destination(self):
        data = {'customer': self.customer.id}
        serializer = ShipmentCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('destination_address', serializer.errors)
        self.assertIn('destination_city', serializer.errors)
        self.assertIn('destination_country', serializer.errors)


class ShipmentItemSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.product = Product.objects.create(sku="SER-P", name="Serial Prod")
        customer = Customer.objects.create(company_name="SER C")
        cls.shipment = Shipment.objects.create(
            tracking_number="SER-01", customer=customer,
            destination_address="A", destination_city="C", destination_country="C",
        )

    def test_valid_item_data(self):
        data = {
            'product': self.product.id,
            'quantity': 2,
            'unit_price': 15.00,
        }
        serializer = ShipmentItemSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_product(self):
        data = {'quantity': 1, 'unit_price': 10.00}
        serializer = ShipmentItemSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('product', serializer.errors)

    def test_invalid_missing_unit_price(self):
        data = {'product': self.product.id, 'quantity': 1}
        serializer = ShipmentItemSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('unit_price', serializer.errors)


class ShipmentStatusUpdateSerializerTest(TestCase):
    def test_valid_status(self):
        data = {'status': 'in_transit'}
        serializer = ShipmentStatusUpdateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_status(self):
        data = {'status': 'invalid_status'}
        serializer = ShipmentStatusUpdateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('status', serializer.errors)


# ──────────────────────────────────────────────
#  Shipment API Endpoints
# ──────────────────────────────────────────────

class ShipmentAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('shipment-list')
        cls.admin_group, _ = Group.objects.get_or_create(name='admin')
        cls.manager_group, _ = Group.objects.get_or_create(name='manager')

        cls.admin_user = User.objects.create_user(
            username='admin', password='admin123'
        )
        cls.admin_user.groups.add(cls.admin_group)

        cls.readonly_user = User.objects.create_user(
            username='reader', password='reader123'
        )
        cls.readonly_user.groups.add(cls.manager_group)

        # FK dependencies
        cls.customer = Customer.objects.create(company_name="Ship Customer")
        cls.warehouse = Warehouse.objects.create(name="Ship WH", code="SWH")
        cls.product = Product.objects.create(sku="SHP-PROD", name="Ship Product")

    def setUp(self):
        self.client = APIClient()

    def _login(self, username, password):
        resp = self.client.post('/api/v1/auth/login/', {
            'username': username, 'password': password,
        }, format='json')
        token = resp.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _create_shipment(self, **overrides):
        data = {
            'tracking_number': 'TRK-' + str(hash(str(overrides)) % 1000000) if overrides else 'TRK-DEF',
            'customer': self.customer,
            'destination_address': '123 Dest St',
            'destination_city': 'Boston',
            'destination_country': 'USA',
        }
        data.update(overrides)
        # Generate unique tracking to avoid conflicts
        import uuid
        data['tracking_number'] = f"TRK-{uuid.uuid4().hex[:8]}"
        return Shipment.objects.create(**data)

    def _payload(self, **overrides):
        p = {
            'customer': self.customer.id,
            'destination_address': '123 Dest St',
            'destination_city': 'Boston',
            'destination_country': 'USA',
        }
        p.update(overrides)
        return p


class ShipmentUnauthenticatedTest(ShipmentAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        s = self._create_shipment()
        url = reverse('shipment-detail', args=[s.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tracking_returns_401(self):
        s = self._create_shipment()
        url = reverse('shipment-tracking', kwargs={'tracking_number': s.tracking_number})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class ShipmentListTest(ShipmentAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        self._create_shipment()
        self._create_shipment()
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)

    def test_list_uses_list_serializer(self):
        self._create_shipment()
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('tracking_number', result)
        self.assertIn('customer_name', result)
        self.assertIn('status_display', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class ShipmentCreateTest(ShipmentAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['destination_city'], "Boston")
        self.assertEqual(Shipment.objects.count(), 1)

    def test_create_missing_customer_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {
            'destination_address': 'Addr',
            'destination_city': 'City',
            'destination_country': 'Country',
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_warehouse(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(warehouse=self.warehouse.id), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)


class ShipmentDetailTest(ShipmentAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.shipment = self._create_shipment()

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['tracking_number'], self.shipment.tracking_number)

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class ShipmentTrackingTest(ShipmentAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.shipment = self._create_shipment()

    def test_tracking_found(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-tracking', kwargs={'tracking_number': self.shipment.tracking_number})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['tracking_number'], self.shipment.tracking_number)

    def test_tracking_not_found(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-tracking', kwargs={'tracking_number': 'NONEXISTENT'})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_tracking_readonly_user_can_access(self):
        self._login('reader', 'reader123')
        url = reverse('shipment-tracking', kwargs={'tracking_number': self.shipment.tracking_number})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class ShipmentUpdateStatusTest(ShipmentAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.shipment = self._create_shipment()
        self.status_url = reverse('shipment-update-status', args=[self.shipment.id])

    def test_admin_can_update_status(self):
        self._login('admin', 'admin123')
        r = self.client.patch(self.status_url, {'status': 'in_transit'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.shipment.refresh_from_db()
        self.assertEqual(self.shipment.status, "in_transit")

    def test_update_status_invalid_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.patch(self.status_url, {'status': 'bad_status'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_update_status(self):
        self._login('reader', 'reader123')
        r = self.client.patch(self.status_url, {'status': 'delivered'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_status_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-update-status', args=[9999])
        r = self.client.patch(url, {'status': 'delivered'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class ShipmentAddItemTest(ShipmentAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.shipment = self._create_shipment()
        self.items_url = reverse('shipment-add-item', args=[self.shipment.id])

    def test_admin_can_add_item(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.items_url, {
            'product': self.product.id,
            'quantity': 2,
            'unit_price': 25.00,
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ShipmentItem.objects.count(), 1)
        self.assertEqual(r.data['quantity'], 2)

    def test_add_item_missing_product_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.items_url, {
            'quantity': 1,
            'unit_price': 10.00,
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_add_item(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.items_url, {
            'product': self.product.id,
            'quantity': 1,
            'unit_price': 5.00,
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_item_nonexistent_shipment_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-add-item', args=[9999])
        r = self.client.post(url, {
            'product': self.product.id,
            'quantity': 1,
            'unit_price': 5.00,
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class ShipmentUpdateTest(ShipmentAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.shipment = self._create_shipment()

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        r = self.client.put(url, self._payload(destination_city='Chicago'), format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.shipment.refresh_from_db()
        self.assertEqual(self.shipment.destination_city, "Chicago")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        r = self.client.put(url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)


class ShipmentDeleteTest(ShipmentAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.shipment = self._create_shipment()

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Shipment.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('shipment-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_cascades_to_items(self):
        ShipmentItem.objects.create(
            shipment=self.shipment, product=self.product,
            quantity=1, unit_price=5.00,
        )
        self._login('admin', 'admin123')
        url = reverse('shipment-detail', args=[self.shipment.id])
        self.client.delete(url)
        self.assertEqual(ShipmentItem.objects.count(), 0)
