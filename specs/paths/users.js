module.exports = [
  {
    url: "/",
    get: {
      summary: "Get",
      description: "get all rating",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
          type: "string",
        },
        {
          in: "query",
          name: "type",
          description: "user/admin",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "status",
          description: "active/inactive/pending",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "reportedUser",
          description: "true/false",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "userId",
          description: "userId",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "isRecommended",
          description: "true/false",
          required: false,
          type: "string",
        },{
          in: "query",
          name: "isLocation",
          description: "true/false",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "longitude",
          description: "longitude",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "latitude",
          description: "latitude",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "pageNo",
          description: "pageNo",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "items",
          description: "items",
          required: false,
          type: "string",
        },
      ],
      responses: {
        default: {
          description: "Unexpected error",
          schema: {
            $ref: "#/definitions/Error",
          },
        },
      },
    },

    post: {
      summary: "Create",
      description: "Create User",
      parameters: [
        // {
        //     in: 'header',
        //     name: 'x-access-token',
        //     description: 'token to access api',
        //     required: true,
        //     type: 'string'
        // },
        {
          in: "body",
          name: "body",
          description: "Model of User creation",
          required: true,
          schema: {
            $ref: "#/definitions/userCreateReq",
          },
        },
      ],
      responses: {
        default: {
          description: "Unexpected error",
          schema: {
            $ref: "#/definitions/Error",
          },
        },
      },
    },
  },
  {
    url: "/{id}",
    get: {
      summary: "Get",
      description: "get user by Id",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "id",
          description: "userId",
          required: true,
          type: "string",
        },
      ],
      responses: {
        default: {
          description: "Unexpected error",
          schema: {
            $ref: "#/definitions/Error",
          },
        },
      },
    },
    put: {
      summary: "Update user",
      description: "update user details",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "id",
          description: "userId",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "body",
          description: "Model of user update",
          required: true,
          schema: {
            $ref: "#/definitions/userUpdateReq",
          },
        },
      ],
      responses: {
        default: {
          description: {
            schema: {
              $ref: "#/definitions/Error",
            },
          },
        },
      },
    },
  },
  {
    url: "/login",
    post: {
      summary: "Login User",
      description: "Login User",
      parameters: [
        {
          in: "body",
          name: "body",
          description:
            "Model of User Login(Login through facebook,app,twitter)",
          required: true,
          schema: {
            $ref: "#/definitions/userLoginReq",
          },
        },
      ],
      responses: {
        default: {
          description: "Unexpected error",
          schema: {
            $ref: "#/definitions/Error",
          },
        },
      },
    },
  },
  {
    url: "/userExists",
    post: {
      summary: "isExists User",
      description: "isExists User",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Model of User exists in db",
          required: true,
          schema: {
            $ref: "#/definitions/userUserExistsReq",
          },
        },
      ],
      responses: {
        default: {
          description: "Unexpected error",
          schema: {
            $ref: "#/definitions/Error",
          },
        },
      },
    },
  },

  {
    url: "/logOut",
    post: {
      summary: "Logout",
      description: "Logout",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
          type: "string",
        },
      ],
      responses: {
        default: {
          description: {
            schema: {
              $ref: "#/definitions/Error",
            },
          },
        },
      },
    },
  },
  {
    url: "/socketUsers",
    get: {
      summary: "Get",
      description: "get socket users",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
          type: "string",
        },
        {
          in: "query",
          name: "userId",
          description: "userId",
          required: false,
          type: "string",
        },
      ],
      responses: {
        default: {
          description: "Unexpected error",
          schema: {
            $ref: "#/definitions/Error",
          },
        },
      },
    },
  },
  {
    url: "/addNewField",
    post: {
      summary: "add field",
      description: "add",
      parameters: [],
      responses: {
        default: {
          description: {
            schema: {
              $ref: "#/definitions/Error",
            },
          },
        },
      },
    },
  },
  {
    url: "/turn",
    post: {
      summary: "your turn",
      description: "turn",
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Model of turn creation",
          required: true,
          schema: {
            $ref: "#/definitions/userTurnReq",
          },
        },
      ],
      responses: {
        default: {
          description: {
            schema: {
              $ref: "#/definitions/Error",
            },
          },
        },
      },
    },
  },
];
