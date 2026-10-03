from decimal import Decimal
from django.conf import settings
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from branches.models import Branch, BranchType
from insurance.models import AddonOption, AssetOption, CoverOption


class CoreAndCalculatorsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check(self):
        res = self.client.get(reverse("health-check"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["status"], "healthy")
        self.assertEqual(res.data["database"], "ok")

    def test_csrf_token_endpoint(self):
        res = self.client.get(reverse("csrf-token"))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("csrfToken", res.data)
        self.assertTrue(len(res.data["csrfToken"]) > 10)

    def test_admin_is_obscured(self):
        # Default /admin/ should return 404
        res_default_admin = self.client.get("/admin/")
        self.assertEqual(res_default_admin.status_code, status.HTTP_404_NOT_FOUND)

        # Obscured admin should exist and redirect to login or return 200/302
        obscured_path = f"/{settings.ADMIN_URL_PATH}"
        res_obscured = self.client.get(obscured_path)
        self.assertIn(res_obscured.status_code, [status.HTTP_200_OK, status.HTTP_302_FOUND])

    def test_stand_affordability_calculator(self):
        payload = {
            "monthly_income": 3000.0,
            "existing_debt": 300.0,
            "deposit_amount": 5000.0,
            "loan_term_years": 15,
            "interest_rate_percent": 9.5,
        }
        res = self.client.post(reverse("calculators:stand-affordability"), payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["qualifies"])
        self.assertGreater(res.data["maxAffordablePrice"], 5000.0)
        self.assertLessEqual(res.data["debtToIncomeRatio"], 40.0)

    def test_seasonal_budget_calculator(self):
        payload = {
            "crop_type": "maize",
            "hectares": 10.0,
            "include_insurance": True,
        }
        res = self.client.post(reverse("calculators:seasonal-budget"), payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["hectares"], 10.0)
        self.assertGreater(res.data["totalGrossRevenue"], 0)
        self.assertGreater(res.data["totalInputCost"], 0)
        self.assertGreater(res.data["returnOnInvestment"], 0)

    def test_investment_pathway_calculator(self):
        payload = {
            "initial_investment": 1000.0,
            "monthly_contribution": 100.0,
            "horizon_years": 5,
            "risk_profile": "moderate",
        }
        res = self.client.post(reverse("calculators:investment-pathway"), payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreater(res.data["projectedValue"], 7000.0)
        self.assertEqual(len(res.data["milestones"]), 5)


class DomainAndFeatureTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_cbz_data", verbosity=0)

    def setUp(self):
        self.client = APIClient()

    def test_countries_endpoint(self):
        res = self.client.get("/api/countries/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 4)
        zw = next((c for c in res.data if c["code"] == "zw"), None)
        self.assertIsNotNone(zw)
        self.assertEqual(zw["iso"], "ZW")

    def test_subsidiaries_endpoint(self):
        res = self.client.get("/api/subsidiaries/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 9)
        bank = next((s for s in res.data if s["id"] == "bank"), None)
        self.assertIsNotNone(bank)
        self.assertTrue(bank["isCore"])

    def test_products_endpoint_and_grouped(self):
        res = self.client.get("/api/products/?subsidiary=bank")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreater(len(res.data), 0)

        res_grouped = self.client.get("/api/products/grouped/?subsidiary=bank")
        self.assertEqual(res_grouped.status_code, status.HTTP_200_OK)
        self.assertIn("accounts", res_grouped.data)
        self.assertIn("loans", res_grouped.data)

    def test_branches_finder_with_proximity(self):
        # User in central Harare: -17.829, 31.052
        res = self.client.get("/api/branches/?lat=-17.829&lng=31.052")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreater(len(res.data), 0)
        # Nearest branch should have distance_km calculated
        nearest = res.data[0]
        self.assertIn("distance_km", nearest)
        self.assertIsNotNone(nearest["distance_km"])
        self.assertLess(nearest["distance_km"], 2.0)  # Harare Main Branch is < 2km away

    def test_insurance_quote_calculation(self):
        payload = {
            "asset_id": "asset-private-motor",
            "cover_id": "comprehensive",
            "selected_addons": ["addon-roadside", "addon-windscreen"],
            "vehicle_value_usd": 15000.0,
            "vehicle_year": 2020,
            "country_code": "zw",
        }
        res = self.client.post("/api/insurance/quote/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("totalMonthlyUSD", res.data)
        self.assertIn("totalAnnualUSD", res.data)
        self.assertIn("breakdown", res.data)
        self.assertGreater(res.data["totalMonthlyUSD"], 46.0)

    def test_chatbot_multilingual_response(self):
        # English query
        payload_en = {"message": "How do I apply for an agribusiness loan?", "language": "en"}
        res_en = self.client.post("/api/chatbot/message/", payload_en, format="json")
        self.assertEqual(res_en.status_code, status.HTTP_200_OK)
        self.assertIn("reply", res_en.data)
        self.assertIn("sessionId", res_en.data)

        # Shona greeting query
        payload_sn = {"message": "Makadii, ndinoda insurance yemota", "language": "sn"}
        res_sn = self.client.post("/api/chatbot/message/", payload_sn, format="json")
        self.assertEqual(res_sn.status_code, status.HTTP_200_OK)
        self.assertIn("reply", res_sn.data)
