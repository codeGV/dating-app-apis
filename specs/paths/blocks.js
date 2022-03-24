module.exports = [
    {
      url: "/",
      post: {
        summary: "Create",
        description: "Create favorite",
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
            description: "Model of favorite creation",
            required: true,
            schema: {
              $ref: "#/definitions/blockCreateReq",
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
      get: {
        summary: "Get",
        description: "get all favorite",
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
            description: "",
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
    },
    // {
    //   url: "/{id}",
    //   put: {
    //     summary: "Update",
    //     description: "update user blocks",
    //     parameters: [
    //       {
    //         in: "header",
    //         name: "x-access-token",
    //         description: "token to access api",
    //         required: true,
    //         type: "string",
    //       },
    //       {
    //         in: "path",
    //         name: "id",
    //         description: "blockId",
    //         required: true,
    //         type: "string",
    //       },
    //       {
    //         in: "body",
    //         name: "body",
    //         description: "Model to user block details",
    //         required: true,
    //         schema: {
    //           $ref: "#/definitions/blockUpdateReq",
    //         },
    //       },
    //     ],
    //     responses: {
    //       default: {
    //         description: {
    //           schema: {
    //             $ref: "#/definitions/Error",
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  ];
  