from collections import defaultdict
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from products.models import ProductItem
from products.serializers import ProductItemSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for products across all CBZ subsidiaries.
    Supports filtering by subsidiary (?subsidiary=bank) and category (?category=loans).
    Also supports grouped output via /api/products/grouped/?subsidiary=bank.
    """
    serializer_class = ProductItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = ProductItem.objects.filter(is_active=True)
        subsidiary = self.request.query_params.get("subsidiary")
        if subsidiary:
            qs = qs.filter(subsidiary_id=subsidiary)
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs

    @action(detail=False, methods=["GET"], url_path="grouped")
    def grouped(self, request):
        """Returns products grouped by category for a subsidiary."""
        subsidiary = request.query_params.get("subsidiary")
        qs = ProductItem.objects.filter(is_active=True)
        if subsidiary:
            qs = qs.filter(subsidiary_id=subsidiary)

        grouped_data = defaultdict(list)
        serializer = self.get_serializer(qs, many=True)
        for item in serializer.data:
            cat = item.get("category")
            grouped_data[cat].append(item)

        return Response(grouped_data)
