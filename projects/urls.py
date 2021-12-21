from rest_framework import routers, urlpatterns
from .api import *

router = routers.DefaultRouter()
router.register("api/Projects",ProjectsViewSet)
urlpatterns = router.urls