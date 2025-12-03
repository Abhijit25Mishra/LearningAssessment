from django.urls import path
from . import views

urlpatterns = [
    path('validate-user', views.login_view, name='login'),
    path('get_user_data', views.get_user_data, name='userdata')
]