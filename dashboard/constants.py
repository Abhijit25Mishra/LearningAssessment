from django.db import models

class EmploymentType(models.TextChoices):
    FULL_TIME = 'FT', 'Full Time'
    PART_TIME = 'PT', 'Part Time'
    INTERNSHIP = 'IT', 'Internship'
    FREELANCE = 'FR', 'Freelance'
