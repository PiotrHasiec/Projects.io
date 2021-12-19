from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from .models import Projects
from .forms import  LoginForms
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    return HttpResponse("aaa")
# Create your views here.
def index(request):
    Projekty =Projects.objects.all()
    dane = {'Projekty':Projekty}
    return render(request,"index.html",dane)


def projects (request,id):
    projekt_user = Projects.objects.get(pk = id)
    
    return JsonResponse(projekt_user)

def user_login(request):
    if request.method == "POST":
        form = LoginForms(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(username = cd['username'],password = cd['password'])
            if user is not None:
                if user.is_active:
                    login(request,user)
                    return HttpResponse("Ok")
                else:
                    return HttpResponse("Konto zablokowane")
        else:
            return HttpResponse("Nieprawidłowe dane")
    else:
        form = LoginForms()

    return render(request, "login.html",{'form':form})


