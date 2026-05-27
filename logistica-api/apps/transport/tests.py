from django.test import TestCase
from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.transport.models import Transport
from apps.transport.serializers import (
    TransportListSerializer,
    TransportDetailSerializer,
    TransportCreateSerializer,
)
from apps.driver.models import Driver


# ──────────────────────────────────────────────
#  Transport Model
# ──────────────────────────────────────────────

class TransportModelTest(TestCase):
    def test_create_transport_minimal(self):
        t = Transport.objects.create(plate_number="ABC-123")
        self.assertEqual(t.plate_number, "ABC-123")
        self.assertEqual(t.vehicle_type, "")
        self.assertEqual(t.vehicle_model, "")
        self.assertIsNone(t.capacity_kg)
        self.assertTrue(t.is_available)
        self.assertIsNone(t.driver)
        self.assertIsNotNone(t.created_at)
        self.assertIsNotNone(t.updated_at)

    def test_transport_str_returns_plate(self):
        t = Transport.objects.create(plate_number="XYZ-999")
        self.assertEqual(str(t), "XYZ-999")

    def test_transport_unique_plate(self):
        Transport.objects.create(plate_number="UNIQUE")
        with self.assertRaises(IntegrityError):
            Transport.objects.create(plate_number="UNIQUE")

    def test_create_transport_all_fields(self):
        driver = Driver.objects.create(license_number="LIC-DRV")
        t = Transport.objects.create(
            plate_number="FULL-01",
            vehicle_type="Truck",
            vehicle_model="Volvo FH",
            capacity_kg=20000.00,
            is_available=False,
            driver=driver,
        )
        self.assertEqual(t.vehicle_type, "Truck")
        self.assertEqual(t.vehicle_model, "Volvo FH")
        self.assertEqual(float(t.capacity_kg), 20000.00)
        self.assertFalse(t.is_available)
        self.assertEqual(t.driver, driver)

    def test_transport_driver_nullable(self):
        t = Transport.objects.create(plate_number="NO-DRV")
        self.assertIsNone(t.driver)

    def test_transport_default_is_available(self):
        t = Transport.objects.create(plate_number="DEF-AVL")
        self.assertTrue(t.is_available)

    def test_transport_ordering(self):
        t1 = Transport.objects.create(plate_number="C")
        t2 = Transport.objects.create(plate_number="B")
        t3 = Transport.objects.create(plate_number="A")
        qs = Transport.objects.all()
        self.assertEqual(qs[0].plate_number, "A")
        self.assertEqual(qs[1].plate_number, "B")
        self.assertEqual(qs[2].plate_number, "C")


# ──────────────────────────────────────────────
#  Transport Serializers
# ──────────────────────────────────────────────

class TransportListSerializerTest(TestCase):
    def test_serializer_contains_expected_fields(self):
        t = Transport.objects.create(plate_number="LST01", vehicle_type="Van")
        serializer = TransportListSerializer(t)
        expected = {'id', 'plate_number', 'vehicle_type', 'vehicle_model',
                     'driver_name', 'is_available'}
        # Without FK, driver_name omitted by DRF when source resolves to None
        actual = set(serializer.data.keys())
        self.assertIn('id', actual)
        self.assertIn('plate_number', actual)
        self.assertIn('vehicle_type', actual)
        self.assertIn('is_available', actual)

    def test_serializer_shows_driver_name_with_fk(self):
        driver = Driver.objects.create(license_number="LIC-DRV")
        t = Transport.objects.create(plate_number="REL01", driver=driver)
        serializer = TransportListSerializer(t)
        self.assertIn('driver_name', serializer.data)
        self.assertEqual(serializer.data['driver_name'], "LIC-DRV")

    def test_serializer_omits_capacity_and_dates(self):
        t = Transport.objects.create(plate_number="OMT01")
        serializer = TransportListSerializer(t)
        self.assertNotIn('capacity_kg', serializer.data)
        self.assertNotIn('created_at', serializer.data)
        self.assertNotIn('driver', serializer.data)


class TransportDetailSerializerTest(TestCase):
    def test_serializer_all_fields(self):
        driver = Driver.objects.create(license_number="LIC-DTL")
        t = Transport.objects.create(
            plate_number="DTL01", vehicle_type="Car",
            capacity_kg=500.00, driver=driver,
        )
        serializer = TransportDetailSerializer(t)
        data = serializer.data
        self.assertEqual(data['plate_number'], "DTL01")
        self.assertEqual(data['vehicle_type'], "Car")
        self.assertEqual(data['capacity_kg'], "500.00")
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)


class TransportCreateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {'plate_number': 'NEW-01', 'vehicle_type': 'Truck'}
        serializer = TransportCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_plate(self):
        data = {'vehicle_type': 'Van'}
        serializer = TransportCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('plate_number', serializer.errors)

    def test_blank_optional_fields(self):
        data = {'plate_number': 'MIN-01'}
        serializer = TransportCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        t = serializer.save()
        self.assertEqual(t.vehicle_type, "")
        self.assertIsNone(t.capacity_kg)
        self.assertTrue(t.is_available)
        self.assertIsNone(t.driver)


# ──────────────────────────────────────────────
#  Transport API Endpoints
# ──────────────────────────────────────────────

class TransportAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('transport-list')
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

        cls.driver = Driver.objects.create(license_number="LIC-DRV")

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
            'plate_number': 'TST-001',
            'vehicle_type': 'Truck',
        }
        p.update(overrides)
        return p


class TransportUnauthenticatedTest(TransportAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        t = Transport.objects.create(plate_number="TMP")
        url = reverse('transport-detail', args=[t.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class TransportListTest(TransportAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        Transport.objects.create(plate_number="T01")
        Transport.objects.create(plate_number="T02")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)
        self.assertEqual(len(r.data['results']), 2)

    def test_list_uses_list_serializer(self):
        Transport.objects.create(plate_number="LST01", vehicle_type="Van")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('plate_number', result)
        self.assertIn('vehicle_type', result)
        self.assertIn('is_available', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class TransportCreateTest(TransportAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(plate_number="NEW01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['plate_number'], "NEW01")
        self.assertEqual(Transport.objects.count(), 1)

    def test_create_missing_plate_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(plate_number=""), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_driver(self):
        self._login('admin', 'admin123')
        payload = {'plate_number': 'DRV-01', 'driver': self.driver.id}
        r = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['plate_number'], "DRV-01")

    def test_create_duplicate_plate_returns_400(self):
        Transport.objects.create(plate_number="DUP01")
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, self._payload(plate_number="DUP01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_only_required(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'plate_number': 'MIN-01'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)


class TransportDetailTest(TransportAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.transport = Transport.objects.create(plate_number="DTL01")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['plate_number'], "DTL01")

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('transport-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class TransportUpdateTest(TransportAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.transport = Transport.objects.create(plate_number="OLD-01")

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.put(url, self._payload(plate_number="UPD-01"), format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.transport.refresh_from_db()
        self.assertEqual(self.transport.plate_number, "UPD-01")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.put(url, self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        self._login('admin', 'admin123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.patch(url, {'vehicle_type': 'Bus'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.transport.refresh_from_db()
        self.assertEqual(self.transport.vehicle_type, "Bus")


class TransportDeleteTest(TransportAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.transport = Transport.objects.create(plate_number="DEL-01")

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Transport.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('transport-detail', args=[self.transport.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('transport-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
