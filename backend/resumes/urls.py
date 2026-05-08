from django.urls import path
from .views import (
    ResumeUploadView,
    MyResumesView,
    ResumeDetailView,
    RecommendedJobsView,
)

urlpatterns = [
    path("upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("", MyResumesView.as_view(), name="my-resumes"),
    path("<int:pk>/", ResumeDetailView.as_view(), name="resume-detail"),
    path("recommended-jobs/", RecommendedJobsView.as_view(), name="recommended-jobs"),
]