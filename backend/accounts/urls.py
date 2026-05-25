from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    SeekerLoginView,
    RecruiterLoginView,
    LogoutView,
    ProfileView,
    ProfilePhotoView,
    ChangePasswordView,
)

urlpatterns = [
    path("register/",                RegisterView.as_view(),        name="register"),
    path("login/seeker/",            SeekerLoginView.as_view(),     name="seeker-login"),
    path("login/recruiter/",         RecruiterLoginView.as_view(),  name="recruiter-login"),
    path("logout/",                  LogoutView.as_view(),          name="logout"),
    path("token/refresh/",           TokenRefreshView.as_view(),    name="token-refresh"),
    path("profile/",                 ProfileView.as_view(),         name="profile"),
    path("profile/photo/",           ProfilePhotoView.as_view(),    name="profile-photo"),
    path("profile/change-password/", ChangePasswordView.as_view(), name="change-password"),
]