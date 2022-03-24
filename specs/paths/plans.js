module.exports = [
  {
    url: "/",
    get: {
      summary: "Search",
      description: "get plans list",
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
          name: "status",
          description: "active/inactive",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "planType",
          description: "basic/pro",
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
      description: "Create plan",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "body",
          description: "Model of User creation",
          required: true,
          schema: {
            $ref: "#/definitions/planCreateReq",
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
      description: "get plan by Id",
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
          description: "planId",
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
      summary: "Update plan",
      description: "update plan details",
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
          description: "planId",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "body",
          description: "Model of plan update",
          required: true,
          schema: {
            $ref: "#/definitions/planUpdateReq",
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
    url: "/delete/{id}",
    delete: {
      summary: "delete",
      description: " delete by Id",
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
          description: "planId",
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
  },
];
