import os
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

class ApplicationsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Applications.objects.all()
    def get_queryset(self):
      return  Applications.objects.all()
   

    serializer_class = ApplicationsAuthorizeSerializer
    def retrieve(self, request, pk=None):
        user = request.user
        user_id =user.id
        item = Applications.objects.get(pk = pk)
        ad_item = Advertisements.objects.get(pk = item.idAdvertisement.id)
        project_item = Projects.objects.get(pk = item.idOwner.id)
        project_owner_id = project_item.idOwner.id
        Projects.objects.get(pk = ad_item.idProject.id)
        if user_id == project_owner_id or user_id == item.idUser.id:     
            return Response( ApplicationsAuthorizeSerializer(item).data)
        return Response({"detail":"Błąd autoryzacji"})

    def create_in_advertisment(request,pk):
      data = request.data
      if data.get("description", "") == "":
        return Response({"detail":"Brak description"})
      p =Applications( idUser_id = request.user.id, idAdvertisement_id = int(pk),description = data.get("description"))
      p.save()
      return Response({"detail":"Udało sie utworzyć zgłoszenie"})
   
    def create(self, request, *args, **kwargs):
      data = request.data
      if data.get("idAdvertisement","") == "":
        return Response({"detail":"Brak idAdvertisement"})
      if data.get("description", "") == "":
        return Response({"detail":"Brak description"})
      p =Applications( idUser = request.user.id,
      idAdvertisement = int(data.get("idAdvertisement")),
      description = data.get("description")
      )
      p.save()
      return Response({"detail":"Udało sie utworzyć zgłoszenie"})

    def update(self, request, pk=None, *args, **kwargs):
      pass

          

    def partial_update(self, request, pk=None, *args, **kwargs):
         return Response({"detail": "Niedozwolona metoda \"PATCH\"."})
          
    def destroy(self,  request, pk = None, *args, **kwargs):
      # Usuwanie kiedy jest się właścicielem zgłoszenia
        Applications.objects.filter(pk=pk,idOwner_id =int(request.user.id)).delete()
        return  Response()

    @action(detail=True,methods=['POST'])
    def changeState(self, request,pk = None, *args, **kwargs):
      #TODO Zmiana stanu zgłoszenia jeśli jest się właścicielem projektu do którego jest przypisane ogłoszenie do którego przypisane jest zgłoszenie
        user = request.user
        user_id =user.id

        item = Applications.objects.get(pk = pk)
        ad_item = item.idAdvertisement
        project_item = ad_item.idProject
        
        project_owner_id = project_item.idOwner.id
        
        if user_id == project_owner_id:   
           state = request.data.get("acceptionState")
           if state == "P" :
             CollaboratorsProject.objects.filter(idProject = item.idAdvertisement.idProject,idUser= item.idUser ,idPosition = item.idAdvertisement.idPosition).delete()
             item.acceptionState = Applications.AcceptionStates.PENDING
           elif state == "A" :
             item.acceptionState = Applications.AcceptionStates.ACCEPTED
             colaborator = CollaboratorsProject(idProject = item.idAdvertisement.idProject,idUser= item.idUser ,idPosition = item.idAdvertisement.idPosition)
             colaborator.save()
           elif state == "R" :
             item.acceptionState = Applications.AcceptionStates.REJECTED
        else:
             return Response({"detail":"Błąd autoryzacji"})
        item.save()
        return Response()
        

    def list(self, request, *args, **kwargs):

      #TODO Wyświetl wszystkie zgłoszenia przyporządkowane do użytkownika który wysyła zapytanie
      data = request.data
      Applications_ = Applications.objects.filter( idUser =request.user )
      return Response(ApplicationsAuthorizeSerializer(Applications_,many = True).data)
        

   

