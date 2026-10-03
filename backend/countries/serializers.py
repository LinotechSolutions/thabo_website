from rest_framework import serializers
from countries.models import Country


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = [
            "code",
            "name",
            "iso",
            "cur",
            "dial",
            "illustrative",
            "regulator",
            "pcur",
            "rate",
            "rates",
        ]
