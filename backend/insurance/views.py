from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from insurance.models import AddonOption, AssetOption, CoverOption, InsuranceQuote
from insurance.serializers import (
    AddonOptionSerializer,
    AssetOptionSerializer,
    CoverOptionSerializer,
    InsuranceQuoteRequestSerializer,
)
from insurance.services import InsuranceQuoteService


class AssetOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AssetOption.objects.all()
    serializer_class = AssetOptionSerializer
    permission_classes = [AllowAny]


class CoverOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CoverOption.objects.all()
    serializer_class = CoverOptionSerializer
    permission_classes = [AllowAny]


class AddonOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AddonOption.objects.all()
    serializer_class = AddonOptionSerializer
    permission_classes = [AllowAny]


class InsuranceOptionsView(APIView):
    """
    Returns all configuration assets, cover tiers, and addons in one combined payload.
    GET /api/insurance/options/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        assets = AssetOption.objects.all()
        covers = CoverOption.objects.all()
        addons = AddonOption.objects.all()

        return Response(
            {
                "assets": AssetOptionSerializer(assets, many=True).data,
                "covers": CoverOptionSerializer(covers, many=True).data,
                "addons": AddonOptionSerializer(addons, many=True).data,
            }
        )


class InsuranceQuoteView(APIView):
    """
    Computes a verified, server-side actuarial premium quote.
    POST /api/insurance/quote/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InsuranceQuoteRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            result = InsuranceQuoteService.calculate_premium(
                asset_id=data["asset_id"],
                cover_id=data["cover_id"],
                selected_addon_ids=data.get("selected_addons", []),
                vehicle_value_usd=data.get("vehicle_value_usd", 0.0),
                vehicle_year=data.get("vehicle_year"),
                country_code=data.get("country_code", "zw"),
            )

            # Optionally persist quote
            if data.get("save_quote") or (request.user and request.user.is_authenticated):
                asset = AssetOption.objects.filter(id=data["asset_id"]).first()
                cover = CoverOption.objects.filter(id=data["cover_id"]).first()
                if asset and cover:
                    InsuranceQuote.objects.create(
                        user=request.user if request.user.is_authenticated else None,
                        asset=asset,
                        cover=cover,
                        selected_addons=data.get("selected_addons", []),
                        vehicle_make=data.get("vehicle_make", ""),
                        vehicle_model=data.get("vehicle_model", ""),
                        vehicle_year=data.get("vehicle_year"),
                        vehicle_value_usd=data.get("vehicle_value_usd", 0.0),
                        reg_number=data.get("reg_number", ""),
                        overnight_location=data.get("overnight_location", ""),
                        monthly_premium_usd=result["totalMonthlyUSD"],
                        annual_premium_usd=result["totalAnnualUSD"],
                        breakdown=result["breakdown"],
                    )

            return Response(result, status=status.HTTP_200_OK)

        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
