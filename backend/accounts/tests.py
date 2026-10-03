from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, UserRole
from audit.models import AuditLog


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=False)
        self.register_url = reverse("accounts:register")
        self.login_url = reverse("accounts:login")
        self.refresh_url = reverse("accounts:refresh")
        self.logout_url = reverse("accounts:logout")
        self.me_url = reverse("accounts:me")

    def test_full_auth_roundtrip_via_cookies(self):
        # 1. Register
        reg_payload = {
            "username": "testuser",
            "email": "testuser@cbz.co.zw",
            "password": "SecurePassword123!",
            "role": UserRole.PERSONAL,
            "first_name": "Tariro",
            "last_name": "Moyo",
            "phone_number": "+263771234567",
        }
        res_reg = self.client.post(self.register_url, reg_payload, format="json")
        self.assertEqual(res_reg.status_code, status.HTTP_201_CREATED)
        self.assertIn("access_token", res_reg.cookies)
        self.assertIn("refresh_token", res_reg.cookies)
        self.assertTrue(res_reg.cookies["access_token"]["httponly"])

        # Check User was hashed with Argon2
        user = User.objects.get(username="testuser")
        self.assertTrue(user.password.startswith("argon2"))

        # 2. Login
        login_payload = {
            "username": "testuser",
            "password": "SecurePassword123!",
            "portal_type": "personal",
        }
        res_login = self.client.post(self.login_url, login_payload, format="json")
        self.assertEqual(res_login.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", res_login.cookies)
        self.assertIn("refresh_token", res_login.cookies)
        # Ensure tokens are NOT in JSON body
        self.assertNotIn("access", res_login.data)
        self.assertNotIn("access_token", res_login.data)
        self.assertNotIn("refresh", res_login.data)

        # 3. GET /api/auth/me/ using cookie auth
        self.client.cookies["access_token"] = res_login.cookies["access_token"].value
        res_me = self.client.get(self.me_url)
        self.assertEqual(res_me.status_code, status.HTTP_200_OK)
        self.assertEqual(res_me.data["username"], "testuser")
        self.assertEqual(res_me.data["role"], UserRole.PERSONAL)

        # 4. Refresh token via cookie
        self.client.cookies["refresh_token"] = res_login.cookies["refresh_token"].value
        res_refresh = self.client.post(self.refresh_url)
        self.assertEqual(res_refresh.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", res_refresh.cookies)

        # 5. Logout
        res_logout = self.client.post(self.logout_url)
        self.assertEqual(res_logout.status_code, status.HTTP_200_OK)

        # 6. Verify audit logs were created
        self.assertTrue(AuditLog.objects.filter(action="auth_login_success").exists())
        self.assertTrue(AuditLog.objects.filter(action="auth_register_success").exists())

    def test_csrf_rejection_on_state_changing_request_without_csrftoken(self):
        # 1. Create user and obtain auth cookies
        user = User.objects.create_user(
            username="csrfuser",
            email="csrf@cbz.co.zw",
            password="SecurePassword123!",
            role=UserRole.PERSONAL,
        )

        login_res = self.client.post(
            self.login_url,
            {"username": "csrfuser", "password": "SecurePassword123!"},
            format="json",
        )
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_cookie = login_res.cookies["access_token"].value

        # 2. Client with CSRF enforcement turned ON
        csrf_client = APIClient(enforce_csrf_checks=True)
        csrf_client.cookies["access_token"] = access_cookie

        # Mutating request without CSRF cookie or X-CSRFToken header must be rejected with 403
        res_rejected = csrf_client.post(self.logout_url)
        self.assertEqual(res_rejected.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Obtain real CSRF token via GET /api/csrf/
        csrf_res = csrf_client.get(reverse("csrf-token"))
        csrf_token = csrf_res.data["csrfToken"]

        # Providing X-CSRFToken header must now succeed
        res_allowed = csrf_client.post(
            self.logout_url,
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(res_allowed.status_code, status.HTTP_200_OK)

