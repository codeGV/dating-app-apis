'use strict'

const response = require('../exchange/response')
const service = require('../services/files')
const api = require('./api-base')('files', 'file');
const message = require('../helpers/message');

api.upload = async (req, res) => {
    try {
        if (!service.upload) {
            throw new Error(message.methodError)
        }
        let data = await service.upload(req.files.file)
        return response.data(res, data)
    } catch (err) {

        return response.failure(res, err.message)
    }

}
module.exports = api