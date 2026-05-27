from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.customer.models import Customer
from apps.customer.serializers import (
    CustomerListSerializer,
    CustomerDetailSerializer,
    CustomerCreateSerializer,
)


# ──────────────────────────────────────────────
#  Customer Model
# ──────────────────────────────────────────────

class CustomerModelTest(TestCase):
    def test_create_customer_minimal_fields(self):
        """Happy path: create customer with only required fields."""
        customer = Customer.objects.create(company_name="Test Corp")
        self.assertEqual(customer.company_name, "Test Corp")
        self.assertEqual(customer.contact_name, "")
        self.assertEqual(customer.email, "")
        self.assertEqual(customer.phone, "")
        self.assertEqual(customer.address, "")
        self.assertEqual(customer.city, "")
        self.assertEqual(customer.country, "")
        self.assertIsNone(customer.user)
        self.assertIsNotNone(customer.created_at)
        self.assertIsNotNone(customer.updated_at)

    def test_customer_str_returns_company_name(self):
        customer = Customer.objects.create(company_name="Acme Inc")
        self.assertEqual(str(customer), "Acme Inc")

    def test_create_customer_with_all_fields(self):
        user = User.objects.create_user(username="cust_user", password="pass")
        customer = Customer.objects.create(
            user=user,
            company_name="Full Corp",
            contact_name="John Doe",
            email="john@example.com",
            phone="123456789",
            address="123 Main St",
            city="New York",
            country="USA",
        )
        self.assertEqual(customer.company_name, "Full Corp")
        self.assertEqual(customer.contact_name, "John Doe")
        self.assertEqual(customer.email, "john@example.com")
        self.assertEqual(customer.phone, "123456789")
        self.assertEqual(customer.address, "123 Main St")
        self.assertEqual(customer.city, "New York")
        self.assertEqual(customer.country, "USA")
        self.assertEqual(customer.user, user)

    def test_customer_default_ordering(self):
        """Edge: ordering by -created_at."""
        c1 = Customer.objects.create(company_name="First")
        c2 = Customer.objects.create(company_name="Second")
        c3 = Customer.objects.create(company_name="Third")
        queryset = Customer.objects.all()
        self.assertEqual(queryset[0].company_name, "Third")
        self.assertEqual(queryset[1].company_name, "Second")
        self.assertEqual(queryset[2].company_name, "First")

    def test_customer_no_user_allowed(self):
        """Edge: user can be null."""
        customer = Customer.objects.create(company_name="No User Corp")
        self.assertIsNone(customer.user)

    def test_customer_company_name_max_length(self):
        """Edge: company_name at max length (255 chars)."""
        long_name = "A" * 255
        customer = Customer.objects.create(company_name=long_name)
        self.assertEqual(len(customer.company_name), 255)


# ──────────────────────────────────────────────
#  Customer Serializers
# ──────────────────────────────────────────────

class CustomerListSerializerTest(TestCase):
    def test_serializer_contains_expected_fields(self):
        customer = Customer.objects.create(
            company_name="List Corp",
            contact_name="Jane",
            email="jane@example.com",
            city="Boston",
        )
        serializer = CustomerListSerializer(customer)
        expected_fields = {'id', 'company_name', 'contact_name', 'email', 'city'}
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_serializer_does_not_include_address(self):
        customer = Customer.objects.create(company_name="Hidden")
        serializer = CustomerListSerializer(customer)
        self.assertNotIn('address', serializer.data)
        self.assertNotIn('phone', serializer.data)
        self.assertNotIn('country', serializer.data)
        self.assertNotIn('user', serializer.data)


class CustomerDetailSerializerTest(TestCase):
    def test_serializer_all_fields(self):
        user = User.objects.create_user(username="detail_user", password="pass")
        customer = Customer.objects.create(
            user=user,
            company_name="Detail Corp",
            contact_name="Bob",
            email="bob@example.com",
            phone="987654321",
            address="456 Oak St",
            city="Chicago",
            country="USA",
        )
        serializer = CustomerDetailSerializer(customer)
        data = serializer.data
        self.assertEqual(data['company_name'], "Detail Corp")
        self.assertEqual(data['contact_name'], "Bob")
        self.assertEqual(data['email'], "bob@example.com")
        self.assertEqual(data['phone'], "987654321")
        self.assertEqual(data['address'], "456 Oak St")
        self.assertEqual(data['city'], "Chicago")
        self.assertEqual(data['country'], "USA")
        self.assertIn('id', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)


class CustomerCreateSerializerTest(TestCase):
    def test_serializer_valid_data(self):
        data = {
            'company_name': 'New Corp',
            'contact_name': 'Alice',
            'email': 'alice@example.com',
            'phone': '5551234',
            'address': '789 Pine St',
            'city': 'Denver',
            'country': 'USA',
        }
        serializer = CustomerCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_invalid_no_company_name(self):
        """Unhappy: company_name is required."""
        data = {
            'contact_name': 'No Company',
        }
        serializer = CustomerCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('company_name', serializer.errors)

    def test_serializer_blank_fields_allowed(self):
        """Edge: all optional fields can be blank."""
        data = {
            'company_name': 'Sparse Corp',
        }
        serializer = CustomerCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        customer = serializer.save()
        self.assertEqual(customer.company_name, 'Sparse Corp')
        self.assertEqual(customer.contact_name, '')
        self.assertEqual(customer.email, '')
        self.assertEqual(customer.phone, '')
        self.assertEqual(customer.address, '')
        self.assertEqual(customer.city, '')
        self.assertEqual(customer.country, '')
        self.assertIsNone(customer.user)


