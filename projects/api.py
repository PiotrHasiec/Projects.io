from django.db import models
from django.http.response import JsonResponse
#from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import Projects, RatingProject
from users.models import Users
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, permissions
from django.db.models import Avg
from .serializers import *


class ProjectsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset =  Projects.objects.all()
   

    serializer_class = ProjectSerializer
    def retrieve(self, request, pk=None):
        item = Projects.objects.get(pk = pk)
        return Response([ProjectSerializer(item).data, Users.objects.filter(pk = item.idOwner.pk).first().name])

    def byTitle(self, request, title = "", *args, **kwargs):
      self.queryset =  Projects.objects.filter(title__contains=str(title))
      return Response(ProjectSerializer(self.queryset, many = True).data)

    @action(detail=True,methods=['POST','GET'])
    def mark(self, request,pk=None, **kwargs):
        if request.method == 'POST':
          data = request.POST
        elif request.method == 'GET':
          data = request.GET
        

          RatingProject.objects.update_or_create(idProject_id = int(pk),
                                      idUser_id =int(data.get("idUser",None)),
                                      defaults = {'mark':  data.get("mark",None)} )


          
        mark =RatingProject.objects.filter(idProject_id = pk).aggregate(avg_mark = Avg('mark'))
        Projects.objects.filter(pk = pk).update(averageRate = mark['avg_mark'])
        return Response()

    def list(self, request, *args, **kwargs):

      sorting = request.GET.get('sort',"")
      title_contain =  request.GET.get('titlecontain',"")
      desc_contain = request.GET.get('descecontain',"")
      count =  request.GET.get('count',"")
      queryset = Projects.objects.all()
      if not title_contain == "":
        queryset = queryset.filter(title__icontains=str(title_contain))
      
      if (not desc_contain ==""):
          queryset = queryset.filter(decription__icontains=str(title_contain))

      if (not sorting == ""):
        queryset = queryset.order_by(sorting)

      if not count == "":
        queryset = queryset[:int(count)]

      projects = [ [ProjectSerializer(item).data, Users.objects.filter(pk = item.idOwner.pk).first().name] for item in queryset ]
      return Response(projects)
        
    #def get_queryset(self):
     #   return self.request.user.users.all()

   #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)



#class ProjectViewSet(viewsets.ModelViewSet):
 #   permission_classes = [permissions.AllowAny]
 #   queryset =  Projects.objects.get(pk = id)

 #   serializer_class = ProjectSerializer