module.exports = [
    {
      url: "/",
      get: {
        summary: "Search",
        description: "get events list",
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
        //   {
        //     in: "query",
        //     name: "eventType",
        //     description: "basic/pro",
        //     required: false,
        //     type: "string",
        //   },
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
        description: "Create event",
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
              $ref: "#/definitions/announcementCreateReq",
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
        description: "get event by Id",
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
            description: "eventId",
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
            description: "eventId",
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
  