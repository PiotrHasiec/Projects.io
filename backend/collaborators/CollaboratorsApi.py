from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import *
from rest_framework import viewsets, permissions, status
from .serializers import *









class CollaboratorsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CollaboratorsProjectAuthorizeSerializer
    queryset = CollaboratorsProject.objects.all()
    def get_queryset(self):
      return  CollaboratorsProject.objects.all()

    def create(self, request, *args, **kwargs):
        return Response(status = status.HTTP_403_FORBIDDEN )
    
    def list(self, request, *args, **kwargs):
        data  = request.GET
        if data.get("project","") == "":
            return Response(status = status.HTTP_403_FORBIDDEN )
        queryset = CollaboratorsProject.objects.filter(idProject_id = data.get("project","")).distinct()
        return Response(CollaboratorsProjectUnAuthorizeSerializer(queryset, many=True).data)
        
    def destroy(self, request, *args, **kwargs):
        return Response(status = status.HTTP_403_FORBIDDEN )
    def update(self, request, *args, **kwargs):
        return Response(status = status.HTTP_403_FORBIDDEN )
    def partial_update(self, request, *args, **kwargs):
        return Response(status = status.HTTP_403_FORBIDDEN )
    def retrieve(self, request, *args, **kwargs):
        return Response(status = status.HTTP_403_FORBIDDEN )