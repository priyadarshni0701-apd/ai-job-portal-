from rest_framework import serializers
from .models import Resume


class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["file"]

    def validate_file(self, value):
        if not value.name.endswith(".pdf"):
            raise serializers.ValidationError("Only PDF files are allowed.")
        if value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError("File size must not exceed 5MB.")
        return value


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id",
            "original_filename",
            "extracted_skills",
            "is_active",
            "uploaded_at",
        ]