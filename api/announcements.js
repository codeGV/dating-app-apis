'use strict'

const response = require('../exchange/response')
const service = require('../services/announcements')
const mapper = require('../mappers/announcement')
const api = require('./api-base')('announcements', 'announcement');
const message = require('../helpers/message');

api.delete = async (req, res) => {
    const log = req.context.logger.start('api/announcements/delete')
    try {
        if (!service.deleteannouncement) {
            throw new Error(message.methodError)
        }
        const user = await service.deleteannouncement(req.params.id, req.context,res)
        log.end()
        return response.authorized(res, 'successfully removed')
    } catch (err) {
        log.error(err.message)
        log.end()
        return response.failure(res, err.message)
    }
}
module.exports = api