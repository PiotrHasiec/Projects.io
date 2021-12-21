from rest_framework import serializers
from users.models import Projects,RatingProject

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = "__all__"

class RatingProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingProject
        fields = "__all__"

