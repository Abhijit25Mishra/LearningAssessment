from django.urls import path
from . import views

urlpatterns = [
    path('get-jobs-list', views.getJobsList, name = 'joblist'),
    path('get-job-details', views.getJobDetails, name = 'jobdetails'),
    path('get-similar-jobs', views.getSimilarJobs, name = 'similarjobs')
]

