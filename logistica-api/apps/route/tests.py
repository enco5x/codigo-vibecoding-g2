from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from apps.route.models import Route, RouteStop
from apps.route.serializers import (
    RouteListSerializer,
    RouteDetailSerializer,
    RouteCreateSerializer,
    RouteStopSerializer,
)
from apps.driver.models import Driver
from apps.transport.models import Transport


# ──────────────────────────────────────────────
#  Route Model
# ──────────────────────────────────────────────

class RouteModelTest(TestCase):
    def test_create_route_minimal(self):
        r = Route.objects.create(name="Test Route")
        self.assertEqual(r.name, "Test Route")
        self.assertEqual(r.status, "pending")
        self.assertIsNone(r.transport)
        self.assertIsNone(r.estimated_start)
        self.assertIsNone(r.actual_start)
        self.assertIsNotNone(r.created_at)

    def test_route_str_returns_name(self):
        r = Route.objects.create(name="Main Route")
        self.assertEqual(str(r), "Main Route")

    def test_route_default_status(self):
        r = Route.objects.create(name="Default Status")
        self.assertEqual(r.status, "pending")

    def test_create_route_all_fields(self):
        driver = Driver.objects.create(license_number="LIC-RT")
        transport = Transport.objects.create(plate_number="RT-001", driver=driver)
        r = Route.objects.create(
            name="Full Route",
            transport=transport,
            status="in_progress",
            estimated_start="2026-06-01T08:00:00Z",
            estimated_end="2026-06-01T18:00:00Z",
        )
        self.assertEqual(r.transport, transport)
        self.assertEqual(r.status, "in_progress")
        self.assertIsNotNone(r.estimated_start)

    def test_route_transport_nullable(self):
        r = Route.objects.create(name="No Transport")
        self.assertIsNone(r.transport)

    def test_route_ordering(self):
        r1 = Route.objects.create(name="C")
        r2 = Route.objects.create(name="B")
        r3 = Route.objects.create(name="A")
        qs = Route.objects.all()
        self.assertEqual(qs[0].name, "A")
        self.assertEqual(qs[1].name, "B")
        self.assertEqual(qs[2].name, "C")


class RouteStopModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.route = Route.objects.create(name="Stop Route")

    def test_create_route_stop_minimal(self):
        s = RouteStop.objects.create(route=self.route, order=1)
        self.assertEqual(s.order, 1)
        self.assertEqual(s.status, "pending")
        self.assertEqual(s.address, "")
        self.assertEqual(s.city, "")
        self.assertIsNone(s.estimated_arrival)

    def test_route_stop_str(self):
        s = RouteStop.objects.create(route=self.route, order=2)
        self.assertIn("Stop Route", str(s))
        self.assertIn("Stop 2", str(s))

    def test_route_stop_all_fields(self):
        s = RouteStop.objects.create(
            route=self.route, order=3,
            address="456 Stop St", city="Dallas",
            estimated_arrival="2026-06-01T12:00:00Z",
            status="completed",
            notes="Delivered",
        )
        self.assertEqual(s.address, "456 Stop St")
        self.assertEqual(s.city, "Dallas")
        self.assertEqual(s.status, "completed")
        self.assertEqual(s.notes, "Delivered")

    def test_route_stop_default_status(self):
        s = RouteStop.objects.create(route=self.route, order=5)
        self.assertEqual(s.status, "pending")

    def test_route_stop_cascade_delete(self):
        RouteStop.objects.create(route=self.route, order=1)
        self.assertEqual(RouteStop.objects.count(), 1)
        self.route.delete()
        self.assertEqual(RouteStop.objects.count(), 0)

    def test_route_stop_ordering(self):
        RouteStop.objects.create(route=self.route, order=3)
        RouteStop.objects.create(route=self.route, order=1)
        RouteStop.objects.create(route=self.route, order=2)
        qs = RouteStop.objects.all()
        self.assertEqual(qs[0].order, 1)
        self.assertEqual(qs[1].order, 2)
        self.assertEqual(qs[2].order, 3)


# ──────────────────────────────────────────────
#  Route Serializers
# ──────────────────────────────────────────────

