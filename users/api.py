import os
from rest_framework.decorators import action, permission_classes
from .models import  Users, RatingUsers
from rest_framework import response, viewsets, permissions
from .serializers import UserSerializer
from django.db.models import Avg
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    serializer_class = UserSerializer

    def get_queryset(self):
        return  Users.objects.all()

    @action(detail=True,methods=['POST','GET'])
    def me(self, request, *args, **kwargs):
        me = request.user.id
        return response.Response(UserSerializer(me))
        
    @action(detail=True,methods=['POST','GET'])
    def mark(self, request,pk=None, **kwargs):
        permission_classes = [permissions.IsAuthenticated]
        if request.method == 'POST':
          data = request.POST
        elif request.method == 'GET':
          data = request.GET
        

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

     
      return response.Response(UserSerializer(queryset,many = True).data)

    #def perform_create(self, serializer):
    #    return serializer.save(owner=self.request.user)
    @action(detail=True,methods=['POST','GET'])
    
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
      return response.Response({"detail":"wal się na ryj to nie jpg i D****** tez"}) 

    