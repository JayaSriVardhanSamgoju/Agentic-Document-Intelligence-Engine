from datetime import (
    datetime,
    timedelta
)

from jose import (
    jwt,
    JWTError
)

from passlib.context import (
    CryptContext
)

from app.auth.roles import (
    UserRole
)

from app.core.config import (
    settings
)

from app.utils.logger import (
    get_logger
)


logger = get_logger()


pwd_context = (
    CryptContext(
        schemes=["bcrypt"],
        deprecated="auto"
    )
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


def hash_password(
    password: str
) -> str:
    """
    Hash password.
    """

    return pwd_context.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify password.
    """

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    username: str,
    role: UserRole
) -> str:
    """
    Generate JWT token.
    """

    expire = (
        datetime.utcnow()
        + timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": username,
        "role": role.value,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=ALGORITHM
    )

    logger.info(
        f"Token created "
        f"for {username}"
    )

    return token


def decode_token(
    token: str
) -> dict:
    """
    Decode JWT token.
    """

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[
                ALGORITHM
            ]
        )

        return payload

    except JWTError:

        logger.warning(
            "Invalid token"
        )

        raise ValueError(
            "Invalid token"
        )