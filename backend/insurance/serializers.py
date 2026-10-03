from rest_framework import serializers
from insurance.models import AddonOption, AssetOption, CoverOption, InsuranceQuote


class AssetOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetOption
        fields = ["id", "name", "description", "entity"]


class CoverOptionSerializer(serializers.ModelSerializer):
    basePriceUSD = serializers.FloatField(source="base_price_usd")

    class Meta:
        model = CoverOption
        fields = ["id", "name", "tier", "basePriceUSD", "features"]


class AddonOptionSerializer(serializers.ModelSerializer):
    priceUSD = serializers.FloatField(source="price_usd")

    class Meta:
        model = AddonOption
        fields = ["id", "name", "entity", "description", "priceUSD"]


class InsuranceQuoteRequestSerializer(serializers.Serializer):
    asset_id = serializers.CharField(required=True)
    cover_id = serializers.CharField(required=True)
    selected_addons = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    vehicle_make = serializers.CharField(required=False, allow_blank=True, default="")
    vehicle_model = serializers.CharField(required=False, allow_blank=True, default="")
    vehicle_year = serializers.IntegerField(
        required=False, allow_null=True, min_value=1950, max_value=2030, default=None
    )
    vehicle_value_usd = serializers.FloatField(
        required=False, min_value=0.0, default=0.0
    )
    reg_number = serializers.CharField(required=False, allow_blank=True, default="")
    overnight_location = serializers.CharField(
        required=False, allow_blank=True, default=""
    )
    country_code = serializers.CharField(
        required=False, allow_blank=True, default="zw"
    )
    save_quote = serializers.BooleanField(required=False, default=False)
