#CollaboratorsProject 
from users.models import CollaboratorsProject
from rest_framework import serializers

class CollaboratorsProjectAuthorizeSerializer(serializers.ModelSerializer):
    userName = serializers.CharField(source='idUser.name')
    userEmail = serializers.CharField(source='idUser.email')
    Avatar = serializers.CharField(source='idUser.avatar')
    class Meta:
        model = CollaboratorsProject
        fields = "__all__"
        
class CollaboratorsProjectUnAuthorizeSerializer(serializers.ModelSerializer):
    userName = serializers.CharField(source='idUser.name')
    Avatar = serializers.CharField(source='idUser.avatar')
    class Meta:
        model = CollaboratorsProject
        fields = ("userName","idUser", "idPosition","Avatar")  