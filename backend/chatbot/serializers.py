from rest_framework import serializers
from chatbot.models import ChatMessage, ChatSession


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["role", "content", "created_at"]


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ["session_id", "language", "created_at", "messages"]


class ChatbotMessageRequestSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=True,
        min_length=1,
        max_length=1500,
        trim_whitespace=True,
        error_messages={
            "max_length": "Message too long. Please keep messages under 1,500 characters.",
            "blank": "Message cannot be blank.",
        },
    )
    session_id = serializers.UUIDField(required=False, allow_null=True, default=None)
    language = serializers.CharField(
        required=False,
        default="",
        max_length=5,
        allow_blank=True,
    )
    stream = serializers.BooleanField(required=False, default=False)

    def validate_message(self, value: str) -> str:
        """Basic injection guard — strip null bytes and control characters."""
        cleaned = "".join(ch for ch in value if ord(ch) >= 32 or ch in ("\n", "\t"))
        return cleaned[:1500]
