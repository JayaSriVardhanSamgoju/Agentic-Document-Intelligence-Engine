from app.auth.security import (
    create_access_token,
    decode_token
)

from app.auth.roles import (
    UserRole
)


token = (
    create_access_token(
        username=
        "vardhan",

        role=
        UserRole.ADMIN
    )
)

print(
    "\nTOKEN:\n",
    token
)

decoded = (
    decode_token(
        token
    )
)

print(
    "\nDECODED:\n",
    decoded
)