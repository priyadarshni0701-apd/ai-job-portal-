from django.urls import path
from .views import (
    JobListCreateView,
    JobDetailView,
    ApplyJobView,
    MyApplicationsView,
    RecruiterJobsView,
    JobApplicationsView,
    UpdateApplicationStatusView,
)

urlpatterns = [
    path("", JobListCreateView.as_view(), name="job-list-create"),
    path("<int:pk>/", JobDetailView.as_view(), name="job-detail"),
    path("<int:job_id>/apply/", ApplyJobView.as_view(), name="job-apply"),
    path("<int:job_id>/applications/", JobApplicationsView.as_view(), name="job-applications"),
    path("my-applications/", MyApplicationsView.as_view(), name="my-applications"),
    path("my-jobs/", RecruiterJobsView.as_view(), name="my-jobs"),
    path("applications/<int:app_id>/status/", UpdateApplicationStatusView.as_view(), name="update-status"),
]