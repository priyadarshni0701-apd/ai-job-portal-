from rest_framework.permissions import BasePermission


class IsRecruiter(BasePermission):
    """Allow access only to users with role='recruiter'."""
    message = "Only recruiters can perform this action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "recruiter"


class IsJobSeeker(BasePermission):
    """Allow access only to users with role='seeker'."""
    message = "Only job seekers can perform this action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "seeker"


class IsRecruiterOrReadOnly(BasePermission):
    """Recruiters can write; authenticated users can read."""

    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == "recruiter"

    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return obj.recruiter == request.user