from rest_framework import serializers
from .models import Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Users
        fields = "__all__"
        exclude = ("password","last_login","groups", "usr_permissions")

class OtherUserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Users
        fields = ("name", "avatar","description", "averageRate")


