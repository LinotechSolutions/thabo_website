from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Announcement, ContactChannel, CorporateFact
from .serializers import (
    AnnouncementSerializer,
    ContactChannelSerializer,
    CorporateFactSerializer,
)


class AnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only viewset for CBZ Holdings corporate notices and circulars.
    Supports ?category=shareholder/customer/regulatory/operational and ?urgent=true
    """
    serializer_class = AnnouncementSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        qs = Announcement.objects.filter(is_active=True)
        category = self.request.query_params.get("category")
        if category and category != "all":
            qs = qs.filter(category=category)
        urgent = self.request.query_params.get("urgent")
        if urgent == "true":
            qs = qs.filter(is_urgent=True)
        return qs

    @action(detail=False, methods=["GET"], url_path="urgent")
    def urgent(self, request):
        qs = Announcement.objects.filter(is_active=True, is_urgent=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ContactChannelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only viewset for official contact channels and support lines.
    """
    serializer_class = ContactChannelSerializer
    permission_classes = [AllowAny]
    queryset = ContactChannel.objects.filter(is_active=True)
    lookup_field = "slug"


class CorporateFactViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only viewset for verified group statistics and corporate facts.
    """
    serializer_class = CorporateFactSerializer
    permission_classes = [AllowAny]
    queryset = CorporateFact.objects.all()
    lookup_field = "key"
