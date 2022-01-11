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
    def get_queryset(self):
      return  Applications.objects.all()
   

    serializer_class = ApplicationsAuthorizeSerializer
    def retrieve(self, request, pk=None):
        user = request.user
        user_id =user.id
        item = Applications.objects.get(pk = pk)
        ad_item = Advertisements.objects.get(pk = item.idAdvertisement)
        project_item = Projects.objects.get(pk = item.idOwner)
        project_owner_id = project_item.idOwner
        Projects.objects.get(pk = ad_item.idProject)
        if user_id == project_owner_id or user_id == item.idUser:     
            return Response( ApplicationsAuthorizeSerializer(item).data)
        return Response({"detail":"Błąd autoryzacji"})

   
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
        p = Projects.objects.filter(pk=pk).first()
        data = request.data
        if(p.idOwner_id ==int(request.user.id)):
          p.title = data.get("title",p.title)
          p.description = data.get("description",p.description)
          newstage =data.get("stage",p.stage)
          if newstage =="BS":
            p.stage =  Projects.ProjectStages.BRAINSTORM
          elif newstage =="EB":
            p.stage =  Projects.ProjectStages.EARLYBIRD
          elif newstage =="PG":
            p.stage =  Projects.ProjectStages.PlayGround
          p.save()
        return Response(ApplicationsAuthorizeSerializer(p).data)

          

    def partial_update(self, request, pk=None, *args, **kwargs):
         return Response({"detail": "Niedozwolona metoda \"PATCH\"."})
          
    

    def list(self, request, *args, **kwargs):

      #TO DO Wyświetl wszystkie zgłoszenia przyporządkowane do użytkownika który wysyła zapytanie
      data = request.data
      Applications_ = Applications.objects.filter( idUser =request.user.id )
      return Response(ApplicationsAuthorizeSerializer(Applications_,many = True).data)
        
    def get_queryset(self):
        return  Applications.objects.all()

    def extension(self, request):
        name, extension = os.path.splitext(request.name)

    @action(detail=True,methods=['POST'])
    def upload_project_files(self,request,pk=None, *args, **kwargs):
      
        if(request.user.id == pk):
          uploaded_file= request.FILES['document']
          name = ApplicationsViewSet.extension(self, uploaded_file)
          if (uploaded_file.size < 104857600):
            if (name == ".zip" or name == ".rar"):

              print(uploaded_file.size)
              print(name)
              path = default_storage.save('Projects.io-main/'+str( Projects.objects.filter(pk = pk).first().folder )+'/project'+name, ContentFile(uploaded_file.read()))
              print(path)
              return Response({"detail":"Pomyślnie przesłano plik"})
            return Response({"detail":"Nie poprawne rozszerzenie pliku"})
          return Response({"detail":"Za duży plik"})
        return Response({"detail":"Błąd autoryzacji"})
      

   #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)



#class ProjectViewSet(viewsets.ModelViewSet):
 #   permission_classes = [permissions.AllowAny]
 #   queryset =  Projects.objects.get(pk = id)

 #   serializer_class = ProjectSerializer