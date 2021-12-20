from rest_framework import routers, urlpatterns
from .api import ProjectsViewSet

router = routers.DefaultRouter()
router.register("api/Projects",ProjectsViewSet)
urlpatterns = router.urls