# ──────────────────────────────────────────────
#  Customer API Endpoints
# ──────────────────────────────────────────────

class CustomerAPIBaseTest(TestCase):
    """Base class for Customer API tests with auth helpers."""

    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('customer-list')
        cls.admin_group, _ = Group.objects.get_or_create(name='admin')
        cls.manager_group, _ = Group.objects.get_or_create(name='manager')

        cls.admin_user = User.objects.create_user(
            username='admin', password='admin123', email='admin@test.com'
        )
        cls.admin_user.groups.add(cls.admin_group)

        cls.readonly_user = User.objects.create_user(
            username='reader', password='reader123', email='reader@test.com'
        )
        cls.readonly_user.groups.add(cls.manager_group)

    def setUp(self):
        self.client = APIClient()

    def _login(self, username, password):
        """Login and set auth header; return token."""
        response = self.client.post('/api/v1/auth/login/', {
            'username': username,
            'password': password,
        }, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return token

    def _create_customer_payload(self, **overrides):
        payload = {
            'company_name': 'Test Corp',
            'contact_name': 'Test Contact',
            'email': 'test@example.com',
            'phone': '123456789',
            'address': '123 Test St',
            'city': 'Test City',
            'country': 'Test Country',
        }
        payload.update(overrides)
        return payload


class CustomerUnauthenticatedTest(CustomerAPIBaseTest):
    def test_list_returns_401(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        response = self.client.post(self.list_url, self._create_customer_payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        customer = Customer.objects.create(company_name="Temp")
        url = reverse('customer-detail', args=[customer.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CustomerListTest(CustomerAPIBaseTest):
    def test_list_empty_returns_empty_results(self):
        self._login('admin', 'admin123')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(response.data['results'], [])

    def test_list_with_data_returns_paginated_results(self):
        Customer.objects.create(company_name="A Corp")
        Customer.objects.create(company_name="B Corp")
        self._login('admin', 'admin123')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(len(response.data['results']), 2)

    def test_list_uses_list_serializer_fields(self):
        Customer.objects.create(
            company_name="Visible Corp",
            contact_name="Vis",
            email="vis@example.com",
            city="NYC",
        )
        self._login('admin', 'admin123')
        response = self.client.get(self.list_url)
        result = response.data['results'][0]
        self.assertIn('id', result)
        self.assertIn('company_name', result)
        self.assertIn('contact_name', result)
        self.assertIn('email', result)
        self.assertIn('city', result)
        self.assertNotIn('address', result)
        self.assertNotIn('phone', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CustomerCreateTest(CustomerAPIBaseTest):
    def test_admin_can_create_customer(self):
        self._login('admin', 'admin123')
        payload = self._create_customer_payload(company_name="New Customer")
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['company_name'], "New Customer")
        self.assertEqual(Customer.objects.count(), 1)

    def test_create_without_company_name_returns_400(self):
        self._login('admin', 'admin123')
        payload = self._create_customer_payload(company_name="")
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('company_name', response.data)

    def test_readonly_user_cannot_create_returns_403(self):
        self._login('reader', 'reader123')
        payload = self._create_customer_payload(company_name="Blocked")
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_only_required_fields(self):
        """Edge: create with only company_name."""
        self._login('admin', 'admin123')
        payload = {'company_name': 'Minimal Corp'}
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['company_name'], 'Minimal Corp')


class CustomerDetailTest(CustomerAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.customer = Customer.objects.create(company_name="Detail Corp")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('customer-detail', args=[self.customer.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], "Detail Corp")

    def test_get_nonexistent_customer_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('customer-detail', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('customer-detail', args=[self.customer.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CustomerUpdateTest(CustomerAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.customer = Customer.objects.create(company_name="Old Corp")

    def test_admin_can_update_customer(self):
        self._login('admin', 'admin123')
        url = reverse('customer-detail', args=[self.customer.id])
        payload = self._create_customer_payload(company_name="Updated Corp")
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.company_name, "Updated Corp")

    def test_readonly_user_cannot_update_returns_403(self):
        self._login('reader', 'reader123')
        url = reverse('customer-detail', args=[self.customer.id])
        payload = self._create_customer_payload(company_name="Hacked Corp")
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_changes_only_sent_fields(self):
        self._login('admin', 'admin123')
        url = reverse('customer-detail', args=[self.customer.id])
        response = self.client.patch(url, {'contact_name': 'New Contact'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.contact_name, "New Contact")
        self.assertEqual(self.customer.company_name, "Old Corp")  # unchanged


class CustomerDeleteTest(CustomerAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.customer = Customer.objects.create(company_name="Delete Corp")

    def test_admin_can_delete_customer(self):
        self._login('admin', 'admin123')
        url = reverse('customer-detail', args=[self.customer.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Customer.objects.count(), 0)

    def test_readonly_user_cannot_delete_returns_403(self):
        self._login('reader', 'reader123')
        url = reverse('customer-detail', args=[self.customer.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('customer-detail', args=[9999])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
