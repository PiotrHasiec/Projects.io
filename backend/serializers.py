from rest_framework import serializers
from .models import Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Users
        #fields = "__all__"
        exclude = ["password","last_login","groups", "user_permissions"]

class OtherUserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Users
        fields = ("id","name", "avatar","description", "averageRate")


