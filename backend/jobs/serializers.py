from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Job, Application

User = get_user_model()


class RecruiterInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email"]


class JobSerializer(serializers.ModelSerializer):
    recruiter = RecruiterInfoSerializer(read_only=True)
    required_skills = serializers.ListField(
        child=serializers.CharField(), allow_empty=True
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "recruiter",
            "title",
            "company",
            "location",
            "job_type",
            "experience_level",
            "description",
            "required_skills",
            "salary_min",
            "salary_max",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "recruiter", "created_at", "updated_at"]


class JobCreateSerializer(serializers.ModelSerializer):
    required_skills = serializers.ListField(
        child=serializers.CharField(), allow_empty=False
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company",
            "location",
            "job_type",
            "experience_level",
            "description",
            "required_skills",
            "salary_min",
            "salary_max",
            "is_active",
        ]

    def create(self, validated_data):
        recruiter = self.context["request"].user
        return Job.objects.create(recruiter=recruiter, **validated_data)


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant_name = serializers.CharField(source="applicant.full_name", read_only=True)
    applicant_email = serializers.CharField(source="applicant.email", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "applicant_name",
            "applicant_email",
            "cover_letter",
            "status",
            "match_percentage",
            "applied_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "job",
            "applicant_name",
            "applicant_email",
            "status",
            "match_percentage",
            "applied_at",
            "updated_at",
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["cover_letter"]


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["status"]