from .models import Job
from django.db.models import Case, When, IntegerField
from .constants import EmploymentType

def fetchJobsListFromDB():
    """
    Fetches all jobs from the database and returns a list of dictionaries
    containing summary information.
    """
    jobs = Job.objects.all().values(
        'job_id', 'role_name', 'company_logo_url', 'location', 
        'employment_type', 'salary', 'job_description', 'stars'
    )
    
    # Convert keys to match the API response format (camelCase)
    formatted_jobs = []
    for job in jobs:
        # Get the label for the employment_type code
        employment_type_label = EmploymentType(job['employment_type']).label
        
        formatted_jobs.append({
            "jobId": job['job_id'],
            "stars": job['stars'],
            "roleName": job['role_name'],
            "companyLogoUrl": job['company_logo_url'],
            "location": job['location'],
            "employmentType": employment_type_label,
            "salary": job['salary'],
            "jobDescription": job['job_description']
        })
    return formatted_jobs

def fetchJobFromDB(job_id):
    """
    Fetches a single job by job_id and returns a dictionary with full details.
    """
    try:
        job = Job.objects.get(job_id=job_id)
        return {
            "jobId": job.job_id,
            "roleName": job.role_name,
            "companyLogoUrl": job.company_logo_url,
            "companyUrl": job.company_url,
            "location": job.location,
            "employmentType": job.get_employment_type_display(),
            "stars":job.stars,
            "salary": job.salary,
            "jobDescription": job.job_description,
            "skills": job.skills,
            "LifeAtCompanyDescription": job.life_at_company_description,
            "LifeAtCompanyImageUrl": job.life_at_company_image_url
        }
    except Job.DoesNotExist:
        return None

def fetchSimilarJobs(job_id):
    """
    - Prefer same company as current job
    - Within that, order by stars desc
    - Fill remaining slots with other companies, still by stars desc
    - Limit 3
    """
    try:
        current_job = Job.objects.get(job_id=job_id)
        print("current_job", current_job)
    except Job.DoesNotExist:
        return []

    qs = (
        Job.objects
        .exclude(job_id=current_job.job_id)
        .annotate(
            same_company=Case(
                When(company_logo_url=current_job.company_logo_url, then=1),
                default=0,
                output_field=IntegerField()
            )
        )
        .order_by('-same_company', '-stars')[:3]
    )

    return [
        {
            "jobId": job.job_id,
            "roleName": job.role_name,
            "companyLogoUrl": job.company_logo_url,
            "stars": job.stars,
            "jobDescription": job.job_description,
            "location": job.location,
            "employmentType": job.get_employment_type_display(),
        }
        for job in qs
    ]
