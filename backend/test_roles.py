from app.auth.roles import (
    UserRole
)

from app.auth.permissions import (
    ROLE_PERMISSIONS
)

print(
    ROLE_PERMISSIONS[
        UserRole.ADMIN
    ]
)