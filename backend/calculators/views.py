from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from calculators.serializers import (
    InvestmentPathwayInputSerializer,
    SeasonalBudgetInputSerializer,
    StandAffordabilityInputSerializer,
)
from calculators.services import (
    InvestmentPathwayService,
    SeasonalBudgetService,
    StandAffordabilityService,
)


class StandAffordabilityView(APIView):
    """
    CBZ Properties Stand Affordability Calculator.
    Calculates max affordable stand price, monthly repayments, and qualifying status.
    POST /api/calculators/stand-affordability/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StandAffordabilityInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = StandAffordabilityService.calculate(
            monthly_income=data["monthly_income"],
            existing_debt=data.get("existing_debt", 0.0),
            deposit_amount=data.get("deposit_amount", 0.0),
            loan_term_years=data.get("loan_term_years", 15),
            interest_rate_percent=data.get("interest_rate_percent", 9.5),
        )
        return Response(result, status=status.HTTP_200_OK)


class SeasonalBudgetView(APIView):
    """
    CBZ Agro-Yield Seasonal Budget & Crop Yield Calculator.
    Computes working capital input costs, insurance, revenues, and gross margins.
    POST /api/calculators/seasonal-budget/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SeasonalBudgetInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = SeasonalBudgetService.calculate(
            crop_type=data["crop_type"],
            hectares=data["hectares"],
            input_cost_per_ha=data.get("input_cost_per_ha"),
            expected_yield_per_ha=data.get("expected_yield_per_ha"),
            expected_price_per_ton=data.get("expected_price_per_ton"),
            include_insurance=data.get("include_insurance", True),
        )
        return Response(result, status=status.HTTP_200_OK)


class InvestmentPathwayView(APIView):
    """
    Datvest Investment Pathway Guide.
    Forecasts compound investment value and matches suited Datvest asset funds.
    POST /api/calculators/investment-pathway/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InvestmentPathwayInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = InvestmentPathwayService.calculate(
            initial_investment=data["initial_investment"],
            monthly_contribution=data.get("monthly_contribution", 0.0),
            horizon_years=data.get("horizon_years", 5),
            risk_profile=data.get("risk_profile", "moderate"),
        )
        return Response(result, status=status.HTTP_200_OK)
