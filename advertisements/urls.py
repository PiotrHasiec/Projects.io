
from rest_framework import routers, urlpatterns
from applications.ApplicationApi import *
from applications.AdvertismentApi import *
from applications import AdvertismentApi
#from . import *

router = routers.DefaultRouter()

router.register("api/Advertisment",AdvertisementsViewSet)
urlpatterns = router.urls
