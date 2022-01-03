from django.urls import path, include,re_path
from django.views.generic import TemplateView
#from .api import RegisterAPI,LoginAPI, UserAPI

urlpatterns = [
    
    path('auth/',include('djoser.urls')),
     path('auth/',include('djoser.urls.jwt')),
    
]
#urlpatterns+=[re_path(r'^.*',TemplateView.as_view(template_name='index.html'))]
#    path('api/auth/register',RegisterAPI.as_view()),
#    path('api/auth/login',LoginAPI.as_view()),
#    path('api/auth/user',UserAPI.as_view()),
#    path('api/auth/logout',knox_views.LogoutView.as_view(), name = "knoc_logout")