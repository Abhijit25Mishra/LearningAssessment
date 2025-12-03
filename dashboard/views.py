from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .storage import fetchJobsListFromDB, fetchJobFromDB, fetchSimilarJobs


"""
POST /dashboard/get-jobs-list
all objects in the request are optional
Request
{
    "minSalary" : 30,
    "employmentType" : [Full Time, Part Time],
    "searchRoleName":"abc"
}

Response
{
    "jobs" : [
        {
            "jobId": "abc123",
            "stars": 4
            "roleName": "Devops Engineer",
            "companyLogoUrl": "Netflix",
            "location": "Delhi",
            "employmentType": "Full Time",
            "salary": 10 ,
            "jobDescription": "......"
        },
        {
            "jobId": "abb122",
            "stars": 5
            "roleName": "Intern",
            "companyLogoUrl": "Google",
            "location": "Banglore",
            "employmentType": "Internship",
            "salary": 15
            "jobDescription": "......"
        }
    ]
}
"""
@api_view(['POST'])
def getJobsList(request):
    token = request.data.get('token')
    if(not validate_token(token)):
        return Response({
            "errorMessage":"NAVIGATE TO LOGIN"
        },
            status = status.HTTP_400_BAD_REQUEST
        )

    jobsList = fetchJobsListFromDB()

    minimumSalary = request.data.get('minimumSalary')
    employmentType = request.data.get('employmentType')
    searchRoleName = request.data.get('searchRoleName')

    print(minimumSalary, employmentType, searchRoleName)

    filtered_jobs = [
        job
        for job in jobsList
        if (minimumSalary is None or job['salary'] >= minimumSalary)
        and (not employmentType or  job['employmentType'] in employmentType)
        and (not searchRoleName or searchRoleName.lower() in job['roleName'].lower())
    ]
    if(filtered_jobs == []):
        return Response({
            "ErrorMessage":"No Data found"
        },
        status=  status.HTTP_204_NO_CONTENT)

    return Response({
        "data_count":len(filtered_jobs),
        "data":filtered_jobs
        },
        status = status.HTTP_200_OK
    )


"""
Request
{"jobId":"abc123"}

Response
{
    "jobId": "abc123",
    "roleName": "Devops Engineer",
    "companyLogoUrl": "Netflix",
    "location": "Delhi",
    "employmentType": "Full Time",
    "salary": 10 ,
    "jobDescription": "......"
    "skills":["HTML5", "CSS5", "Javascript", "React JS", "Redux"]
    "LifeAtCompanyDescription": "......"
    "LifeAtCompanyImageUrl": "image1"
}
"""
@api_view(['POST'])
def getJobDetails(request):
    token = request.data.get('token')
    if (not validate_token(token)):
        return Response({
            "errorMessage": "NAVIGATE TO LOGIN"
        },
        status=status.HTTP_400_BAD_REQUEST
        )

    jobId = request.data.get('jobId')
    jobDetails = fetchJobFromDB(jobId)
    if(jobDetails == None):
        return Response({
            "ErrorMessage":"No Data found"
        },
        status=  status.HTTP_204_NO_CONTENT)
    return Response({
        "data":jobDetails
        },
        status = status.HTTP_200_OK
    )

@api_view(['POST'])
def getSimilarJobs(request):
    """
    Request
    {"jobid":"abc123"}

    Response
    {
        "similarJobs":[
            {
                "jobid":"xyz123",
                "roleName":"Data Scientist",
                "companyLogoUrl" : "FaceBook",
                "stars": 4,
                "jobDescription":"......",
                "location":"delhi",
                "employmentType": "Full Time"
            },
            ...
        ]
    }
    """
    token = request.data.get('token')
    if (not validate_token(token)):
        return Response({
            "errorMessage": "NAVIGATE TO LOGIN"
        },
        status=status.HTTP_400_BAD_REQUEST
        )

    jobId = request.data.get('jobId')
    similarJobs = fetchSimilarJobs(jobId)
    print('in main api',similarJobs)
    
    return Response({
        "similarJobs": similarJobs
    },
    status=status.HTTP_200_OK
    )


@staticmethod
def validate_token(token:str):
    if(token == 'abc'):
        return True
    return False
