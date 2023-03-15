from rest_framework import routers, urlpatterns
from .CollaboratorsApi import *

from applications import AdvertismentApi
#from . import *

router = routers.DefaultRouter()

router.register("api/Collaborators",CollaboratorsViewSet)
urlpatterns = router.urls