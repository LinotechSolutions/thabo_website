from rest_framework import serializers
from branches.models import Branch


class BranchSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="branch_type")
    type_display = serializers.CharField(source="get_branch_type_display", read_only=True)
    distance_km = serializers.FloatField(read_only=True, required=False, allow_null=True)

    class Meta:
        model = Branch
        fields = [
            "id",
            "name",
            "type",
            "type_display",
            "city",
            "address",
            "latitude",
            "longitude",
            "phone",
            "hours",
            "services",
            "distance_km",
        ]
