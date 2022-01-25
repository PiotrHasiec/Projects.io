from genericpath import isfile
import os
from sys import path
from django.db import models
from django.http import FileResponse
from django.http.response import JsonResponse
#from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework.response import Response
from applications.AdvertismentApi import AdvertisementsViewSet
from users.models import *
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, permissions, status
from django.db.models import Avg
from .serializers import *
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from applications.serializers import AdvertismentAuthorizeSerializer
from os.path import join
from os import listdir


class ProjectsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset =  Projects.objects.all()
   

    serializer_class = ProjectAuthorizeSerializer


    serializer_class = ProjectAuthorizeSerializer

    @action(detail=True,methods=['GET','POST'])
    def getAdvertisments(self, request, pk=None):
       return AdvertisementsViewSet.list_in_project(request, pk)


    @action(detail=True,methods=['GET','POST'])
    def createAdvertisment(self, request, pk=None):
      if self.isUserOwner(request, pk):
        data =request.data
        idProject = int(pk)
        position_name = data.get("position")
        Positions_collect = Positions.objects.filter(name = position_name)

        if Positions_collect.count() == 0:
          Position = Positions(name = position_name)
          Position.save()
        else:
           Position = Positions_collect.first()
           

        description = data.get("description")
        ad = Advertisements(idProject_id= idProject,idPosition = Position, description = description)
        ad.save()
        return Response({"pk":str(ad.pk)})

        

      else:
        return Response({"detail":"Błąd autoryzacji"})

    @action(detail=True,methods=['GET','POST'])
    def amOwner(self, request, pk=None):
      if Projects.objects.filter(pk = pk).first().idOwner.id == request.user.id:
        return Response("True")
      elif len(CollaboratorsProject.objects.filter(idProject__id = pk,idUser = request.user ))>0:
        return Response("Collaborator")
      return Response("False")
        
    def isUserOwner(self, request, pk=None):
      if Projects.objects.filter(pk = int(pk)).first().idOwner.id == request.user.id:
        
        return True
      else:
        return False

    def retrieve(self, request, pk=None):
        item = Projects.objects.get(pk = pk)
        return Response({"Project": ProjectUnAuthorizeSerializer(item).data})

    def byTitle(self, request, title = "", *args, **kwargs):
      queryset =  Projects.objects.filter(title__contains=str(title))
      return Response(ProjectAuthorizeSerializer(queryset, many = True).data)

   # @action(detail=True,methods=['DELETE'])
    def destroy(self, request,pk=None, **kwargs):
      Projects.objects.filter(pk=pk,idOwner_id =int(request.user.id)).delete()
      return Response()

    def create(self, request, **kwargs):
      data = request.data
      
      datapath = str(request.user.id)+"/"+data.get("title")+"/"+"data"
      datapath = "./frontend/public/FileBase/"+datapath
      presentationpath = str(request.user.id)+"/"+data.get("title")+"/"+"presentation"
      presentationpath = "./frontend/public/FileBase/"+presentationpath
      os.makedirs(datapath)
      os.makedirs(presentationpath)
      p =Projects( idOwner_id = request.user.id,title=data.get("title"),description=data.get("description"),folder=datapath,presentation =presentationpath)
      p.save()
      return Response({"pk":str(p.id)})

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
        return Response(ProjectAuthorizeSerializer(p).data)

          

    def partial_update(self, request, pk=None, *args, **kwargs):
        p = Projects.objects.filter(pk=pk).first()
        data = request.data
        if(p.idOwner_id ==int(request.user.id)):
          title = data.get("title",p.title); 
          if not title.isspace():
           return Response({"title":"Tytuł nie może być pusty"},status=status.HTTP_304_NOT_MODIFIED) 
          else:
            p.title = title
          p.description = data.get("description",p.description)
          newstage =data.get("stage",p.stage)
          if newstage =="BS":
            p.stage =  Projects.ProjectStages.BRAINSTORM
          elif newstage =="EB":
            p.stage =  Projects.ProjectStages.EARLYBIRD
          elif newstage =="PG":
            p.stage =  Projects.ProjectStages.PlayGround
          p.save()
        return Response(ProjectAuthorizeSerializer(p).data,status=status.HTTP_200_OK)
          
    @action(detail=True,methods=['POST'])
    def mark(self, request,pk=None, **kwargs):
        if request.method == 'POST':
          data = request.data
        
          mark = int(int(data.get("rate",None))/20)
        
          RatingProject.objects.update_or_create(idProject_id = int(pk),
                                      idUser_id =int(request.user.id),
                                      defaults = {'mark': mark} )


          
        mark =RatingProject.objects.filter(idProject_id = pk).aggregate(avg_mark = Avg('mark'))
        Projects.objects.filter(pk = pk).update(averageRate = mark['avg_mark'])
        return Response(status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):

      sorting = request.GET.get('sort',"")
      title_contain =  request.GET.get('titlecontain',"")
      desc_contain = request.GET.get('descecontain',"")
      up =  request.GET.get('up',"")
      down =  request.GET.get('down',0)
      queryset = Projects.objects.all()
      if not title_contain == "":
        queryset = queryset.filter(title__icontains=str(title_contain))
      
      if (not desc_contain ==""):
          queryset = queryset.filter(decription__icontains=str(desc_contain))

      if (not sorting == ""):
        queryset = queryset.order_by(sorting)

      if not up == "" and down =="": 
        queryset = queryset[int(down):int(up)]

      return Response(ProjectUnAuthorizeSerializer(queryset, many = True).data)
        
    def get_queryset(self):
        return  Projects.objects.all()

    def extension(self, request):
        name, extension = os.path.splitext(request.name)
        return extension

    @action(detail=True,methods=['POST'])
    def upload_project_files(self,request,pk=None, *args, **kwargs):
        project =Projects.objects.filter(pk = pk).first()
        
        if(request.user.id == project.idOwner.id):
          uploaded_file= request.FILES['document']
          name = ProjectsViewSet.extension(self, uploaded_file)
          if (uploaded_file.size < 209_715_200):
            queryset = Projects.objects.filter(pk = pk)
            if (name == ".zip"):
              path = default_storage.save("./"+str( project.folder )+'/project'+name, ContentFile(uploaded_file.read()))
              return Response({"detail":"Pomyślnie przesłano plik"})
            return Response({"detail":"Nie poprawne rozszerzenie pliku"},status=status.HTTP_400_BAD_REQUEST)
          return Response({"detail":"Za duży plik"},status=status.HTTP_304_NOT_MODIFIED)
        return Response({"detail":"Błąd autoryzacji"},status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=True,methods=['GET','POST'])
    def download(self,request,pk=None, *args, **kwargs):
        project =Projects.objects.filter(pk = pk).first()
        if(request.user.id == project.idOwner.id):

          f = open(str( project.folder )+'/project.zip', 'rb')
          return FileResponse(f)
          
        return Response({"detail":"Błąd autoryzacji"},status=status.HTTP_401_UNAUTHORIZED)


    @action(detail=True,methods=['GET'])
    def getImages(self,request,pk=None, *args, **kwargs):
          project =Projects.objects.filter(pk = pk).first()

          onlyfiles = [str( project.presentation )+f for f in listdir(str( project.presentation )) if isfile(join(str( project.presentation ), f))]
          if len(onlyfiles) == 0:
            onlyfiles =list(["./frontend/public/logo512.png"])
          return Response(onlyfiles)

    @action(detail=True,methods=['POST'])
    def upload_project_presentation(self,request,pk=None, *args, **kwargs):
      
        project =Projects.objects.filter(pk = pk).first()
        
        if(request.user.id == project.idOwner.id):
          uploaded_file= request.FILES['document']
          name = ProjectsViewSet.extension(self, uploaded_file)
          if (uploaded_file.size < 209_715_200):
            queryset = Projects.objects.filter(pk = pk)
            if (name == ".png" or name == ".jpg"):
              path = default_storage.save("./"+str( project.presentation)+'/project'+name, ContentFile(uploaded_file.read()))
              return Response({"detail":"Pomyślnie przesłano plik"})
            return Response({"detail":"Nie poprawne rozszerzenie pliku"},status=status.HTTP_400_BAD_REQUEST)
          return Response({"detail":"Za duży plik"},status=status.HTTP_304_NOT_MODIFIED)
        return Response({"detail":"Błąd autoryzacji"},status=status.HTTP_401_UNAUTHORIZED)
      
    @action(detail=False,methods=['POST','GET'])
    def myProjects(self,request, *args, **kwargs):
      if request.user.id != None:
        data = request.data
        sorting = data.get('sort',"")
        title_contain =  data.get('titlecontain',"")
        desc_contain = data.get('descecontain',"")
        up =  data.get('up',"")
        down =  data.get('down',0)
        queryset = Projects.objects.filter( idOwner__id = int(request.user.id))
        if not title_contain == "":
          queryset = queryset.filter(title__icontains=str(title_contain))
        
        if (not desc_contain ==""):
            queryset = queryset.filter(decription__icontains=str(desc_contain))

        if (not sorting == ""):
          queryset = queryset.order_by(sorting)

        if not up == "" and down =="": 
          queryset = queryset[int(down):int(up)]

        return Response(ProjectUnAuthorizeSerializer(queryset,many = True).data)
      return Response(status=status.HTTP_401_UNAUTHORIZED)

   #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)



#class ProjectViewSet(viewsets.ModelViewSet):
 #   permission_classes = [permissions.AllowAny]
 #   queryset =  Projects.objects.get(pk = id)

 #   serializer_class = ProjectSerializer