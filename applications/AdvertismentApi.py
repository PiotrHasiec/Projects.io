import os
from ApplicationApi import ApplicationsViewSet
from sys import path
from django.db import models
from django.http.response import JsonResponse
#from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import *
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, permissions
from django.db.models import Avg
from .serializers import *
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class AdvertisementsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdvertismentAuthorizeSerializer
    def get_queryset(self):
      return  Advertisements.objects.all()

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(detail=True,methods=['POST'])
    def createApplication(self, request,pk = None, *args, **kwargs):
        if pk == request.user.id:
            request.POST.set("idAdvertisement",str(pk))
            return ApplicationsViewSet.create(self, request, *args, **kwargs)
    