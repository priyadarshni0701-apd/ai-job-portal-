from django.db import models
from django.conf import settings


class Resume(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
    )
    file = models.FileField(upload_to="resumes/%Y/%m/")
    original_filename = models.CharField(max_length=255)
    extracted_text = models.TextField(blank=True)
    extracted_skills = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.user.email} — {self.original_filename}"