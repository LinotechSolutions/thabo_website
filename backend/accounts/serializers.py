import re
import secrets
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from accounts.models import OnboardingApplication, User, UserRole


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


class OnboardingSerializer(serializers.ModelSerializer):
    """
    Serializer for customer journey submissions with support for nested profile object.
    Validates national ID format and sanitizes application entries.
    """
    profile = serializers.DictField(write_only=True, required=False)
    ref = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = OnboardingApplication
        fields = [
            "id",
            "reference_code",
            "service",
            "first_name",
            "surname",
            "national_id",
            "date_of_birth",
            "phone",
            "email",
            "address",
            "answers",
            "status",
            "created_at",
            "profile",
            "ref",
        ]
        read_only_fields = ["id", "status", "created_at"]
        extra_kwargs = {
            "first_name": {"required": False},
            "surname": {"required": False},
            "national_id": {"required": False},
            "date_of_birth": {"required": False},
            "phone": {"required": False},
            "email": {"required": False},
            "address": {"required": False},
            "reference_code": {"required": False},
        }

    def validate(self, attrs):
        profile = attrs.pop("profile", None)
        if profile and isinstance(profile, dict):
            if "firstName" in profile:
                attrs["first_name"] = profile["firstName"]
            if "surname" in profile:
                attrs["surname"] = profile["surname"]
            if "nationalId" in profile:
                attrs["national_id"] = profile["nationalId"]
            if "dateOfBirth" in profile:
                attrs["date_of_birth"] = profile["dateOfBirth"]
            if "phone" in profile:
                attrs["phone"] = profile["phone"]
            if "email" in profile:
                attrs["email"] = profile["email"]
            if "address" in profile:
                attrs["address"] = profile["address"]

        ref = attrs.pop("ref", None)
        if ref and not attrs.get("reference_code"):
            attrs["reference_code"] = ref

        # Ensure required identity fields exist
        required_fields = ["service", "first_name", "surname", "national_id", "email"]
        for f in required_fields:
            if not attrs.get(f):
                raise serializers.ValidationError({f: "This field is required."})

        # Validate National ID format (Zimbabwe format e.g. 63-1234567-X-42 or 63-119284 K18)
        nat_id = attrs["national_id"].strip()
        nat_regex = r"^\d{2}-?\d{6,7}\s?[A-Za-z]\s?\d{2}$"
        if not re.match(nat_regex, nat_id):
            raise serializers.ValidationError({
                "national_id": "Invalid Zimbabwe National ID format. Example: 63-1234567-X-42 or 63-119284 K18"
            })

        # Auto-generate reference code if not provided
        if not attrs.get("reference_code"):
            service_prefix = attrs.get("service", "CBZ").split("-")[-1].upper()
            attrs["reference_code"] = f"{service_prefix}-{secrets.token_hex(3).upper()}"

        return attrs

