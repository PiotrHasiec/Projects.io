
from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import path, include


#from users.views import index 
from users.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
  #  path('projekt/<id>/',projects, name = 'projekt'),
    path('',include('account.urls')),
    path('Projects/',include('projects.urls')),
    path('Users/',include("users.urls"))
]
