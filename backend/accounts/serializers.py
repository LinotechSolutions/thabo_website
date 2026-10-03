from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from accounts.models import User, UserRole


class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "role_display",
            "phone_number",
            "national_id",
            "country_code",
            "preferred_language",
            "is_verified",
            "date_joined",
        ]
        read_only_fields = ["id", "is_verified", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    role = serializers.ChoiceField(
        choices=[
            UserRole.PERSONAL,
            UserRole.BUSINESS,
            UserRole.CORPORATE,
            UserRole.DIASPORA,
            UserRole.SELF_SERVICE,
        ],
        default=UserRole.PERSONAL,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "phone_number",
            "national_id",
            "country_code",
            "preferred_language",
        ]

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(
            password=password,
            **validated_data,
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    portal_type = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        username = attrs.get("username").strip()
        password = attrs.get("password")

        # Support email or username login
        user = authenticate(username=username, password=password)
        if not user:
            # Try finding user by email
            try:
                user_obj = User.objects.get(email__iexact=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            raise serializers.ValidationError("Invalid credentials provided.")

        if not user.is_active:
            raise serializers.ValidationError("Account is inactive or disabled.")

        attrs["user"] = user
        return attrs
