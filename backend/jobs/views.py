from rest_framework import status, generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Job, Application
from .serializers import (
    JobSerializer,
    JobCreateSerializer,
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationStatusUpdateSerializer,
)
from .permissions import IsRecruiter, IsJobSeeker, IsRecruiterOrReadOnly
from resumes.utils import calculate_match_percentage


# ─────────────────────────────────────────────
#  JOB VIEWS
# ─────────────────────────────────────────────

class JobListCreateView(generics.ListCreateAPIView):
    queryset       = Job.objects.filter(is_active=True).select_related("recruiter")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields  = ["title", "company", "location", "required_skills"]
    ordering_fields = ["created_at", "salary_min", "salary_max"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return JobCreateSerializer
        return JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsRecruiter()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Job.objects.filter(
            is_active=True
        ).select_related("recruiter")

        # Filter by job type
        job_type = self.request.query_params.get("job_type")
        if job_type:
            queryset = queryset.filter(job_type=job_type)

        # Filter by experience level
        experience = self.request.query_params.get("experience_level")
        if experience:
            queryset = queryset.filter(experience_level=experience)

        # Filter by location
        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/jobs/<id>/   → Job detail (all authenticated users)
    PUT    /api/jobs/<id>/   → Update job (owner recruiter only)
    PATCH  /api/jobs/<id>/   → Partial update (owner recruiter only)
    DELETE /api/jobs/<id>/   → Delete job (owner recruiter only)
    """
    queryset = Job.objects.all().select_related("recruiter")
    permission_classes = [IsRecruiterOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return JobCreateSerializer
        return JobSerializer


# ─────────────────────────────────────────────
#  APPLICATION VIEWS
# ─────────────────────────────────────────────

class ApplyJobView(APIView):
    """
    POST /api/jobs/<job_id>/apply/
    Job seekers apply for a job. Auto-calculates match percentage.
    """
    permission_classes = [IsJobSeeker]

    def post(self, request, job_id):
        job = get_object_or_404(Job, id=job_id, is_active=True)

        # Check duplicate application
        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {"error": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ApplicationCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Calculate AI match percentage
            match_pct = calculate_match_percentage(request.user, job)

            application = Application.objects.create(
                job=job,
                applicant=request.user,
                cover_letter=serializer.validated_data.get("cover_letter", ""),
                match_percentage=match_pct,
            )
            return Response(
                {
                    "message": "Application submitted successfully.",
                    "application": ApplicationSerializer(application).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyApplicationsView(generics.ListAPIView):
    """
    GET /api/jobs/my-applications/
    Job seeker sees all their applications.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return Application.objects.filter(
            applicant=self.request.user
        ).select_related("job", "job__recruiter")


class RecruiterJobsView(generics.ListAPIView):
    """
    GET /api/jobs/my-jobs/
    Recruiter sees all their posted jobs.
    """
    serializer_class = JobSerializer
    permission_classes = [IsRecruiter]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user
        ).prefetch_related("applications")


class JobApplicationsView(generics.ListAPIView):
    """
    GET /api/jobs/<job_id>/applications/
    Recruiter sees all applications for their job.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsRecruiter]

    def get_queryset(self):
        job_id = self.kwargs["job_id"]
        job = get_object_or_404(Job, id=job_id, recruiter=self.request.user)
        return Application.objects.filter(job=job).select_related("applicant")


class UpdateApplicationStatusView(APIView):
    """
    PATCH /api/jobs/applications/<app_id>/status/
    Recruiter updates application status.
    """
    permission_classes = [IsRecruiter]

    def patch(self, request, app_id):
        application = get_object_or_404(
            Application,
            id=app_id,
            job__recruiter=request.user,
        )
        serializer = ApplicationStatusUpdateSerializer(
            application, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Status updated.", "application": ApplicationSerializer(application).data}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)