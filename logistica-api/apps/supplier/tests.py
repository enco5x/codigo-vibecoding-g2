from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.supplier.models import Supplier
from apps.supplier.serializers import (
    SupplierListSerializer,
    SupplierDetailSerializer,
    SupplierCreateSerializer,
)


# ──────────────────────────────────────────────
#  Supplier Model
# ──────────────────────────────────────────────

class SupplierModelTest(TestCase):
    def test_create_supplier_minimal(self):
        s = Supplier.objects.create(company_name="Test Supplier")
        self.assertEqual(s.company_name, "Test Supplier")
        self.assertEqual(s.contact_name, "")
        self.assertEqual(s.email, "")
        self.assertEqual(s.phone, "")
        self.assertEqual(s.address, "")
        self.assertEqual(s.city, "")
        self.assertEqual(s.country, "")
        self.assertIsNotNone(s.created_at)
        self.assertIsNotNone(s.updated_at)

    def test_supplier_str_returns_company_name(self):
        s = Supplier.objects.create(company_name="Acme Supplies")
        self.assertEqual(str(s), "Acme Supplies")

    def test_create_supplier_all_fields(self):
        s = Supplier.objects.create(
            company_name="Full Supplier",
            contact_name="Jane Doe",
            email="jane@supplier.com",
            phone="555-0100",
            address="100 Industrial Blvd",
            city="Detroit",
            country="USA",
        )
        self.assertEqual(s.company_name, "Full Supplier")
        self.assertEqual(s.contact_name, "Jane Doe")
        self.assertEqual(s.email, "jane@supplier.com")
        self.assertEqual(s.phone, "555-0100")
        self.assertEqual(s.address, "100 Industrial Blvd")
        self.assertEqual(s.city, "Detroit")
        self.assertEqual(s.country, "USA")

    def test_supplier_ordering(self):
        s1 = Supplier.objects.create(company_name="A")
        s2 = Supplier.objects.create(company_name="B")
        s3 = Supplier.objects.create(company_name="C")
        qs = Supplier.objects.all()
        self.assertEqual(qs[0].company_name, "C")
        self.assertEqual(qs[1].company_name, "B")
        self.assertEqual(qs[2].company_name, "A")

    def test_supplier_company_name_max_length(self):
        long_name = "A" * 255
        s = Supplier.objects.create(company_name=long_name)
        self.assertEqual(len(s.company_name), 255)


# ──────────────────────────────────────────────
#  Supplier Serializers
# ──────────────────────────────────────────────

class SupplierListSerializerTest(TestCase):
    def test_serializer_contains_expected_fields(self):
        s = Supplier.objects.create(
            company_name="List Supplier",
            contact_name="Contact",
            email="c@test.com",
            city="Chicago",
        )
        serializer = SupplierListSerializer(s)
        expected = {'id', 'company_name', 'contact_name', 'email', 'city'}
        self.assertEqual(set(serializer.data.keys()), expected)

    def test_serializer_omits_address_and_phone(self):
        s = Supplier.objects.create(company_name="Omit Supplier")
        serializer = SupplierListSerializer(s)
        self.assertNotIn('address', serializer.data)
        self.assertNotIn('phone', serializer.data)
        self.assertNotIn('country', serializer.data)


class SupplierDetailSerializerTest(TestCase):
    def test_serializer_all_fields(self):
        s = Supplier.objects.create(
            company_name="Detail Supplier",
            contact_name="Bob",
            email="bob@test.com",
            phone="1234",
            address="1 Detail St",
            city="NYC",
            country="USA",
        )
        serializer = SupplierDetailSerializer(s)
        data = serializer.data
        self.assertEqual(data['company_name'], "Detail Supplier")
        self.assertEqual(data['contact_name'], "Bob")
        self.assertEqual(data['email'], "bob@test.com")
        self.assertEqual(data['phone'], "1234")
        self.assertEqual(data['address'], "1 Detail St")
        self.assertEqual(data['city'], "NYC")
        self.assertEqual(data['country'], "USA")
        self.assertIn('id', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)


class SupplierCreateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {
            'company_name': 'New Supplier',
            'contact_name': 'Alice',
            'email': 'alice@supplier.com',
            'phone': '555-9999',
            'address': '200 New St',
            'city': 'Boston',
            'country': 'USA',
        }
        serializer = SupplierCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_company_name(self):
        data = {'contact_name': 'No Company'}
        serializer = SupplierCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('company_name', serializer.errors)

    def test_blank_optional_fields(self):
        data = {'company_name': 'Sparse Supplier'}
        serializer = SupplierCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        s = serializer.save()
        self.assertEqual(s.company_name, "Sparse Supplier")
        self.assertEqual(s.contact_name, "")
        self.assertEqual(s.email, "")
        self.assertEqual(s.phone, "")
        self.assertEqual(s.address, "")
        self.assertEqual(s.city, "")
        self.assertEqual(s.country, "")


# ──────────────────────────────────────────────
#  Supplier API Endpoints
# ──────────────────────────────────────────────

class SupplierAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('supplier-list')
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
            'company_name': 'Test Supplier',
            'contact_name': 'Test Contact',
            'email': 'test@supplier.com',
            'phone': '555-0000',
            'address': '123 Supplier St',
            'city': 'Test City',
            'country': 'Test Country',
        }
        p.update(overrides)
        return p


class SupplierUnauthenticatedTest(SupplierAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        s = Supplier.objects.create(company_name="Temp")
        url = reverse('supplier-detail', args=[s.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class SupplierListTest(SupplierAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        Supplier.objects.create(company_name="S1")
        Supplier.objects.create(company_name="S2")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)
        self.assertEqual(len(r.data['results']), 2)

    def test_list_uses_list_serializer(self):
        Supplier.objects.create(company_name="S", contact_name="C", email="e@e.com", city="NYC")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('id', result)
        self.assertIn('company_name', result)
        self.assertIn('contact_name', result)
        self.assertIn('email', result)
        self.assertIn('city', result)
        self.assertNotIn('address', result)
        self.assertNotIn('phone', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class SupplierCreateTest(SupplierAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(company_name="New Supplier"), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['company_name'], "New Supplier")
        self.assertEqual(Supplier.objects.count(), 1)

    def test_create_missing_company_name_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(company_name=""), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_only_required(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'company_name': 'Min'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)


class SupplierDetailTest(SupplierAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.supplier = Supplier.objects.create(company_name="Detail Supplier")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['company_name'], "Detail Supplier")

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('supplier-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class SupplierUpdateTest(SupplierAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.supplier = Supplier.objects.create(company_name="Old Supplier")

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.put(url, self._payload(company_name="Updated"), format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.supplier.refresh_from_db()
        self.assertEqual(self.supplier.company_name, "Updated")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.put(url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        self._login('admin', 'admin123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.patch(url, {'city': 'New City'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.supplier.refresh_from_db()
        self.assertEqual(self.supplier.city, "New City")


class SupplierDeleteTest(SupplierAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.supplier = Supplier.objects.create(company_name="Delete Supplier")

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Supplier.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('supplier-detail', args=[self.supplier.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('supplier-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
