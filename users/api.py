from rest_framework.decorators import permission_classes
from .models import StandardUser
from rest_framework import viewsets, permissions
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = StandardUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = UserSerializer

    def get_queryset(self):
        return self.request.user.users.all()

    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)

    