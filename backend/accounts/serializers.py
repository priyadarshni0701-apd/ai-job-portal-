from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "role", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    profile_completion  = serializers.ReadOnlyField()
    profile_photo_url   = serializers.SerializerMethodField()

    # Numeric fields — must allow null
    graduation_year          = serializers.IntegerField(allow_null=True, required=False)
    total_experience_years   = serializers.FloatField(allow_null=True,   required=False)

    # Date field — must allow null
    date_of_birth = serializers.DateField(allow_null=True, required=False)

    # All text fields — allow blank so empty string is valid
    phone             = serializers.CharField(allow_blank=True, required=False)
    location          = serializers.CharField(allow_blank=True, required=False)
    bio               = serializers.CharField(allow_blank=True, required=False)
    gender            = serializers.CharField(allow_blank=True, required=False)
    current_job_title = serializers.CharField(allow_blank=True, required=False)
    current_company   = serializers.CharField(allow_blank=True, required=False)
    expected_salary   = serializers.CharField(allow_blank=True, required=False)
    notice_period     = serializers.CharField(allow_blank=True, required=False)
    linkedin_url      = serializers.URLField(allow_blank=True,  required=False)
    github_url        = serializers.URLField(allow_blank=True,  required=False)
    portfolio_url     = serializers.URLField(allow_blank=True,  required=False)
    highest_education = serializers.CharField(allow_blank=True, required=False)
    university        = serializers.CharField(allow_blank=True, required=False)
    company_name      = serializers.CharField(allow_blank=True, required=False)
    company_website   = serializers.URLField(allow_blank=True,  required=False)
    company_size      = serializers.CharField(allow_blank=True, required=False)
    industry          = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "role", "date_joined",
            "profile_photo", "profile_photo_url",
            "phone", "location", "bio", "date_of_birth", "gender",
            "current_job_title", "current_company",
            "total_experience_years", "expected_salary",
            "notice_period", "skills",
            "linkedin_url", "github_url", "portfolio_url",
            "highest_education", "university", "graduation_year",
            "company_name", "company_website", "company_size", "industry",
            "profile_completion",
        ]
        read_only_fields = [
            "id", "email", "role", "date_joined", "profile_completion",
        ]

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None

    def to_internal_value(self, data):
        """
        Convert empty strings → None for
        integer, float, and date fields.
        """
        mutable = data.copy() if hasattr(data, "copy") else dict(data)

        integer_float_date_fields = [
            "graduation_year",
            "total_experience_years",
            "date_of_birth",
        ]
        for field in integer_float_date_fields:
            if field in mutable and mutable[field] == "":
                mutable[field] = None

        return super().to_internal_value(mutable)


class ProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["profile_photo"]

    def validate_profile_photo(self, value):
        if value.size > 3 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 3MB.")
        allowed = ["image/jpeg", "image/png", "image/webp"]
        if value.content_type not in allowed:
            raise serializers.ValidationError("Only JPG, PNG, WEBP allowed.")
        return value