from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    ProfilePhotoSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# ─────────────────────────────────────────────
#  REGISTER
# ─────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "message": "Registration successful.",
                    "user": UserProfileSerializer(user).data,
                    "tokens": tokens,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  LOGIN
# ─────────────────────────────────────────────
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email    = serializer.validated_data["email"]
            password = serializer.validated_data["password"]
            user     = authenticate(request, email=email, password=password)
            if user:
                tokens = get_tokens_for_user(user)
                return Response(
                    {
                        "message": "Login successful.",
                        "user": UserProfileSerializer(user).data,
                        "tokens": tokens,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            return Response(
                {"message": "Logout successful."},
                status=status.HTTP_200_OK,
            )
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
        # ── Step 1: safely copy request data ──
        try:
            data = request.data.copy()
        except AttributeError:
            data = dict(request.data)

        # ── Step 2: convert empty strings → None
        #    for fields Django stores as integer / float / date ──
        null_fields = [
            "graduation_year",
            "total_experience_years",
            "date_of_birth",
        ]
        for field in null_fields:
            if field in data and (data[field] == "" or data[field] is None):
                data[field] = None

        # ── Step 3: validate and save ──
        serializer = UserProfileSerializer(
            request.user,
            data=data,
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Profile updated successfully.",
                    "user": serializer.data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  PROFILE PHOTO — POST + DELETE
# ─────────────────────────────────────────────
class ProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ProfilePhotoSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            photo_url = None
            if request.user.profile_photo:
                try:
                    photo_url = request.user.profile_photo.url
                except Exception:
                    photo_url = None
            return Response(
                {
                    "message": "Photo uploaded successfully.",
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
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ─────────────────────────────────────────────
#  CHANGE PASSWORD
# ─────────────────────────────────────────────
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current  = request.data.get("current_password")
        new_pass = request.data.get("new_password")
        confirm  = request.data.get("confirm_password")

        # ── Validate all fields present ──
        if not all([current, new_pass, confirm]):
            return Response(
                {"error": "All three fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Check current password ──
        if not request.user.check_password(current):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Check new passwords match ──
        if new_pass != confirm:
            return Response(
                {"error": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Check minimum length ──
        if len(new_pass) < 8:
            return Response(
                {"error": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Check not same as current ──
        if request.user.check_password(new_pass):
            return Response(
                {"error": "New password must be different from current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Save new password ──
        request.user.set_password(new_pass)
        request.user.save()

        return Response(
            {"message": "Password changed successfully. Please login again."},
            status=status.HTTP_200_OK,
        )