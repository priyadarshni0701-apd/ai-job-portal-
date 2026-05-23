from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer,
    SeekerLoginSerializer,
    RecruiterLoginSerializer,
    UserProfileSerializer,
    ProfilePhotoSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access":  str(refresh.access_token),
    }


# ─────────────────────────────────────────────
#  REGISTER
# ─────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user   = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "message": "Registration successful.",
                    "user":    UserProfileSerializer(user).data,
                    "tokens":  tokens,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  SEEKER LOGIN
# ─────────────────────────────────────────────
class SeekerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SeekerLoginSerializer(data=request.data)
        if serializer.is_valid():
            user   = serializer.validated_data["user"]
            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "message": "Login successful.",
                    "user":    UserProfileSerializer(user).data,
                    "tokens":  tokens,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": list(serializer.errors.values())[0][0]
                      if serializer.errors else "Login failed."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ─────────────────────────────────────────────
#  RECRUITER LOGIN
# ─────────────────────────────────────────────
class RecruiterLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RecruiterLoginSerializer(data=request.data)
        if serializer.is_valid():
            user   = serializer.validated_data["user"]
            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "message": "Login successful.",
                    "user":    UserProfileSerializer(user).data,
                    "tokens":  tokens,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": list(serializer.errors.values())[0][0]
                      if serializer.errors else "Login failed."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ─────────────────────────────────────────────
#  LOGOUT
# ─────────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful."})
        except Exception:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ─────────────────────────────────────────────
#  PROFILE — GET + PATCH
# ─────────────────────────────────────────────
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        try:
            data = request.data.copy()
        except AttributeError:
            data = dict(request.data)

        for field in ["graduation_year", "total_experience_years", "date_of_birth"]:
            if field in data and (data[field] == "" or data[field] is None):
                data[field] = None

        serializer = UserProfileSerializer(
            request.user, data=data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Profile updated successfully.",
                    "user":    serializer.data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  PROFILE PHOTO
# ─────────────────────────────────────────────
class ProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ProfilePhotoSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            photo_url = None
            try:
                if request.user.profile_photo:
                    photo_url = request.user.profile_photo.url
            except Exception:
                pass
            return Response(
                {
                    "message":           "Photo uploaded successfully.",
                    "profile_photo_url": photo_url,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            if request.user.profile_photo:
                request.user.profile_photo.delete(save=True)
            return Response({"message": "Photo removed successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  CHANGE PASSWORD
# ─────────────────────────────────────────────
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current  = request.data.get("current_password")
        new_pass = request.data.get("new_password")
        confirm  = request.data.get("confirm_password")

        if not all([current, new_pass, confirm]):
            return Response(
                {"error": "All three fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not request.user.check_password(current):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if new_pass != confirm:
            return Response(
                {"error": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(new_pass) < 8:
            return Response(
                {"error": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.user.check_password(new_pass):
            return Response(
                {"error": "New password must differ from current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        request.user.set_password(new_pass)
        request.user.save()
        return Response({"message": "Password changed successfully."})