from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("seeker", "Job Seeker"),
        ("recruiter", "Recruiter"),
    )

    # Core fields
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="seeker")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Profile fields
    profile_photo = models.ImageField(upload_to="profiles/", null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[("male", "Male"), ("female", "Female"), ("other", "Other"), ("prefer_not", "Prefer not to say")],
        blank=True
    )

    # Professional fields
    current_job_title = models.CharField(max_length=255, blank=True)
    current_company = models.CharField(max_length=255, blank=True)
    total_experience_years = models.FloatField(null=True, blank=True)
    expected_salary = models.CharField(max_length=100, blank=True)
    notice_period = models.CharField(max_length=100, blank=True)
    skills = models.JSONField(default=list)

    # Social/Links
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    # Education
    highest_education = models.CharField(max_length=255, blank=True)
    university = models.CharField(max_length=255, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)

    # Recruiter-specific
    company_name = models.CharField(max_length=255, blank=True)
    company_website = models.URLField(blank=True)
    company_size = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=255, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def profile_completion(self):
        """Calculate profile completion percentage."""
        if self.role == "seeker":
            fields = [
                self.full_name, self.phone, self.location, self.bio,
                self.current_job_title, self.total_experience_years,
                self.highest_education, self.skills,
                self.linkedin_url or self.github_url,
                self.profile_photo,
            ]
        else:
            fields = [
                self.full_name, self.phone, self.location, self.bio,
                self.company_name, self.company_website,
                self.industry, self.profile_photo,
            ]
        filled = sum(1 for f in fields if f)
        return int((filled / len(fields)) * 100)