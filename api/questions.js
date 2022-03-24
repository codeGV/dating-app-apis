'use strict'

const response = require('../exchange/response')
const service = require('../services/questions')
const mapper = require('../mappers/question')
const api = require('./api-base')('questions', 'question');
const message = require('../helpers/message');

api.delete = async (req, res) => {
    const log = req.context.logger.start('api/questions/delete')
    try {
        if (!service.deletequestion) {
            throw new Error(message.methodError)
        }
        const user = await service.deletequestion(req.params.id, req.context,res)
        log.end()
        return response.authorized(res, 'successfully removed')
    } catch (err) {
        log.error(err.message)
        log.end()
        return response.failure(res, err.message)
    }
}
module.exports = api