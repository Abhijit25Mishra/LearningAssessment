from django.db import models
from .constants import EmploymentType

# Create your models here.

class Job(models.Model):
    job_id = models.CharField(max_length=100, primary_key=True)
    role_name = models.CharField(max_length=200)
    company_logo_url = models.CharField(max_length=500)
    company_url = models.URLField(null=True, blank=True)
    location = models.CharField(max_length=200)
    employment_type = models.CharField(
        max_length=2,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME
    )
    salary = models.IntegerField()
    job_description = models.TextField()
    stars = models.IntegerField()
    skills = models.JSONField()  # Requires Django 3.0+
    life_at_company_description = models.TextField()
    life_at_company_image_url = models.CharField(max_length=500)

    def __str__(self):
        return self.role_name
