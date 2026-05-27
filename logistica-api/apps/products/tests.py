from django.test import TestCase
from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.products.models import Product
from apps.products.serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
)
from apps.supplier.models import Supplier
from apps.warehouse.models import Warehouse


# ──────────────────────────────────────────────
#  Product Model
# ──────────────────────────────────────────────

class ProductModelTest(TestCase):
    def test_create_product_minimal(self):
        p = Product.objects.create(sku="SKU-001", name="Test Product")
        self.assertEqual(p.sku, "SKU-001")
        self.assertEqual(p.name, "Test Product")
        self.assertEqual(p.description, "")
        self.assertEqual(p.category, "")
        self.assertEqual(p.unit_price, 0.00)
        self.assertIsNone(p.supplier)
        self.assertIsNone(p.warehouse)
        self.assertEqual(p.stock_quantity, 0)
        self.assertIsNone(p.weight_kg)
        self.assertEqual(p.dimensions, "")
        self.assertTrue(p.is_active)

    def test_product_str_returns_name(self):
        p = Product.objects.create(sku="S1", name="Gadget")
        self.assertEqual(str(p), "Gadget")

    def test_product_unique_sku(self):
        Product.objects.create(sku="UNIQUE", name="First")
        with self.assertRaises(IntegrityError):
            Product.objects.create(sku="UNIQUE", name="Second")

    def test_create_product_all_fields(self):
        supplier = Supplier.objects.create(company_name="Supp")
        warehouse = Warehouse.objects.create(name="WH", code="W01")
        p = Product.objects.create(
            sku="FULL01",
            name="Full Product",
            description="A full product",
            category="Electronics",
            unit_price=99.99,
            supplier=supplier,
            warehouse=warehouse,
            stock_quantity=50,
            weight_kg=1.5,
            dimensions="10x5x3",
            is_active=False,
        )
        self.assertEqual(p.unit_price, 99.99)
        self.assertEqual(p.supplier, supplier)
        self.assertEqual(p.warehouse, warehouse)
        self.assertEqual(p.stock_quantity, 50)
        self.assertEqual(p.weight_kg, 1.5)
        self.assertFalse(p.is_active)

    def test_product_supplier_warehouse_nullable(self):
        p = Product.objects.create(sku="NULL01", name="Null FK")
        self.assertIsNone(p.supplier)
        self.assertIsNone(p.warehouse)

    def test_product_ordering(self):
        p1 = Product.objects.create(sku="C", name="C")
        p2 = Product.objects.create(sku="B", name="B")
        p3 = Product.objects.create(sku="A", name="A")
        qs = Product.objects.all()
        self.assertEqual(qs[0].sku, "A")
        self.assertEqual(qs[1].sku, "B")
        self.assertEqual(qs[2].sku, "C")


# ──────────────────────────────────────────────
#  Product Serializers
# ──────────────────────────────────────────────

class ProductListSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.supplier = Supplier.objects.create(company_name="Best Supplier")
        cls.warehouse = Warehouse.objects.create(name="Main WH", code="WH01")

    def test_serializer_contains_expected_fields(self):
        p = Product.objects.create(
            sku="LST01", name="List Product", category="Cat",
            supplier=self.supplier, warehouse=self.warehouse,
        )
        serializer = ProductListSerializer(p)
        expected = {'id', 'sku', 'name', 'category', 'unit_price',
                     'stock_quantity', 'is_active', 'supplier_name', 'warehouse_name'}
        self.assertEqual(set(serializer.data.keys()), expected)

    def test_serializer_shows_supplier_and_warehouse_names(self):
        p = Product.objects.create(
            sku="REL01", name="Rel Product",
            supplier=self.supplier, warehouse=self.warehouse,
        )
        serializer = ProductListSerializer(p)
        self.assertEqual(serializer.data['supplier_name'], "Best Supplier")
        self.assertEqual(serializer.data['warehouse_name'], "Main WH")

    def test_serializer_null_fk_omits_related_fields(self):
        p = Product.objects.create(sku="NULLREL", name="No Relation")
        serializer = ProductListSerializer(p)
        # DRF omits read-only source fields when FK is null
        self.assertNotIn('supplier_name', serializer.data)
        self.assertNotIn('warehouse_name', serializer.data)


class ProductDetailSerializerTest(TestCase):
    def test_serializer_all_fields(self):
        supplier = Supplier.objects.create(company_name="S")
        warehouse = Warehouse.objects.create(name="W", code="W01")
        p = Product.objects.create(
            sku="DTL01", name="Detail", unit_price=25.00,
            supplier=supplier, warehouse=warehouse,
        )
        serializer = ProductDetailSerializer(p)
        data = serializer.data
        self.assertEqual(data['sku'], "DTL01")
        self.assertEqual(data['unit_price'], "25.00")
        self.assertEqual(data['stock_quantity'], 0)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)


class ProductCreateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {'sku': 'NEW01', 'name': 'New Product', 'unit_price': 10.00}
        serializer = ProductCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_sku(self):
        data = {'name': 'No SKU'}
        serializer = ProductCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('sku', serializer.errors)

    def test_invalid_missing_name(self):
        data = {'sku': 'NONAME'}
        serializer = ProductCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_blank_optional_fields(self):
        data = {'sku': 'MIN01', 'name': 'Minimal'}
        serializer = ProductCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        p = serializer.save()
        self.assertEqual(p.description, "")
        self.assertEqual(p.category, "")
        self.assertEqual(p.unit_price, 0.00)
        self.assertIsNone(p.supplier)
        self.assertIsNone(p.warehouse)
        self.assertEqual(p.stock_quantity, 0)
        self.assertIsNone(p.weight_kg)
        self.assertEqual(p.dimensions, "")


# ──────────────────────────────────────────────
#  Product API Endpoints
# ──────────────────────────────────────────────

class ProductAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('product-list')
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
        cls.supplier = Supplier.objects.create(company_name="Test Supplier")
        cls.warehouse = Warehouse.objects.create(name="Test WH", code="TWH")

    def setUp(self):
        self.client = APIClient()

    def _login(self, username, password):
        resp = self.client.post('/api/v1/auth/login/', {
            'username': username, 'password': password,
        }, format='json')
        token = resp.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _payload(self, **overrides):
        p = {
            'sku': 'TST001',
            'name': 'Test Product',
            'unit_price': 19.99,
        }
        p.update(overrides)
        return p


class ProductUnauthenticatedTest(ProductAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        p = Product.objects.create(sku="TMP", name="Temp")
        url = reverse('product-detail', args=[p.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_by_sku_returns_401(self):
        Product.objects.create(sku="BYSKU", name="Test")
        url = reverse('product-by-sku', kwargs={'sku': 'BYSKU'})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class ProductListTest(ProductAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        Product.objects.create(sku="P01", name="P1")
        Product.objects.create(sku="P02", name="P2")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)
        self.assertEqual(len(r.data['results']), 2)

    def test_list_uses_list_serializer(self):
        Product.objects.create(
            sku="LST01", name="List", category="Cat",
            supplier=self.supplier, warehouse=self.warehouse,
        )
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('sku', result)
        self.assertIn('supplier_name', result)
        self.assertIn('warehouse_name', result)
        self.assertEqual(result['supplier_name'], "Test Supplier")

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class ProductCreateTest(ProductAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(sku="NEW01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['sku'], "NEW01")
        self.assertEqual(Product.objects.count(), 1)

    def test_create_missing_sku_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(sku=""), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_supplier_and_warehouse(self):
        self._login('admin', 'admin123')
        payload = {
            'sku': 'FK001',
            'name': 'With FK',
            'unit_price': 5.00,
            'supplier': self.supplier.id,
            'warehouse': self.warehouse.id,
        }
        r = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['sku'], "FK001")

    def test_create_duplicate_sku_returns_400(self):
        Product.objects.create(sku="DUP01", name="Existing")
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(sku="DUP01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_only_required(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'sku': 'MIN01', 'name': 'Min'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)


class ProductDetailTest(ProductAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.product = Product.objects.create(sku="DTL01", name="Detail Product")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['sku'], "DTL01")

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('product-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class ProductBySkuTest(ProductAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.product = Product.objects.create(sku="BYSKU", name="By SKU Product")

    def test_by_sku_found(self):
        self._login('admin', 'admin123')
        url = reverse('product-by-sku', kwargs={'sku': 'BYSKU'})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['sku'], "BYSKU")

    def test_by_sku_not_found(self):
        self._login('admin', 'admin123')
        url = reverse('product-by-sku', kwargs={'sku': 'NONEXIST'})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_readonly_user_can_by_sku(self):
        self._login('reader', 'reader123')
        url = reverse('product-by-sku', kwargs={'sku': 'BYSKU'})
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class ProductUpdateTest(ProductAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.product = Product.objects.create(sku="OLD01", name="Old Product")

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.put(url, {'sku': 'UPD01', 'name': 'Updated'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, "Updated")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.put(url, {'sku': 'HACK', 'name': 'Hacked'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        self._login('admin', 'admin123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.patch(url, {'unit_price': 49.99}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(float(self.product.unit_price), 49.99)


class ProductDeleteTest(ProductAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.product = Product.objects.create(sku="DEL01", name="Delete Product")

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('product-detail', args=[self.product.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('product-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
