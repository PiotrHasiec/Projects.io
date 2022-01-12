import os
from .ApplicationApi import ApplicationsViewSet

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
    queryset = Advertisements.objects.all()
    def get_queryset(self):
      return  Advertisements.objects.all()

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(detail=True,methods=['POST'])
    def createApplication(self, request,pk = None, *args, **kwargs):
        #if pk == request.user.id:
            return ApplicationsViewSet.create_in_advertisment(request,str(pk))
        #return Response({"detail":"Błąd autoryzacji"})

    def list_in_project(request,pk = None):
        advertisements = Advertisements.objects.filter(idProject_id = pk)
        toResponse = [ {"nameProject": item.idProject.title, 
                        "namePosition":item.idPosition.name,
                        "description":item.description,
                        "idAdvertisment":item.id,
                        "idProject":item.idProject.id,
                        }for item in advertisements]

        return Response(toResponse)

    def closeAdvertisment(advertismentId, userId,projectId,positionId):
        collaborator = CollaboratorsProject(idProject = projectId, idUser  = userId, idPosition = positionId)
        collaborator.save()
        Advertisements.objects.filter(pk=advertismentId).delete()

    def destroy(self, request,pk = None, *args, **kwargs):
        Advertisements.objects.filter(pk=pk,idOwner_id =int(request.user.id)).delete()
        return  Response()
    
    