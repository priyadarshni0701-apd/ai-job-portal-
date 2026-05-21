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

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_to_say", "Prefer not to say"),
    )

    EXPERIENCE_CHOICES = (
        ("fresher", "Fresher"),
        ("0-1", "0–1 Years"),
        ("1-3", "1–3 Years"),
        ("3-5", "3–5 Years"),
        ("5-10", "5–10 Years"),
        ("10+", "10+ Years"),
    )

    # Core auth fields
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="seeker")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # ── Basic Info ──
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    profile_photo = models.ImageField(upload_to="profile_photos/", null=True, blank=True)

    # ── Location ──
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True, default="India")
    pincode = models.CharField(max_length=10, blank=True)

    # ── Professional Info ──
    headline = models.CharField(max_length=255, blank=True, help_text="e.g. Senior Python Developer at TechCorp")
    summary = models.TextField(blank=True, help_text="About yourself")
    experience_years = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES, blank=True)
    current_company = models.CharField(max_length=255, blank=True)
    current_designation = models.CharField(max_length=255, blank=True)
    notice_period = models.CharField(max_length=50, blank=True, help_text="e.g. 30 days, Immediate")
    expected_salary = models.CharField(max_length=50, blank=True, help_text="e.g. 12 LPA")
    current_salary = models.CharField(max_length=50, blank=True)

    # ── Education ──
    highest_education = models.CharField(max_length=255, blank=True, help_text="e.g. B.Tech Computer Science")
    college = models.CharField(max_length=255, blank=True)
    graduation_year = models.CharField(max_length=10, blank=True)

    # ── Skills & Links ──
    skills = models.JSONField(default=list, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    # ── Recruiter Extra ──
    company_name = models.CharField(max_length=255, blank=True)
    company_website = models.URLField(blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    industry = models.CharField(max_length=100, blank=True)

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
                self.full_name, self.phone, self.headline,
                self.city, self.summary, self.experience_years,
                self.highest_education, self.skills,
                self.linkedin_url or self.github_url,
            ]
        else:
            fields = [
                self.full_name, self.phone, self.company_name,
                self.city, self.industry, self.company_website,
            ]
        filled = sum(1 for f in fields if f)
        return round((filled / len(fields)) * 100)