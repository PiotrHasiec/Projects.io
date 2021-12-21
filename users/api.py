from rest_framework.decorators import permission_classes
from .models import  Users
from rest_framework import viewsets, permissions
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset =  Users.objects.all()
    

    serializer_class = UserSerializer

    #def get_queryset(self):
    #    return self.request.user.users.all()

    #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)

    