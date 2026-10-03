from rest_framework import serializers
from subsidiaries.models import Audience, Goal, LifecycleStage, LifeStage, Subsidiary


class LifecycleStageSerializer(serializers.ModelSerializer):
    partnerEntity = serializers.CharField(source="partner_entity", allow_null=True)

    class Meta:
        model = LifecycleStage
        fields = [
            "step",
            "phase",
            "title",
            "description",
            "deliverables",
            "partnerEntity",
            "tag",
        ]


class SubsidiarySerializer(serializers.ModelSerializer):
    isCore = serializers.BooleanField(source="is_core")
    lifecycleStages = LifecycleStageSerializer(source="lifecycle_stages", many=True, read_only=True)

    class Meta:
        model = Subsidiary
        fields = [
            "id",
            "name",
            "category",
            "description",
            "cta",
            "screen",
            "tagline",
            "isCore",
            "image",
            "logo",
            "lifecycleStages",
        ]


class AudienceSerializer(serializers.ModelSerializer):
    iconName = serializers.CharField(source="icon_name")

    class Meta:
        model = Audience
        fields = ["title", "description", "iconName", "image", "tag"]


class LifeStageSerializer(serializers.ModelSerializer):
    iconName = serializers.CharField(source="icon_name")

    class Meta:
        model = LifeStage
        fields = ["title", "subtitle", "iconName"]


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ["label", "route", "subsidiary"]
