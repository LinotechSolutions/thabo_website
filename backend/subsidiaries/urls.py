from django.urls import include, path
from rest_framework.routers import DefaultRouter
from subsidiaries.views import (
    AudienceViewSet,
    GoalViewSet,
    LifeStageViewSet,
    SubsidiaryViewSet,
)

router = DefaultRouter()
router.register(r"audiences", AudienceViewSet, basename="audience")
router.register(r"life-stages", LifeStageViewSet, basename="lifestage")
router.register(r"goals", GoalViewSet, basename="goal")
router.register(r"", SubsidiaryViewSet, basename="subsidiary")

urlpatterns = [
    path("", include(router.urls)),
]
