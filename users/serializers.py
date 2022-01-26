from rest_framework import serializers
from .models import Users,SkillsDeveloper


class SkillsDeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model =  SkillsDeveloper
        exclude = ("idUser",)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Users
        exclude = ["password","last_login","groups", "user_permissions"]

class OtherUserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Users
        fields = ("id","name", "avatar","description", "averageRate")


       


