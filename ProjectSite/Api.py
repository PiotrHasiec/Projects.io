from rest_framework.decorators import permission_classes
from .models import StandardUser
from rest_framework import viewsets, permissions
from .serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = StandardUser.objects.all()
    permission_classes = [permissions.AllowAny]
   # def get_queryset(self):
   #     return self.request.user.StadardUser.objects.all()

    serializer_class = UserSerializer