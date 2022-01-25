from rest_framework import routers, urlpatterns
from .ApplicationApi import *
from .AdvertismentApi import *
from applications import AdvertismentApi
#from . import *

router = routers.DefaultRouter()

router.register("api/Applications",ApplicationsViewSet)
urlpatterns = router.urls