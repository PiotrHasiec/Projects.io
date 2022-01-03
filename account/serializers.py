from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
#from django.contrib.auth.models import User
from django.contrib.auth  import authenticate, get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','name', 'email')


class RegisterSerializer(UserCreateSerializer):
    class Meta:
        model = User
        fields = ('id', 'email','name','password')
        #extra_kwargs = {'password':{'write_only':True}}

    #def create(self,validated_data):
    #    user= User.objects.create_user(validated_data['username'],validated_data['email'],validated_data['password'])
    #    return user

#class LoginSerializer(serializers.Serializer):
#    username = serializers.CharField()
#    password = serializers.CharField()
#    def validate(self, data):
#        user = authenticate(**data)
#        if user and user.is_active:
#            return user
#        raise serializers.ValidationError("Incorrect Credentials")


#    class Meta:
#        model = User
#        fields = ('id','username', 'email','password')
#        extra_kwargs = {'password':{'write_only':True}}


