from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from core.views import csrf_token_view, health_check

urlpatterns = [
    # Obscured admin endpoint (never default /admin/)
    path(settings.ADMIN_URL_PATH, admin.site.urls),
    # Core health & security endpoints
    path("api/health/", health_check, name="health-check"),
    path("api/csrf/", csrf_token_view, name="csrf-token"),
    # Domain APIs
    path("api/auth/", include("accounts.urls", namespace="accounts")),
    path("api/countries/", include("countries.urls")),
    path("api/subsidiaries/", include("subsidiaries.urls")),
    path("api/products/", include("products.urls")),
    path("api/billers/", include("billers.urls")),
    path("api/branches/", include("branches.urls")),
    path("api/insurance/", include("insurance.urls")),
    path("api/calculators/", include("calculators.urls", namespace="calculators")),
    path("api/chatbot/", include("chatbot.urls", namespace="chatbot")),
]
