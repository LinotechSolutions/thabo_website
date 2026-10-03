from django.urls import include, path
from rest_framework.routers import DefaultRouter
from insurance.views import (
    AddonOptionViewSet,
    AssetOptionViewSet,
    CoverOptionViewSet,
    InsuranceOptionsView,
    InsuranceQuoteView,
)

router = DefaultRouter()
router.register(r"assets", AssetOptionViewSet, basename="asset")
router.register(r"covers", CoverOptionViewSet, basename="cover")
router.register(r"addons", AddonOptionViewSet, basename="addon")

urlpatterns = [
    path("options/", InsuranceOptionsView.as_view(), name="insurance-options"),
    path("quote/", InsuranceQuoteView.as_view(), name="insurance-quote"),
    path("", include(router.urls)),
]
