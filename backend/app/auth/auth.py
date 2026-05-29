from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import (
    BaseModel
)

from app.auth.roles import (
    UserRole
)

from app.auth.security import (
    verify_password,
    create_access_token,
    hash_password
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# Temporary Fake DB
FAKE_USERS_DB = {

    "admin": {

        "username":
        "admin",

        "password":
        hash_password(
            "admin123"
        ),

        "role":
        UserRole.ADMIN
    },

    "researcher": {

        "username":
        "researcher",

        "password":
        hash_password(
            "research123"
        ),

        "role":
        UserRole.RESEARCHER
    },

    "viewer": {

        "username":
        "viewer",

        "password":
        hash_password(
            "viewer123"
        ),

        "role":
        UserRole.VIEWER
    }
}


class LoginRequest(
    BaseModel
):
    username: str
    password: str


@router.post(
    "/login"
)
def login(
    request:
    LoginRequest
):
    """
    Login endpoint.
    """

    user = (
        FAKE_USERS_DB.get(
            request.username
        )
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail=
            "Invalid username"
        )

    is_valid = (
        verify_password(
            request.password,
            user["password"]
        )
    )

    if not is_valid:

        raise HTTPException(
            status_code=401,
            detail=
            "Invalid password"
        )

    token = (
        create_access_token(
            username=
            user["username"],

            role=
            user["role"]
        )
    )

    logger.info(
        f"{request.username} "
        f"logged in"
    )

    return {
        "access_token":
        token,

        "token_type":
        "bearer",

        "role":
        user[
            "role"
        ]
    }