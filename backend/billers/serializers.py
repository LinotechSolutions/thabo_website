from rest_framework import serializers
from billers.models import Biller


class BillerSerializer(serializers.ModelSerializer):
    iconName = serializers.CharField(source="icon_name")

    class Meta:
        model = Biller
        fields = ["id", "name", "category", "iconName"]
