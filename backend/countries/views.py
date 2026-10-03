from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from countries.models import Country
from countries.serializers import CountrySerializer


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for supported countries.
    GET /api/countries/
    GET /api/countries/{code}/
    """
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]
    lookup_field = "code"
