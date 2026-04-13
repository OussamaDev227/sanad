from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsProviderOrAdminWrite(BasePermission):
    """
    Allow read-only for everyone.
    Allow write operations only to provider/admin roles.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_staff or user.role in ("provider", "admin"))
        )
