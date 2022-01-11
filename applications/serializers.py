from rest_framework import serializers
from users.models import CollaboratorsProject, Applications, Advertisements

#Advertisment
class AdvertismentAuthorizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisements
        fields = "__all__"
        
class CollaboratorsProjectUnAuthorizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisements
        fields = ("idProject","idUser", "idPosition")   
#CollaboratorsProject 
class CollaboratorsProjectAuthorizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollaboratorsProject
        fields = "__all__"
        
class CollaboratorsProjectUnAuthorizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollaboratorsProject
        fields = ("idProject","idUser", "idPosition")        
     

# Applications
class ApplicationsAuthorizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = "__all__"
        
class ApplicationsUnAuthorizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = ("idAdvertisement","description", "acceptionState")

