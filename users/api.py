import os
from rest_framework.decorators import action, permission_classes
from .models import  Users, RatingUsers
from rest_framework import response, viewsets, permissions
from .serializers import *
from django.db.models import Avg
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    serializer_class = UserSerializer

    def get_queryset(self):
        return  Users.objects.all()

    @action(detail=False,methods=['POST','GET'])
    def myData(self, request, *args, **kwargs):
        me = request.user
        return response.Response(UserSerializer(me).data)


    def retrieve(self, request, pk=None):
        item = Users.objects.get(pk = pk)
        if request.user.id == int(pk):
          return response.Response(UserSerializer(item).data)
        else:
          return response.Response(OtherUserSerializer(item).data)


    @action(detail=True,methods=['POST'])
    def mark(self, request,pk=None, **kwargs):
        if request.method == 'POST':
          data = request.POST
        #request.user.id
        #if 
          RatingUsers.objects.update_or_create( idRatedUser_id = int(pk),
                                      idUser_id =int(data.get("idUser",None)),
                                      defaults = {'mark':  data.get("mark",None)} )


          
        mark =RatingUsers.objects.filter(idRatedUser_id = pk).aggregate(avg_mark = Avg('mark'))
        Users.objects.filter(pk = pk).update(averageRate = mark['avg_mark'])
        return response.Response()

    def list(self, request, *args, **kwargs):
      sorting = request.GET.get('sort',"")
      name_contain =  request.GET.get('namecontain',"")
      desc_contain = request.GET.get('descecontain',"")
      count =  request.GET.get('count',"")
      queryset = Users.objects.all()
      if not name_contain == "":
        queryset = queryset.filter(name__icontains=str(name_contain))
      
      if (not desc_contain ==""):
          queryset = queryset.filter(decription__icontains=str(desc_contain))

      if (not sorting == ""):
        queryset = queryset.order_by(sorting)

      if not count == "":
        queryset = queryset[:int(count)]

     
      return response.Response(OtherUserSerializer(queryset,many = True).data)

    #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)

    
    def extension(self, request):
        name, extension = os.path.splitext(request.name)
        return extension
        
    @action(detail=True,methods=['POST','GET'])
    def upload_avatar(self,request,pk=None, *args, **kwargs):
      if request.method == 'POST':
        #if(request.user.id == pk):
          filename = request.data.get('filename')
          uploaded_file= request.FILES['document']
          name = UserViewSet.extension(self, uploaded_file)
          if (uploaded_file.size < 65536):
            if (name == ".jpg" or name == ".bmp"):
             
              path = default_storage.save('Projects.io/FilesBase/'+str(request.user.id)+'/avatar'+name, ContentFile(uploaded_file.read()))
              request.user.avatar = path
              return response.Response()
      return response.Response({"detail":"nieobsługiany typ pliku"}) 

    