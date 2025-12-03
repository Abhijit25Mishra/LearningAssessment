from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


@api_view(['POST'])
def login_view(request):
    """
    POST /login/
    Body: {"username": "...", "password": "..."]
    Response: {"validuser":true, "token":"xyz"}
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if(username == 'rahul' and password == 'rahul@2021'):
        return Response({
            "validuser":True,
            "token":'abc'
        },
        status=status.HTTP_200_OK
        )
    return Response({
        "validuser":False
    },
    status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def get_user_data(request):
    token = request.data.get('token')
    if (not validate_token(token)):
        return Response({
            "errorMessage": "NAVIGATE TO LOGIN"
        },
        status=status.HTTP_400_BAD_REQUEST
        )
    return Response({
        "name":"Rahul",
        "position":"Lead Software Devloper and AI-ML Expert",
        "avatar_url":"imageLink"
    })



@staticmethod
def validate_token(token:str):
    if(token == 'abc'):
        return True
    return False


