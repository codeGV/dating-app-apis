module.exports = [{
    url: '/',
    post: {
        summary: 'Upload file',
        description: 'Upload file',
        parameters: [ {
            name: "file",
            in: "formData",
            description: "please choose an file",
            required: true,
            type: 'file'
        }, {
            in: 'body',
            name: "body",
            description: 'Model of document creation',
            required: true,
            schema: {
                $ref: '#/definitions/fileCreateReq'
            }
        }],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/Error'
                }
            }
        }
    }
}, {
    url: '/{id}',
    get: {
        summary: 'Get',
        description: 'get file by Id',
        parameters: [{
                in: 'header',
                name: 'x-access-token',
                description: 'token to access api',
                required: true,
                type: 'string'
            },
            {
                in: 'path',
                name: 'id',
                description: 'fileId',
                required: true,
                type: 'string'
            }
        ],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/Error'
                }
            }
        }
    }
}]