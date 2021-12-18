from rest_framework import routers, urlpatterns
from .Api import UserViewSet

router = routers.DefaultRouter()
router.register("api/Users",UserViewSet,"ProjectSite")

urlpatterns = router.urls