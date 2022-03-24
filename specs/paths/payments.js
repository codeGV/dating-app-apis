module.exports = [
  {
    url: "/token",
    get: {
      summary: "Get",
      description: "get token",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
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
    url: "/checkout",
    post: {
      summary: "payment",
      description: "create payment",
      parameters: [
        {
          in: "header",
          name: "x-access-token",
          description: "token to access api",
          required: true,
        },
        {
          in: "body",
          name: "body",
          description: "Model of payment creation",
          required: true,
          schema: {
            $ref: "#/definitions/paymentCreateReq",
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
      description: "get payment by Id",
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
          description: "paymentId",
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
      summary: "update payment",
      description: "update payment",
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
          description: "paymentId",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "body",
          description: "Model to payment update",
          required: true,
          schema: {
            $ref: "#/definitions/paymentUpdateReq",
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
