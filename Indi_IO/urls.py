
from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import path, include


#from users.views import index 
from users.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include("users.urls")),
  #  path('projekt/<id>/',projects, name = 'projekt'),
    path('login/',LoginView.as_view(),name = "login"),
    path('',include('account.urls')),
]
