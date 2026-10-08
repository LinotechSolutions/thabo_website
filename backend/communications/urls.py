from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AnnouncementViewSet, ContactChannelViewSet, CorporateFactViewSet

router = DefaultRouter()
router.register(r"announcements", AnnouncementViewSet, basename="announcement")
router.register(r"contact-channels", ContactChannelViewSet, basename="contact-channel")
router.register(r"facts", CorporateFactViewSet, basename="fact")

urlpatterns = [
    path("", include(router.urls)),
]
