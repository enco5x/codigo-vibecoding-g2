from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import Mock, MagicMock

from apps.core.permissions import (
    IsAdmin,
    IsManager,
    IsDriver,
    IsCustomer,
    IsAdminOrManager,
    IsAdminOrReadOnly,
)


class PermissionBaseTest(TestCase):
    """Helper to build mock request for permission tests."""

    @classmethod
    def setUpTestData(cls):
        cls.admin_group, _ = Group.objects.get_or_create(name='admin')
        cls.manager_group, _ = Group.objects.get_or_create(name='manager')
        cls.driver_group, _ = Group.objects.get_or_create(name='driver')
        cls.customer_group, _ = Group.objects.get_or_create(name='customer')

    def _make_request(self, user=None, method='GET'):
        """Create a mock request with optional user and HTTP method."""
        request = MagicMock()
        request.user = user if user else Mock(is_authenticated=False)
        request.method = method
        return request


# ──────────────────────────────────────────────
#  Permission: IsAdmin
# ──────────────────────────────────────────────

class IsAdminTest(PermissionBaseTest):
    def test_admin_user_has_permission(self):
        user = User.objects.create_user(username='admin_user', password='pass')
        user.groups.add(self.admin_group)
        request = self._make_request(user=user)
        self.assertTrue(IsAdmin().has_permission(request, None))

    def test_non_admin_user_no_permission(self):
        user = User.objects.create_user(username='manager_user', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user)
        self.assertFalse(IsAdmin().has_permission(request, None))

    def test_unauthenticated_user_no_permission(self):
        request = self._make_request(user=None)
        self.assertFalse(IsAdmin().has_permission(request, None))


# ──────────────────────────────────────────────
#  Permission: IsManager
# ──────────────────────────────────────────────

class IsManagerTest(PermissionBaseTest):
    def test_manager_user_has_permission(self):
        user = User.objects.create_user(username='mgr', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user)
        self.assertTrue(IsManager().has_permission(request, None))

    def test_non_manager_user_no_permission(self):
        user = User.objects.create_user(username='drv', password='pass')
        user.groups.add(self.driver_group)
        request = self._make_request(user=user)
        self.assertFalse(IsManager().has_permission(request, None))

    def test_unauthenticated_user_no_permission(self):
        request = self._make_request(user=None)
        self.assertFalse(IsManager().has_permission(request, None))


# ──────────────────────────────────────────────
#  Permission: IsDriver
# ──────────────────────────────────────────────

class IsDriverTest(PermissionBaseTest):
    def test_driver_user_has_permission(self):
        user = User.objects.create_user(username='drv1', password='pass')
        user.groups.add(self.driver_group)
        request = self._make_request(user=user)
        self.assertTrue(IsDriver().has_permission(request, None))

    def test_non_driver_user_no_permission(self):
        user = User.objects.create_user(username='cust1', password='pass')
        user.groups.add(self.customer_group)
        request = self._make_request(user=user)
        self.assertFalse(IsDriver().has_permission(request, None))

    def test_unauthenticated_user_no_permission(self):
        request = self._make_request(user=None)
        self.assertFalse(IsDriver().has_permission(request, None))


# ──────────────────────────────────────────────
#  Permission: IsCustomer
# ──────────────────────────────────────────────

class IsCustomerTest(PermissionBaseTest):
    def test_customer_user_has_permission(self):
        user = User.objects.create_user(username='cust1', password='pass')
        user.groups.add(self.customer_group)
        request = self._make_request(user=user)
        self.assertTrue(IsCustomer().has_permission(request, None))

    def test_non_customer_user_no_permission(self):
        user = User.objects.create_user(username='drv1', password='pass')
        user.groups.add(self.driver_group)
        request = self._make_request(user=user)
        self.assertFalse(IsCustomer().has_permission(request, None))

    def test_unauthenticated_user_no_permission(self):
        request = self._make_request(user=None)
        self.assertFalse(IsCustomer().has_permission(request, None))


# ──────────────────────────────────────────────
#  Permission: IsAdminOrManager
# ──────────────────────────────────────────────

class IsAdminOrManagerTest(PermissionBaseTest):
    def test_admin_user_has_permission(self):
        user = User.objects.create_user(username='adm', password='pass')
        user.groups.add(self.admin_group)
        request = self._make_request(user=user)
        self.assertTrue(IsAdminOrManager().has_permission(request, None))

    def test_manager_user_has_permission(self):
        user = User.objects.create_user(username='mgr', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user)
        self.assertTrue(IsAdminOrManager().has_permission(request, None))

    def test_driver_user_read_allowed(self):
        user = User.objects.create_user(username='drv', password='pass')
        user.groups.add(self.driver_group)
        request = self._make_request(user=user, method='GET')
        self.assertTrue(IsAdminOrManager().has_permission(request, None))

    def test_driver_user_write_denied(self):
        user = User.objects.create_user(username='drv', password='pass')
        user.groups.add(self.driver_group)
        request = self._make_request(user=user, method='POST')
        self.assertFalse(IsAdminOrManager().has_permission(request, None))

    def test_customer_user_read_allowed(self):
        user = User.objects.create_user(username='cust', password='pass')
        user.groups.add(self.customer_group)
        request = self._make_request(user=user, method='GET')
        self.assertTrue(IsAdminOrManager().has_permission(request, None))

    def test_customer_user_write_denied(self):
        user = User.objects.create_user(username='cust', password='pass')
        user.groups.add(self.customer_group)
        request = self._make_request(user=user, method='POST')
        self.assertFalse(IsAdminOrManager().has_permission(request, None))

    def test_unauthenticated_user_no_permission(self):
        request = self._make_request(user=None)
        self.assertFalse(IsAdminOrManager().has_permission(request, None))

    def test_superuser_write_allowed(self):
        user = User.objects.create_user(
            username='su', password='pass', is_superuser=True
        )
        request = self._make_request(user=user, method='POST')
        self.assertTrue(IsAdminOrManager().has_permission(request, None))


