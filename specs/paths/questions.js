module.exports = [
  {
    url: "/",
    get: {
      summary: "Search",
      description: "get questions list",
      parameters: [
        //     {
        //     in: 'header',
        //     name: 'x-access-token',
        //     description: 'token to access api',
        //     required: true,
        //     type: 'string'
        // },
        {
          in: "query",
          name: "type",
          description: "registration/interest/aboutMe",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "items",
          description: "get  question",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "pageNo",
          description: "pageNo",
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
      description: "Create question",
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
          description: "type:registration/profile",
          required: true,
          schema: {
            $ref: "#/definitions/questionCreateReq",
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
      description: "get question by Id",
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
          description: "questionId",
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

    // put: {
    //     summary: 'Update question',
    //     description: 'update question details',
    //     parameters: [{
    //         in: 'header',
    //         name: 'x-access-token',
    //         description: 'token to access api',
    //         required: true,
    //         type: 'string'
    //     },
    //     {
    //         in: 'path',
    //         name: 'id',
    //         description: 'questionId',
    //         required: true,
    //         type: 'string'
    //     },
    //     {
    //         in: 'body',
    //         name: 'body',
    //         description: 'Model of question update',
    //         required: true,
    //         schema: {
    //             $ref: '#/definitions/questionUpdateReq'
    //         }
    //     }
    //     ],
    //     responses: {
    //         default: {
    //             description: {
    //                 schema: {
    //                     $ref: '#/definitions/Error'
    //                 }
    //             }
    //         }
    //     }
    // }
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
          description: "questionId",
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
