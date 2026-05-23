from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ["id", "email", "full_name", "role", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        return User.objects.create_user(**validated_data)


class SeekerLoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth import authenticate
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if user.role != "seeker":
            raise serializers.ValidationError(
                "This account is not a Job Seeker account. Please use Recruiter login."
            )
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")
        attrs["user"] = user
        return attrs


class RecruiterLoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth import authenticate
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if user.role != "recruiter":
            raise serializers.ValidationError(
                "This account is not a Recruiter account. Please use Job Seeker login."
            )
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")
        attrs["user"] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    profile_completion = serializers.ReadOnlyField()
    profile_photo_url  = serializers.SerializerMethodField()

    graduation_year        = serializers.IntegerField(allow_null=True, required=False)
    total_experience_years = serializers.FloatField(allow_null=True,   required=False)
    date_of_birth          = serializers.DateField(allow_null=True,    required=False)

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
        model  = User
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
            try:
                return obj.profile_photo.url
            except Exception:
                return None
        return None

    def to_internal_value(self, data):
        mutable = data.copy() if hasattr(data, "copy") else dict(data)
        for field in ["graduation_year", "total_experience_years", "date_of_birth"]:
            if field in mutable and mutable[field] == "":
                mutable[field] = None
        return super().to_internal_value(mutable)


class ProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ["profile_photo"]

    def validate_profile_photo(self, value):
        if value.size > 3 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 3MB.")
        if value.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            raise serializers.ValidationError("Only JPG, PNG, WEBP allowed.")
        return value