from django.urls import include, path
from rest_framework.routers import DefaultRouter
from billers.views import BillerViewSet

router = DefaultRouter()
router.register(r"", BillerViewSet, basename="biller")

urlpatterns = [
    path("", include(router.urls)),
]
