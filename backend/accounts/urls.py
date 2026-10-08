from django.urls import path
from accounts.views import (
    CookieTokenRefreshView,
    LoginView,
    LogoutView,
    MeView,
    OnboardView,
    RegisterView,
)

app_name = "accounts"

urlpatterns = [
    path("onboard/", OnboardView.as_view(), name="onboard"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
