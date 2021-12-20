from rest_framework.decorators import permission_classes

from users.models import Projects
from rest_framework import viewsets, permissions
from .serializers import ProjectSerializer

class ProjectsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset =  Projects.objects.all()
   

    serializer_class = ProjectSerializer

    #def get_queryset(self):
     #   return self.request.user.users.all()

   #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)

#class ProjectViewSet(viewsets.ModelViewSet):
 #   permission_classes = [permissions.AllowAny]
 #   queryset =  Projects.objects.get(pk = id)

 #   serializer_class = ProjectSerializer