from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from app.auth.permissions import (
    ROLE_PERMISSIONS
)

from app.auth.security import (
    decode_token
)

from app.auth.roles import (
    UserRole
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()

security = HTTPBearer()


def get_current_user(
    credentials:
    HTTPAuthorizationCredentials
    = Depends(security)
):
    """
    Get authenticated user.
    """

    token = (
        credentials.credentials
    )

    try:

        payload = (
            decode_token(
                token
            )
        )

        return payload

    except Exception:

        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,

            detail=
            "Invalid token"
        )


def require_permission(
    permission: str
):
    """
    RBAC permission checker.
    """

    def checker(
        user=Depends(
            get_current_user
        )
    ):

        role = (
            user.get(
                "role"
            )
        )

        allowed = (
            ROLE_PERMISSIONS.get(
                UserRole(role),
                []
            )
        )

        if permission not in allowed:

            logger.warning(
                f"Permission denied "
                f"for role: "
                f"{role}"
            )

            raise HTTPException(
                status_code=403,

                detail=
                "Permission denied"
            )

        return user

    return checker