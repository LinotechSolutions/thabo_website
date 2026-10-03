from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from subsidiaries.models import Audience, Goal, LifeStage, Subsidiary
from subsidiaries.serializers import (
    AudienceSerializer,
    GoalSerializer,
    LifeStageSerializer,
    SubsidiarySerializer,
)


class SubsidiaryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for subsidiaries and their lifecycle stages.
    GET /api/subsidiaries/
    GET /api/subsidiaries/{id}/
    """
    queryset = Subsidiary.objects.prefetch_related("lifecycle_stages").all()
    serializer_class = SubsidiarySerializer
    permission_classes = [AllowAny]
    lookup_field = "id"


class AudienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer
    permission_classes = [AllowAny]


class LifeStageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LifeStage.objects.all()
    serializer_class = LifeStageSerializer
    permission_classes = [AllowAny]


class GoalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [AllowAny]
