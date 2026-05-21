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
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    profile_completion = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "role", "date_joined",
            # Basic
            "phone", "date_of_birth", "gender", "profile_photo",
            # Location
            "city", "state", "country", "pincode",
            # Professional
            "headline", "summary", "experience_years",
            "current_company", "current_designation",
            "notice_period", "expected_salary", "current_salary",
            # Education
            "highest_education", "college", "graduation_year",
            # Skills & Links
            "skills", "linkedin_url", "github_url", "portfolio_url",
            # Recruiter
            "company_name", "company_website", "company_size", "industry",
            # Computed
            "profile_completion",
        ]
        read_only_fields = ["id", "email", "role", "date_joined", "profile_completion"]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name", "phone", "date_of_birth", "gender",
            "city", "state", "country", "pincode",
            "headline", "summary", "experience_years",
            "current_company", "current_designation",
            "notice_period", "expected_salary", "current_salary",
            "highest_education", "college", "graduation_year",
            "skills", "linkedin_url", "github_url", "portfolio_url",
            "company_name", "company_website", "company_size", "industry",
        ]


class ProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["profile_photo"]

    def validate_profile_photo(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 2MB.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs