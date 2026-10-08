from rest_framework import serializers
from .models import Announcement, ContactChannel, CorporateFact


class AnnouncementSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")
    date = serializers.CharField(source="date_display")
    circularRef = serializers.CharField(source="circular_ref", allow_null=True)
    isUrgent = serializers.BooleanField(source="is_urgent")
    fileSize = serializers.CharField(source="file_size", allow_null=True)
    fileUrl = serializers.CharField(source="file_url", allow_null=True)

    class Meta:
        model = Announcement
        fields = [
            "id",
            "category",
            "title",
            "date",
            "summary",
            "circularRef",
            "isUrgent",
            "fileSize",
            "fileUrl",
            "tag",
            "order",
        ]


class ContactChannelSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")
    actionText = serializers.CharField(source="action_text")
    actionHref = serializers.CharField(source="action_href")
    iconName = serializers.CharField(source="icon_name")

    class Meta:
        model = ContactChannel
        fields = [
            "id",
            "name",
            "description",
            "value",
            "actionText",
            "actionHref",
            "badge",
            "iconName",
            "availability",
            "order",
        ]


class CorporateFactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorporateFact
        fields = ["key", "label", "value", "confirmed", "note"]
