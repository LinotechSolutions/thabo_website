from rest_framework import serializers
from products.models import ProductItem


class ProductItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="item_id", required=False, allow_null=True)
    subsidiary = serializers.CharField(source="subsidiary_id", read_only=True)

    class Meta:
        model = ProductItem
        fields = [
            "id",
            "subsidiary",
            "category",
            "name",
            "description",
            "pricing",
            "image",
            "icon",
        ]
