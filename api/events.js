'use strict'

const response = require('../exchange/response')
const service = require('../services/events')
const mapper = require('../mappers/event')
const api = require('./api-base')('events', 'event');
const message = require('../helpers/message');

api.delete = async (req, res) => {
    const log = req.context.logger.start('api/events/delete')
    try {
        if (!service.deleteevent) {
            throw new Error(message.methodError)
        }
        const user = await service.deleteevent(req.params.id, req.context,res)
        log.end()
        return response.authorized(res, 'successfully removed')
    } catch (err) {
        log.error(err.message)
        log.end()
        return response.failure(res, err.message)
    }
}
module.exports = api