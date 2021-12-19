from rest_framework import routers, urlpatterns
from .api import UserViewSet

router = routers.DefaultRouter()
router.register("api/Users",UserViewSet,basename= "index")

urlpatterns = router.urls