from app.auth.roles import (
    UserRole
)


ROLE_PERMISSIONS = {

    UserRole.ADMIN: [

        "upload",

        "query",

        "delete",

        "manage_users"
    ],

    UserRole.RESEARCHER: [

        "query",

        "view_citations"
    ],

    UserRole.VIEWER: [

        "query"
    ]
}