class RouteListSerializerTest(TestCase):
    def test_serializer_contains_expected_fields(self):
        r = Route.objects.create(name="List Route")
        serializer = RouteListSerializer(r)
        expected = {'id', 'name', 'transport_id', 'transport_plate',
                     'status', 'estimated_start', 'estimated_end', 'created_at'}
        self.assertEqual(set(serializer.data.keys()), expected)

    def test_transport_plate_null_when_no_transport(self):
        r = Route.objects.create(name="No Transport")
        serializer = RouteListSerializer(r)
        self.assertIsNone(serializer.data['transport_plate'])

    def test_transport_plate_shows_plate_number(self):
        transport = Transport.objects.create(plate_number="PLT-01")
        r = Route.objects.create(name="With Transport", transport=transport)
        serializer = RouteListSerializer(r)
        self.assertEqual(serializer.data['transport_plate'], "PLT-01")


class RouteDetailSerializerTest(TestCase):
    def test_serializer_includes_nested_stops(self):
        r = Route.objects.create(name="Detail Route")
        RouteStop.objects.create(route=r, order=1, address="Stop A")
        RouteStop.objects.create(route=r, order=2, address="Stop B")
        serializer = RouteDetailSerializer(r)
        data = serializer.data
        self.assertIn('stops', data)
        self.assertEqual(len(data['stops']), 2)
        self.assertEqual(data['stops'][0]['address'], "Stop A")

    def test_serializer_no_stops(self):
        r = Route.objects.create(name="Empty Route")
        serializer = RouteDetailSerializer(r)
        self.assertEqual(serializer.data['stops'], [])


class RouteCreateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {'name': 'New Route'}
        serializer = RouteCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_missing_name(self):
        data = {}
        serializer = RouteCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_invalid_empty_name(self):
        data = {'name': ''}
        serializer = RouteCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)


class RouteStopSerializerTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.route = Route.objects.create(name="Serializer Route")

    def test_valid_data(self):
        data = {'route': self.route.id, 'order': 1, 'address': 'Test Stop'}
        serializer = RouteStopSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_valid_data_minimal(self):
        data = {'route': self.route.id, 'order': 1}
        serializer = RouteStopSerializer(data=data)
        self.assertTrue(serializer.is_valid())


# ──────────────────────────────────────────────
#  Route API Endpoints
# ──────────────────────────────────────────────

class RouteAPIBaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.list_url = reverse('route-list')
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
        cls.transport = Transport.objects.create(plate_number="RTE-TRN")

    def setUp(self):
        self.client = APIClient()

    def _login(self, username, password):
        resp = self.client.post('/api/v1/auth/login/', {
            'username': username, 'password': password,
        }, format='json')
        token = resp.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _create_route(self, **overrides):
        data = {'name': 'Test Route'}
        data.update(overrides)
        return Route.objects.create(**data)


