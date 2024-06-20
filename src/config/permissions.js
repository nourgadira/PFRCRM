export const permissions = [
    {
        path: "/Projets",
        name: "Projets",
        actions: [
            {
                name: "create",
                roles: [0],
            },
            {
                name: "payer",
                roles: [2],
            },
            {
                name: "read",
                roles: [2],
            },
            {
                name: "delete",
                roles: [2],
            }
        ]
    },
    {
        path: "/Clients",
        name: "Clients",
        actions: [
            {
                name: "create",
                roles: [3],
            },
            {
                name: "read",
                roles: [3],
            },
            {
                name: "delete",
                roles: [3],
            }
        ]
    },
    {
        path: "/Taches",
        name: "Taches",
        actions: [
            {
                name: "create",
                roles: [2],
            },
            {
                name: "read",
                roles: [2],
            },
            {
                name: "delete",
                roles: [2],
            }
        ]
    },
    {
        path: "/GetAllPArchive",
        name: "GetAllPArchive",
        actions: [
            {
                name: "update",
                roles: [0],
            },


            {
                name: "delete",
                roles: [0],
            },
            {
                name: "read",
                roles: [0],
            }
        ]
    },





    {
        path: "/Projets",
        name: "Projets",
        actions: [
            {
                name: "read",
                roles: [2],
            },

        ]
    },





    {
        path: "/users",
        name: "users",
        actions: [
            {
                name: "create",
                roles: [3],
            },
            {
                name: "delete",
                roles: [3],
            },
            {
                name: "show",
                roles: [2, 3],
            },
            {
                name: "update",
                roles: [3],
            },
            {
                name: "showR",
                roles: [3],
            },
            {
                name: "createR",
                roles: [3],
            },

        ]
    }
]
