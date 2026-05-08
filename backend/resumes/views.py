import os
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from .models import Resume
from .serializers import ResumeUploadSerializer, ResumeSerializer
from .utils import extract_text_from_pdf, extract_skills_from_text
from jobs.models import Job
from jobs.serializers import JobSerializer
from .utils import get_recommended_jobs


class ResumeUploadView(APIView):
    """
    POST /api/resumes/upload/
    Upload a PDF resume. Extracts text and skills automatically.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.FILES)
        if serializer.is_valid():
            file = serializer.validated_data["file"]

            # Deactivate previous resumes
            Resume.objects.filter(user=request.user, is_active=True).update(is_active=False)

            # Save resume record
            resume = Resume.objects.create(
                user=request.user,
                file=file,
                original_filename=file.name,
            )

            # Extract text from saved PDF
            file_path = os.path.join(settings.MEDIA_ROOT, resume.file.name)
            extracted_text = extract_text_from_pdf(file_path)
            extracted_skills = extract_skills_from_text(extracted_text)

            resume.extracted_text = extracted_text
            resume.extracted_skills = extracted_skills
            resume.save()

            return Response(
                {
                    "message": "Resume uploaded and processed successfully.",
                    "resume": ResumeSerializer(resume).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyResumesView(generics.ListAPIView):
    """
    GET /api/resumes/
    List all resumes uploaded by the logged-in user.
    """
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


class ResumeDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/resumes/<id>/  → View a resume
    DELETE /api/resumes/<id>/  → Delete a resume
    """
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


class RecommendedJobsView(APIView):
    """
    GET /api/resumes/recommended-jobs/
    Returns top matched jobs based on user's active resume skills.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        active_jobs = Job.objects.filter(is_active=True).select_related("recruiter")
        recommendations = get_recommended_jobs(request.user, active_jobs)

        if not recommendations:
            return Response(
                {"message": "No resume found or no skills extracted yet.", "results": []},
                status=status.HTTP_200_OK,
            )

        results = []
        for item in recommendations:
            results.append(
                {
                    "match_percentage": item["match_percentage"],
                    "job": JobSerializer(item["job"]).data,
                }
            )

        return Response({"results": results}, status=status.HTTP_200_OK)