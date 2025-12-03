import os
import django
import random
import string

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from dashboard.models import Job
from dashboard.constants import EmploymentType

def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def populate(n=150):
    print(f"Generating {n} dummy jobs...")
    
    # Optional: Clear existing data
    # Job.objects.all().delete()

    roles = ['DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager']
    locations = ['Delhi', 'Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Remote']
    companies = ['Google', 'Netflix', 'Amazon', 'Microsoft', 'Meta', 'Startup Inc']
    
    jobs_to_create = []
    for i in range(n):
        role = random.choice(roles)
        company = random.choice(companies)
        
        job = Job(
            job_id=generate_random_string(8),
            role_name=role,
            company_logo_url=f"{company.lower()}",
            company_url=f"https://www.{company.lower()}.com/careers",
            location=random.choice(locations),
            employment_type=random.choice(EmploymentType.values),
            salary=random.randint(1, 60), # LPA
            job_description=f"This is a dummy description for {role} at {company}. " * 6,
            stars=random.randint(1, 5),
            skills=random.sample(["Python", "Java", "JavaScript", "C++", "C#", "Spring Boot", "Azure", "GCP", "Golang", "Node.js", "Django", "React", "AWS", "Docker", "Kubernetes", "SQL", "PostgreSQL", "MongoDB","NoSQL"], k=random.randint(3, 6)),
            life_at_company_description=f"Life at {company} is great! " * 7,
            life_at_company_image_url=f"{company.lower()}"
        )
        jobs_to_create.append(job)
    
    Job.objects.bulk_create(jobs_to_create)
    print(f"Successfully created {n} jobs.")

if __name__ == "__main__":
    populate()
