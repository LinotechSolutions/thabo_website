from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from billers.models import Biller
from billers.serializers import BillerSerializer


class BillerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for integrated billers.
    GET /api/billers/
    """
    queryset = Biller.objects.filter(is_active=True)
    serializer_class = BillerSerializer
    permission_classes = [AllowAny]
