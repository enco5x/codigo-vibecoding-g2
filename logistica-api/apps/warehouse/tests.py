from django.test import TestCase
from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.warehouse.models import Warehouse
from apps.warehouse.serializers import (
    WarehouseListSerializer,
    WarehouseDetailSerializer,
    WarehouseCreateSerializer,
)


# ──────────────────────────────────────────────
#  Warehouse Model
# ──────────────────────────────────────────────

class WarehouseModelTest(TestCase):
    def test_create_warehouse_minimal(self):
        w = Warehouse.objects.create(name="Main WH", code="WH-001")
        self.assertEqual(w.name, "Main WH")
        self.assertEqual(w.code, "WH-001")
        self.assertEqual(w.address, "")
        self.assertEqual(w.city, "")
        self.assertEqual(w.country, "")
        self.assertIsNone(w.capacity)
        self.assertTrue(w.is_active)
        self.assertIsNotNone(w.created_at)
        self.assertIsNotNone(w.updated_at)

    def test_warehouse_str_returns_name(self):
        w = Warehouse.objects.create(name="Test Warehouse", code="TW01")
        self.assertEqual(str(w), "Test Warehouse")

    def test_warehouse_unique_code(self):
        Warehouse.objects.create(name="First", code="UNIQUE")
        with self.assertRaises(IntegrityError):
            Warehouse.objects.create(name="Second", code="UNIQUE")

    def test_warehouse_all_fields(self):
        w = Warehouse.objects.create(
            name="Full WH",
            code="FULL01",
            address="123 Warehouse Ln",
            city="Houston",
            country="USA",
            capacity=5000,
            is_active=False,
        )
        self.assertEqual(w.address, "123 Warehouse Ln")
        self.assertEqual(w.city, "Houston")
        self.assertEqual(w.country, "USA")
        self.assertEqual(w.capacity, 5000)
        self.assertFalse(w.is_active)

    def test_warehouse_capacity_null(self):
        w = Warehouse.objects.create(name="Null Cap", code="NULL01")
        self.assertIsNone(w.capacity)

    def test_warehouse_default_is_active(self):
        w = Warehouse.objects.create(name="Active WH", code="ACT01")
        self.assertTrue(w.is_active)

    def test_warehouse_ordering(self):
        w1 = Warehouse.objects.create(name="A", code="C01")
        w2 = Warehouse.objects.create(name="B", code="C02")
        w3 = Warehouse.objects.create(name="C", code="C03")
        qs = Warehouse.objects.all()
        self.assertEqual(qs[0].code, "C03")
        self.assertEqual(qs[1].code, "C02")
        self.assertEqual(qs[2].code, "C01")


# ──────────────────────────────────────────────
#  Warehouse Serializers
# ──────────────────────────────────────────────

class WarehouseListSerializerTest(TestCase):
    def test_serializer_contains_expected_fields(self):
        w = Warehouse.objects.create(name="List WH", code="LST01", city="Austin")
        serializer = WarehouseListSerializer(w)
        expected = {'id', 'name', 'code', 'city', 'is_active'}
        self.assertEqual(set(serializer.data.keys()), expected)

    def test_serializer_omits_detail_fields(self):
        w = Warehouse.objects.create(name="Omit WH", code="OMT01")
        serializer = WarehouseListSerializer(w)
        self.assertNotIn('address', serializer.data)
        self.assertNotIn('country', serializer.data)
        self.assertNotIn('capacity', serializer.data)


class WarehouseDetailSerializerTest(TestCase):
    def test_serializer_all_fields(self):
        w = Warehouse.objects.create(
            name="Detail WH", code="DTL01",
            address="1 Detail St", city="Dallas", country="USA",
            capacity=1000,
        )
        serializer = WarehouseDetailSerializer(w)
        data = serializer.data
        self.assertEqual(data['name'], "Detail WH")
        self.assertEqual(data['code'], "DTL01")
        self.assertEqual(data['address'], "1 Detail St")
        self.assertEqual(data['city'], "Dallas")
        self.assertEqual(data['country'], "USA")
        self.assertEqual(data['capacity'], 1000)
        self.assertIn('is_active', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)


class WarehouseCreateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {
            'name': 'New WH',
            'code': 'NW01',
            'address': '456 Factory Rd',
            'city': 'Phoenix',
            'country': 'USA',
            'capacity': 2000,
        }
        serializer = WarehouseCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_name(self):
        data = {'code': 'NONAME'}
        serializer = WarehouseCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_invalid_missing_code(self):
        data = {'name': 'No Code'}
        serializer = WarehouseCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)

    def test_blank_optional_fields(self):
        data = {'name': 'Sparse WH', 'code': 'SPR01'}
        serializer = WarehouseCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        w = serializer.save()
        self.assertEqual(w.name, "Sparse WH")
        self.assertEqual(w.address, "")
        self.assertEqual(w.city, "")
        self.assertEqual(w.country, "")
        self.assertIsNone(w.capacity)
        self.assertTrue(w.is_active)


# ──────────────────────────────────────────────
#  Warehouse API Endpoints
# ──────────────────────────────────────────────

class WarehouseAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('warehouse-list')
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
            'name': 'Test WH',
            'code': 'TWH01',
            'address': '123 WH St',
            'city': 'Test City',
            'country': 'Test Country',
            'capacity': 1000,
        }
        p.update(overrides)
        return p


class WarehouseUnauthenticatedTest(WarehouseAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        w = Warehouse.objects.create(name="Temp", code="TMP")
        url = reverse('warehouse-detail', args=[w.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class WarehouseListTest(WarehouseAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        Warehouse.objects.create(name="WH1", code="W01")
        Warehouse.objects.create(name="WH2", code="W02")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)
        self.assertEqual(len(r.data['results']), 2)

    def test_list_uses_list_serializer(self):
        Warehouse.objects.create(name="WH", code="W01", city="NYC")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('id', result)
        self.assertIn('name', result)
        self.assertIn('code', result)
        self.assertIn('city', result)
        self.assertIn('is_active', result)
        self.assertNotIn('address', result)
        self.assertNotIn('country', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class WarehouseCreateTest(WarehouseAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(name="New WH"), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['name'], "New WH")
        self.assertEqual(Warehouse.objects.count(), 1)

    def test_create_missing_name_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(name=""), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_code_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(code=""), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_duplicate_code_returns_400(self):
        Warehouse.objects.create(name="Existing", code="DUP01")
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(code="DUP01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_only_required(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'name': 'Min WH', 'code': 'MIN01'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['name'], "Min WH")


class WarehouseDetailTest(WarehouseAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.warehouse = Warehouse.objects.create(name="Detail WH", code="DTL01")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['name'], "Detail WH")

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('warehouse-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class WarehouseUpdateTest(WarehouseAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.warehouse = Warehouse.objects.create(name="Old WH", code="OLD01")

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.put(url, self._payload(name="Updated WH"), format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.warehouse.refresh_from_db()
        self.assertEqual(self.warehouse.name, "Updated WH")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.put(url, self._payload(name="Hacked WH"), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        self._login('admin', 'admin123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.patch(url, {'city': 'New City'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.warehouse.refresh_from_db()
        self.assertEqual(self.warehouse.city, "New City")


class WarehouseDeleteTest(WarehouseAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.warehouse = Warehouse.objects.create(name="Delete WH", code="DEL01")

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Warehouse.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('warehouse-detail', args=[self.warehouse.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('warehouse-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
