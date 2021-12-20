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
    def create(self, request):
      pass

    def retrieve(self, request, pk=None):
      self.queryset =  Projects.objects.filter(title=str(pk))
      return Response(ProjectSerializer(self.queryset, many = True).data)

    def list(self, request, *args, **kwargs):

      projects = [ [ProjectSerializer(item).data,Users.objects.filter(pk = item.idOwner.pk).first().name] for item in Projects.objects.all() ]
  
      return Response( projects)
        
    #def get_queryset(self):
     #   return self.request.user.users.all()

   #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)

#class ProjectViewSet(viewsets.ModelViewSet):
 #   permission_classes = [permissions.AllowAny]
 #   queryset =  Projects.objects.get(pk = id)

 #   serializer_class = ProjectSerializer