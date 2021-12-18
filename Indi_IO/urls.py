
from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import path, include


from ProjectSite.views import index 
from ProjectSite.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    # path('projekty',index, name = "index"),
   path('',include("ProjectSite.urls"), name = "index"),
    path('kategoria/<id>/',categories, name = 'kategoria'),
    path('projekt/<id>/',projects, name = 'projekt'),
    path('login/',LoginView.as_view(),name = "login")
    
]