# ──────────────────────────────────────────────
#  Permission: IsAdminOrReadOnly
# ──────────────────────────────────────────────

class IsAdminOrReadOnlyTest(PermissionBaseTest):
    def test_admin_user_safe_method_allowed(self):
        user = User.objects.create_user(username='adm', password='pass')
        user.groups.add(self.admin_group)
        request = self._make_request(user=user, method='GET')
        self.assertTrue(IsAdminOrReadOnly().has_permission(request, None))

    def test_admin_user_write_method_allowed(self):
        user = User.objects.create_user(username='adm', password='pass')
        user.groups.add(self.admin_group)
        request = self._make_request(user=user, method='POST')
        self.assertTrue(IsAdminOrReadOnly().has_permission(request, None))

    def test_non_admin_user_safe_method_allowed(self):
        user = User.objects.create_user(username='mgr', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user, method='GET')
        self.assertTrue(IsAdminOrReadOnly().has_permission(request, None))

    def test_non_admin_user_write_method_denied(self):
        user = User.objects.create_user(username='mgr', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user, method='POST')
        self.assertFalse(IsAdminOrReadOnly().has_permission(request, None))

    def test_non_admin_user_put_method_denied(self):
        user = User.objects.create_user(username='mgr', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user, method='PUT')
        self.assertFalse(IsAdminOrReadOnly().has_permission(request, None))

    def test_non_admin_user_delete_method_denied(self):
        user = User.objects.create_user(username='mgr', password='pass')
        user.groups.add(self.manager_group)
        request = self._make_request(user=user, method='DELETE')
        self.assertFalse(IsAdminOrReadOnly().has_permission(request, None))

    def test_unauthenticated_user_safe_method_denied(self):
        request = self._make_request(user=None, method='GET')
        self.assertFalse(IsAdminOrReadOnly().has_permission(request, None))

    def test_unauthenticated_user_write_method_denied(self):
        request = self._make_request(user=None, method='POST')
        self.assertFalse(IsAdminOrReadOnly().has_permission(request, None))


# ──────────────────────────────────────────────
#  Auth Endpoint: Login
# ──────────────────────────────────────────────

class LoginViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.login_url = reverse('token_obtain_pair')
        cls.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com',
        )

    def test_login_valid_credentials_returns_tokens(self):
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials_returns_401(self):
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'wrongpass',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user_returns_401(self):
        response = self.client.post(self.login_url, {
            'username': 'ghost',
            'password': 'pass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_empty_fields_returns_400(self):
        response = self.client.post(self.login_url, {
            'username': '',
            'password': '',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_missing_fields_returns_400(self):
        response = self.client.post(self.login_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ──────────────────────────────────────────────
#  Auth Endpoint: Refresh
# ──────────────────────────────────────────────

class RefreshViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.login_url = reverse('token_obtain_pair')
        cls.refresh_url = reverse('token_refresh')
        cls.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
        )

    def setUp(self):
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        self.refresh_token = response.data['refresh']

    def test_refresh_valid_token_returns_new_access(self):
        response = self.client.post(self.refresh_url, {
            'refresh': self.refresh_token,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_refresh_invalid_token_returns_401(self):
        response = self.client.post(self.refresh_url, {
            'refresh': 'invalid-token-here',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_empty_token_returns_400(self):
        response = self.client.post(self.refresh_url, {
            'refresh': '',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_missing_field_returns_400(self):
        response = self.client.post(self.refresh_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ──────────────────────────────────────────────
#  Auth Endpoint: Logout
# ──────────────────────────────────────────────

class LogoutViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.login_url = reverse('token_obtain_pair')
        cls.logout_url = reverse('logout')
        cls.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
        )

    def setUp(self):
        self.api_client = APIClient()

    def test_logout_authenticated_returns_200(self):
        # Login first to get a token
        login_resp = self.api_client.post(self.login_url, {
            'username': 'testuser',
            'password': 'testpass123',
        }, format='json')
        token = login_resp.data['access']
        self.api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.api_client.post(self.logout_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', response.data)

    def test_logout_unauthenticated_returns_401(self):
        # IsAuthenticated is default DRF permission class
        response = self.api_client.post(self.logout_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_get_returns_401(self):
        # Auth check happens before method check with default IsAuthenticated
        response = self.api_client.get(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
