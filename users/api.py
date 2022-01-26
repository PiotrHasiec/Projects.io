import os
from rest_framework.decorators import action, permission_classes
from .models import  CollaboratorsProject, Users, RatingUsers,Projects
from rest_framework import response, viewsets, permissions, status
from .serializers import *
from django.db.models import Avg
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from projects.serializers import ProjectUnAuthorizeSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    serializer_class = UserSerializer

    def get_queryset(self):
        return  Users.objects.all()

    @action(detail=False,methods=['POST','GET'])
    def myData(self, request, *args, **kwargs):
        me = request.user
        return response.Response(UserSerializer(me).data)


    def partial_update (self, request, pk=None):
      if request.data.get("password",None) !=None:
        return response.Response({"detail":"Błąd autoryzacji"},status=status.HTTP_401_UNAUTHORIZED) 
      elif request.user.id == int(pk):
        if request.user.is_developer == True:
          request.data.update({"is_developer":True})
        return super().partial_update(request, pk)
      else:
        return response.Response({"detail":"Błąd autoryzacji"},status=status.HTTP_401_UNAUTHORIZED) 
       

    def retrieve(self, request, pk=None):
        item = Users.objects.get(pk = pk)
        if request.user.id == int(pk):
          return response.Response({"User":UserSerializer(item).data,"isOwner":"True"})
        else:
          return response.Response({"User":OtherUserSerializer(item).data,"isOwner":"False"})


    @action(detail=True,methods=['GET'])
    def amCollaborator(self, request,pk=None, **kwargs):
      if request.user.id !=None:
          projectsWhereRatingUserHaveColaboration = CollaboratorsProject.objects.filter(idUser=request.user ).defer("idPosition","idUser").select_related("idProject").distinct()
          projectsWhereRatedUserHaveColaboration = CollaboratorsProject.objects.filter(idUser=int(pk) ).defer("idPosition","idUser").select_related("idProject").distinct()
          projectsWhereRatingUserIsOwner = Projects.objects.filter(idOwner=request.user )
          projectsWhereRatedUserIsOwner = Projects.objects.filter(idOwner=int(pk) )
          aa = any([ i.idProject.id == j.idProject.id  for i in projectsWhereRatingUserHaveColaboration for j in projectsWhereRatedUserHaveColaboration ])
          bb = any([ k.id == j.idProject.id for j in projectsWhereRatedUserHaveColaboration for k in projectsWhereRatingUserIsOwner])
          cc = any([l.id == i.idProject.id for l in projectsWhereRatedUserIsOwner for i in projectsWhereRatingUserHaveColaboration])
          if( aa  or bb or cc ):
            return response.Response("True")
          return response.Response("False")
      return response.Response("False")
     

    @action(detail=True,methods=['POST'])
    def mark(self, request,pk=None, **kwargs):
        if request.method == 'POST':
          data = request.data
        
          projectsWhereRatingUserHaveColaboration = CollaboratorsProject.objects.filter(idUser=request.user ).defer("idPosition","idUser").select_related("idProject").distinct()
          projectsWhereRatedUserHaveColaboration = CollaboratorsProject.objects.filter(idUser=int(pk) ).defer("idPosition","idUser").select_related("idProject").distinct()
          projectsWhereRatingUserIsOwner = Projects.objects.filter(idOwner=request.user )
          projectsWhereRatedUserIsOwner = Projects.objects.filter(idOwner=int(pk) )

          aa = any([ i.idProject.id == j.idProject.id  for i in projectsWhereRatingUserHaveColaboration for j in projectsWhereRatedUserHaveColaboration ])
          bb = any([ k.id == j.idProject.id for j in projectsWhereRatedUserHaveColaboration for k in projectsWhereRatingUserIsOwner])
          cc = any([l.id == i.idProject.id for l in projectsWhereRatedUserIsOwner for i in projectsWhereRatingUserHaveColaboration])
          if( aa  or bb or cc ):
          
            mark = int(int(data.get("rate",""))/20)
            RatingUsers.objects.update_or_create( idRatedUser_id = int(pk),
                                        idUser = request.user ,
                                        defaults = {'mark':  mark} )


            
            mark =RatingUsers.objects.filter(idRatedUser_id = pk).aggregate(avg_mark = Avg('mark'))
            Users.objects.filter(pk = pk).update(averageRate = mark['avg_mark'])
            return response.Response()
        return response.Response({"detail":"Błąd autoryzacji"})

    def list(self, request, *args, **kwargs):
      sorting = request.GET.get('sort',"")
      name_contain =  request.GET.get('namecontain',"")
      desc_contain = request.GET.get('descecontain',"")
      down = int( request.GET.get('down',0))
      up =  int(request.GET.get('up',100))
      queryset = Users.objects.all()
      if not name_contain == "":
        queryset = queryset.filter(name__icontains=str(name_contain))
      
      if (not desc_contain ==""):
          queryset = queryset.filter(decription__icontains=str(desc_contain))

      if (not sorting == ""):
        queryset = queryset.order_by(sorting)

      if( down >=0 and up >down):
        queryset = queryset[int(down):int(up)]

     
      return response.Response(OtherUserSerializer(queryset,many = True).data)

    #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)

    
    def extension(self, request):
        name, extension = os.path.splitext(request.name)
        return extension
        
    @action(detail=True,methods=['GET'])
    def getProjects(self,request,pk=None, *args, **kwargs):
        queryset = Projects.objects.filter(idOwner__id = pk)
        sorting = request.GET.get('sort',"")
        title_contain =  request.GET.get('titlecontain',"")
        desc_contain = request.GET.get('descecontain',"")
        up =  int(request.GET.get('up',10))
        down =  int(request.GET.get('down',0))
        
        if not title_contain == "":
          queryset = queryset.filter(title__icontains=str(title_contain))
        
        if (not desc_contain ==""):
            queryset = queryset.filter(decription__icontains=str(desc_contain))

        if (not sorting == ""):
          queryset = queryset.order_by(sorting)

        if( down >0 and up >down):
          queryset = queryset[int(down):int(up)]

        projects = [ {"Project": ProjectUnAuthorizeSerializer(item).data, "Meneger":Users.objects.filter(pk = item.idOwner.pk).first().name} for item in queryset ]
        return  response.Response(projects)

    @action(detail=True,methods=['POST'])
    def upload_avatar(self,request,pk=None, *args, **kwargs):
      if(request.user.id == int(pk)):
        uploaded_file= request.FILES['avatar']
        name = UserViewSet.extension(self, uploaded_file)
        if (uploaded_file.size < 6553600):
          if (name == ".jpg" or name == ".bmp" or name == ".png"):
             
            path = default_storage.save('./frontend/public/FileBase/'+str(request.user.id)+'/avatar'+name, ContentFile(uploaded_file.read()))
            request.user.avatar = path
            request.user.save()
            return response.Response()
          return response.Response({"detail":"Nieobsługiany typ pliku"} ,status=status.HTTP_400_BAD_REQUEST) 
        return response.Response({"detail":"Plik jest za duży"} ,status=status.HTTP_400_BAD_REQUEST) 
      return response.Response({"detail":"Błąd autoryzacji"} ,status=status.HTTP_401_UNAUTHORIZED) 

    