from rest_framework.permissions import BasePermission
from accounts.models import UserRole


class HasRole(BasePermission):
    """Base permission to verify authenticated user has one of the required roles."""
    allowed_roles = []

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return request.user.role in self.allowed_roles


class IsPersonalUser(HasRole):
    allowed_roles = [UserRole.PERSONAL]


class IsBusinessUser(HasRole):
    allowed_roles = [UserRole.BUSINESS]


class IsCorporateUser(HasRole):
    allowed_roles = [UserRole.CORPORATE]


class IsDiasporaUser(HasRole):
    allowed_roles = [UserRole.DIASPORA]


class IsSelfServiceUser(HasRole):
    allowed_roles = [UserRole.SELF_SERVICE, UserRole.PERSONAL, UserRole.BUSINESS]


class IsStaffRoleUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.role == UserRole.STAFF)
        )
