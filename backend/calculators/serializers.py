from rest_framework import serializers


class StandAffordabilityInputSerializer(serializers.Serializer):
    monthly_income = serializers.FloatField(
        required=True, min_value=1.0, error_messages={"min_value": "Monthly income must be greater than zero."}
    )
    existing_debt = serializers.FloatField(
        required=False, min_value=0.0, default=0.0
    )
    deposit_amount = serializers.FloatField(
        required=False, min_value=0.0, default=0.0
    )
    loan_term_years = serializers.IntegerField(
        required=False, min_value=1, max_value=30, default=15
    )
    interest_rate_percent = serializers.FloatField(
        required=False, min_value=1.0, max_value=50.0, default=9.5
    )


class SeasonalBudgetInputSerializer(serializers.Serializer):
    crop_type = serializers.ChoiceField(
        choices=["maize", "wheat", "tobacco", "soya", "sorghum", "cotton"],
        default="maize",
    )
    hectares = serializers.FloatField(
        required=True, min_value=0.1, max_value=10000.0
    )
    input_cost_per_ha = serializers.FloatField(
        required=False, allow_null=True, min_value=0.0, default=None
    )
    expected_yield_per_ha = serializers.FloatField(
        required=False, allow_null=True, min_value=0.0, default=None
    )
    expected_price_per_ton = serializers.FloatField(
        required=False, allow_null=True, min_value=0.0, default=None
    )
    include_insurance = serializers.BooleanField(required=False, default=True)


class InvestmentPathwayInputSerializer(serializers.Serializer):
    initial_investment = serializers.FloatField(
        required=True, min_value=0.0
    )
    monthly_contribution = serializers.FloatField(
        required=False, min_value=0.0, default=0.0
    )
    horizon_years = serializers.IntegerField(
        required=False, min_value=1, max_value=30, default=5
    )
    risk_profile = serializers.ChoiceField(
        choices=["conservative", "moderate", "aggressive"],
        default="moderate",
    )
