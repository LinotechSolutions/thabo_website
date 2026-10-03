from rest_framework.throttling import AnonRateThrottle, SimpleRateThrottle, UserRateThrottle


class AuthRateThrottle(SimpleRateThrottle):
    """Stricter throttling for authentication endpoints (login, register, refresh)."""
    scope = "auth"

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class ChatbotRateThrottle(SimpleRateThrottle):
    """Scoped throttling for LLM chatbot requests to protect API cost and compute."""
    scope = "chatbot"

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class AnonGlobalThrottle(AnonRateThrottle):
    scope = "anon"


class UserGlobalThrottle(UserRateThrottle):
    scope = "user"
