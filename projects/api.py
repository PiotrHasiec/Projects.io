from django.http.response import JsonResponse
#from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from users.models import Projects
from users.models import Users
from rest_framework import viewsets, permissions
from .serializers import ProjectSerializer

class ProjectsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset =  Projects.objects.all()
   

    serializer_class = ProjectSerializer
    def create(self, request, *args, **kwargs):

      pass

    def byTitle(self, request, title = "", *args, **kwargs):
      self.queryset =  Projects.objects.filter(title__contains=str(title))
      return Response(ProjectSerializer(self.queryset, many = True).data)

    def list(self, request, *args, **kwargs):

      sorting = request.GET.get('sort',"")
      title_contain =  request.GET.get('titlecontain',"")
      desc_contain = request.GET.get('descecontain',"")
      count =  request.GET.get('count',"")
      queryset = Projects.objects.all()
      if not title_contain == "":
        queryset = queryset.filter(title__contains=str(title_contain))
      
      if (not desc_contain ==""):
          queryset = queryset.filter(decription__contains=str(title_contain))

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