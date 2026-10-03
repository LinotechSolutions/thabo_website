from django.urls import include, path
from rest_framework.routers import DefaultRouter
from countries.views import CountryViewSet

router = DefaultRouter()
router.register(r"", CountryViewSet, basename="country")

urlpatterns = [
    path("", include(router.urls)),
]
