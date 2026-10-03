import math
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from branches.models import Branch
from branches.serializers import BranchSerializer


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees) in kilometers.
    """
    r = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Branch and ATM finder viewset.
    Query parameters:
    - lat, lng: returns branches sorted by distance with distance_km included
    - city: filter by city name
    - type: filter by branch/agency/atm
    - search: search by branch name or address
    """
    serializer_class = BranchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Branch.objects.filter(is_active=True)

        city = self.request.query_params.get("city")
        if city:
            qs = qs.filter(city__icontains=city)

        branch_type = self.request.query_params.get("type")
        if branch_type:
            qs = qs.filter(branch_type=branch_type)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(address__icontains=search)

        user_lat = self.request.query_params.get("lat")
        user_lng = self.request.query_params.get("lng")

        if user_lat and user_lng:
            try:
                ulat = float(user_lat)
                ulng = float(user_lng)
                branches = list(qs)
                for b in branches:
                    b.distance_km = round(
                        haversine_distance(ulat, ulng, b.latitude, b.longitude), 1
                    )
                branches.sort(key=lambda x: x.distance_km)
                return branches
            except (ValueError, TypeError):
                pass

        return qs
