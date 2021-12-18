from rest_framework import serializers
from .models import StandardUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandardUser
        fields = "__all__"

