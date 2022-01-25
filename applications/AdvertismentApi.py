
from .ApplicationApi import ApplicationsViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import *
from rest_framework import viewsets, permissions
from .serializers import *


class AdvertisementsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdvertismentAuthorizeSerializer
    queryset = Advertisements.objects.all()
    def get_queryset(self):
      return  Advertisements.objects.all()

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(detail=True,methods=['POST','DELETE'])
    def createApplication(self, request,pk = None, *args, **kwargs):
        #if pk == request.user.id:
        if request.method == 'POST':
            return ApplicationsViewSet.create_in_advertisment(request,str(pk))
        elif request.method == 'DELETE':
            aplicationToDelete = Applications.objects.filter(idAdvertisement_id = pk, idUser = request.user)
            aplicationToDelete.delete()
            return Response()
        #return Response({"detail":"Błąd autoryzacji"})

    def list_in_project(request,pk = None):
        advertisements = Advertisements.objects.filter(idProject_id = pk)
        project = Projects.objects.filter(pk = pk).first()
        if(request.user == project.idOwner):
            toResponse = [ {"nameProject": item.idProject.title, 
                            "namePosition":item.idPosition.name,
                            "description":item.description,
                            "idAdvertisment":item.id,
                            "idProject":item.idProject.id,
                            
                            "Aplications":ApplicationsUnAuthorizeSerializer(Applications.objects.filter(idAdvertisement = item,idAdvertisement__idProject__idOwner_id = request.user.id),many=True).data
                            }for item in advertisements]
        else:
            toResponse = [ {"nameProject": item.idProject.title, 
                            "namePosition":item.idPosition.name,
                            "description":item.description,
                            "idAdvertisment":item.id,
                            "idProject":item.idProject.id,
                            
                            "Aplications":ApplicationsUnAuthorizeSerializer(Applications.objects.filter(idAdvertisement = item,idUser = request.user.id),many=True).data
                            }for item in advertisements]

        return Response(toResponse)

    def closeAdvertisment(advertismentId, userId,projectId,positionId):
        collaborator = CollaboratorsProject(idProject = projectId, idUser  = userId, idPosition = positionId)
        collaborator.save()
        Advertisements.objects.filter(pk=advertismentId).delete()

    def destroy(self, request,pk = None, *args, **kwargs):
        Advertisements.objects.filter(pk=pk,idOwner_id =int(request.user.id)).delete()
        return  Response()
    
    