from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.driver.models import Driver
from apps.driver.serializers import (
    DriverListSerializer,
    DriverDetailSerializer,
    DriverCreateSerializer,
)


# ──────────────────────────────────────────────
#  Driver Model
# ──────────────────────────────────────────────

class DriverModelTest(TestCase):
    def test_create_driver_minimal(self):
        d = Driver.objects.create(license_number="LIC-001")
        self.assertEqual(d.license_number, "LIC-001")
        self.assertEqual(d.phone, "")
        self.assertEqual(d.email, "")
        self.assertTrue(d.is_available)
        self.assertIsNone(d.user)
        self.assertIsNotNone(d.created_at)
        self.assertIsNotNone(d.updated_at)

    def test_driver_str_returns_license_number(self):
        d = Driver.objects.create(license_number="ABC123")
        self.assertEqual(str(d), "ABC123")

    def test_create_driver_all_fields(self):
        user = User.objects.create_user(username="driver_user", password="pass")
        d = Driver.objects.create(
            user=user,
            license_number="LIC-999",
            phone="555-1234",
            email="driver@test.com",
            is_available=False,
        )
        self.assertEqual(d.user, user)
        self.assertEqual(d.license_number, "LIC-999")
        self.assertEqual(d.phone, "555-1234")
        self.assertEqual(d.email, "driver@test.com")
        self.assertFalse(d.is_available)

    def test_driver_default_is_available(self):
        d = Driver.objects.create(license_number="LIC-DEF")
        self.assertTrue(d.is_available)

    def test_driver_no_user_allowed(self):
        d = Driver.objects.create(license_number="LIC-NOUSER")
        self.assertIsNone(d.user)

    def test_driver_ordering(self):
        d1 = Driver.objects.create(license_number="C")
        d2 = Driver.objects.create(license_number="B")
        d3 = Driver.objects.create(license_number="A")
        qs = Driver.objects.all()
        self.assertEqual(qs[0].license_number, "A")
        self.assertEqual(qs[1].license_number, "B")
        self.assertEqual(qs[2].license_number, "C")


# ──────────────────────────────────────────────
#  Driver Serializers
# ──────────────────────────────────────────────

class DriverListSerializerTest(TestCase):
    def test_serializer_contains_expected_fields(self):
        d = Driver.objects.create(license_number="LST01", phone="555-0001", email="d@t.com")
        serializer = DriverListSerializer(d)
        expected = {'id', 'license_number', 'phone', 'email', 'is_available'}
        self.assertEqual(set(serializer.data.keys()), expected)

    def test_serializer_omits_user_field(self):
        d = Driver.objects.create(license_number="OMT01")
        serializer = DriverListSerializer(d)
        self.assertNotIn('user', serializer.data)
        self.assertNotIn('created_at', serializer.data)


class DriverDetailSerializerTest(TestCase):
    def test_serializer_all_fields(self):
        user = User.objects.create_user(username="det_user", password="pass")
        d = Driver.objects.create(
            user=user, license_number="DTL01",
            phone="555-9999", email="det@test.com",
            is_available=False,
        )
        serializer = DriverDetailSerializer(d)
        data = serializer.data
        self.assertEqual(data['license_number'], "DTL01")
        self.assertEqual(data['phone'], "555-9999")
        self.assertEqual(data['email'], "det@test.com")
        self.assertFalse(data['is_available'])
        self.assertIn('id', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)


class DriverCreateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {
            'license_number': 'NEW01',
            'phone': '555-7777',
            'email': 'new@driver.com',
            'is_available': True,
        }
        serializer = DriverCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_license_number(self):
        data = {'phone': '555-0000'}
        serializer = DriverCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('license_number', serializer.errors)

    def test_blank_optional_fields(self):
        data = {'license_number': 'MIN01'}
        serializer = DriverCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        d = serializer.save()
        self.assertEqual(d.license_number, "MIN01")
        self.assertEqual(d.phone, "")
        self.assertEqual(d.email, "")
        self.assertTrue(d.is_available)
        self.assertIsNone(d.user)


# ──────────────────────────────────────────────
#  Driver API Endpoints
# ──────────────────────────────────────────────

class DriverAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('driver-list')
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
            'license_number': 'LIC-TEST',
            'phone': '555-1111',
            'email': 'driver@test.com',
            'is_available': True,
        }
        p.update(overrides)
        return p


class DriverUnauthenticatedTest(DriverAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        d = Driver.objects.create(license_number="TMP")
        url = reverse('driver-detail', args=[d.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class DriverListTest(DriverAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        Driver.objects.create(license_number="D01")
        Driver.objects.create(license_number="D02")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)
        self.assertEqual(len(r.data['results']), 2)

    def test_list_uses_list_serializer(self):
        Driver.objects.create(license_number="L01", phone="555-0101", email="e@t.com")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('id', result)
        self.assertIn('license_number', result)
        self.assertIn('phone', result)
        self.assertIn('email', result)
        self.assertIn('is_available', result)
        self.assertNotIn('user', result)
        self.assertNotIn('created_at', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class DriverCreateTest(DriverAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(license_number="NEW01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['license_number'], "NEW01")
        self.assertEqual(Driver.objects.count(), 1)

    def test_create_missing_license_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'license_number': ''}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_only_required(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'license_number': 'MIN01'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)


class DriverDetailTest(DriverAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.driver = Driver.objects.create(license_number="DTL01")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['license_number'], "DTL01")

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('driver-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class DriverUpdateTest(DriverAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.driver = Driver.objects.create(license_number="OLD01")

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.put(url, self._payload(license_number="UPD01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.driver.refresh_from_db()
        self.assertEqual(self.driver.license_number, "UPD01")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.put(url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        self._login('admin', 'admin123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.patch(url, {'phone': '555-NEW'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.driver.refresh_from_db()
        self.assertEqual(self.driver.phone, "555-NEW")


class DriverDeleteTest(DriverAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.driver = Driver.objects.create(license_number="DEL01")

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Driver.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('driver-detail', args=[self.driver.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('driver-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
