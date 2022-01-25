from multiprocessing.dummy import Manager
from rest_framework import serializers
from users.models import Projects,RatingProject

class ProjectAuthorizeSerializer(serializers.ModelSerializer):
    Manager = serializers.CharField(source='idOwner.name')
    Avatar = serializers.CharField(source='idOwner.avatar')
    class Meta:
        model = Projects
        fields = "__all__"
        
class ProjectUnAuthorizeSerializer(serializers.ModelSerializer):
    Manager = serializers.CharField(source='idOwner.name')
    Avatar = serializers.CharField(source='idOwner.avatar')
    class Meta:
        model = Projects
        fields = ("pk","title", "averageRate", "stage", "description","Manager","Avatar")        
class RatingProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingProject
        fields = "__all__"

