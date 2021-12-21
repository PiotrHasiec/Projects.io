from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from .models import Projects
from .forms import  LoginForms
from django.contrib.auth.decorators import login_required