class RouteUnauthenticatedTest(RouteAPIBaseTest):
    def test_list_returns_401(self):
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_returns_401(self):
        r = self.client.post(self.list_url, {'name': 'Route'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_returns_401(self):
        route = self._create_route()
        url = reverse('route-detail', args=[route.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_stops_returns_401(self):
        route = self._create_route()
        url = f'/api/v1/routes/{route.id}/stops/'
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)


class RouteListTest(RouteAPIBaseTest):
    def test_list_empty(self):
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 0)
        self.assertEqual(r.data['results'], [])

    def test_list_with_data(self):
        self._create_route(name="R1")
        self._create_route(name="R2")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 2)
        self.assertEqual(len(r.data['results']), 2)

    def test_list_uses_list_serializer(self):
        self._create_route(name="List Route")
        self._login('admin', 'admin123')
        r = self.client.get(self.list_url)
        result = r.data['results'][0]
        self.assertIn('name', result)
        self.assertIn('transport_plate', result)
        self.assertIn('status', result)

    def test_readonly_user_can_list(self):
        self._login('reader', 'reader123')
        r = self.client.get(self.list_url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class RouteCreateTest(RouteAPIBaseTest):
    def test_admin_can_create(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'name': 'New Route'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['name'], "New Route")
        self.assertEqual(Route.objects.count(), 1)

    def test_create_missing_name_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {'name': ''}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_create(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.list_url, {'name': 'Blocked'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_transport(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.list_url, {
            'name': 'With Transport',
            'transport': self.transport.id,
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['name'], "With Transport")


class RouteDetailTest(RouteAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.route = self._create_route(name="Detail Route")

    def test_admin_can_get_detail(self):
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['name'], "Detail Route")

    def test_readonly_user_can_get_detail(self):
        self._login('reader', 'reader123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[9999])
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class RouteListStopsTest(RouteAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.route = self._create_route(name="Stops Route")
        RouteStop.objects.create(route=self.route, order=1, address="Stop 1")
        RouteStop.objects.create(route=self.route, order=2, address="Stop 2")

    def test_list_stops_returns_all(self):
        self._login('admin', 'admin123')
        url = f'/api/v1/routes/{self.route.id}/stops/'
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 2)
        self.assertEqual(r.data[0]['address'], "Stop 1")

    def test_list_stops_readonly_allowed(self):
        self._login('reader', 'reader123')
        url = f'/api/v1/routes/{self.route.id}/stops/'
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_list_stops_nonexistent_route_404(self):
        self._login('admin', 'admin123')
        url = '/api/v1/routes/9999/stops/'
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class RouteAddStopTest(RouteAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.route = self._create_route(name="Add Stop Route")
        self.add_stop_url = f'/api/v1/routes/{self.route.id}/stops/'

    def test_admin_can_add_stop(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.add_stop_url, {'order': 1, 'address': 'New Stop'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(r.data['order'], 1)
        self.assertEqual(RouteStop.objects.count(), 1)

    def test_add_stop_missing_order_returns_400(self):
        self._login('admin', 'admin123')
        r = self.client.post(self.add_stop_url, {'address': 'No Order'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_readonly_user_cannot_add_stop(self):
        self._login('reader', 'reader123')
        r = self.client.post(self.add_stop_url, {'order': 1}, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_stop_nonexistent_route_404(self):
        self._login('admin', 'admin123')
        url = '/api/v1/routes/9999/stops/'
        r = self.client.post(url, {'order': 1}, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class RouteUpdateStopTest(RouteAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.route = self._create_route(name="Update Stop Route")
        self.stop = RouteStop.objects.create(
            route=self.route, order=1, address="Original Stop"
        )
        self.update_url = f'/api/v1/routes/{self.route.id}/stops/{self.stop.id}/'

    def test_admin_can_update_stop(self):
        self._login('admin', 'admin123')
        r = self.client.put(self.update_url, {
            'route': self.route.id, 'order': 1, 'address': 'Updated Stop'
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.stop.refresh_from_db()
        self.assertEqual(self.stop.address, "Updated Stop")

    def test_readonly_user_cannot_update_stop(self):
        self._login('reader', 'reader123')
        r = self.client.put(self.update_url, {'order': 1, 'address': 'Hacked'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_stop_nonexistent_route_404(self):
        self._login('admin', 'admin123')
        url = f'/api/v1/routes/9999/stops/{self.stop.id}/'
        r = self.client.put(url, {'order': 1, 'address': 'Nope'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_stop_nonexistent_stop_404(self):
        self._login('admin', 'admin123')
        url = f'/api/v1/routes/{self.route.id}/stops/9999/'
        r = self.client.put(url, {'order': 1, 'address': 'Nope'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class RouteUpdateTest(RouteAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.route = self._create_route(name="Old Name")

    def test_admin_can_update(self):
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.put(url, {'name': 'Updated Route'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.route.refresh_from_db()
        self.assertEqual(self.route.name, "Updated Route")

    def test_readonly_user_cannot_update(self):
        self._login('reader', 'reader123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.put(url, {'name': 'Hacked'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.patch(url, {'name': 'Partially Updated'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.route.refresh_from_db()
        self.assertEqual(self.route.name, "Partially Updated")


class RouteDeleteTest(RouteAPIBaseTest):
    def setUp(self):
        super().setUp()
        self.route = self._create_route(name="Delete Route")

    def test_admin_can_delete(self):
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Route.objects.count(), 0)

    def test_readonly_user_cannot_delete(self):
        self._login('reader', 'reader123')
        url = reverse('route-detail', args=[self.route.id])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_returns_404(self):
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_cascades_to_stops(self):
        RouteStop.objects.create(route=self.route, order=1)
        self._login('admin', 'admin123')
        url = reverse('route-detail', args=[self.route.id])
        self.client.delete(url)
        self.assertEqual(RouteStop.objects.count(), 0)
