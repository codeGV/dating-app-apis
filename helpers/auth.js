'use strict'

const logger = require('@open-age/logger')('helper/auth')
const context = require('./context-builder')
const response = require('../exchange/response')


exports.requireGuest = (req, res, next) => {

    context.create({}, logger).then((context) => {
        req.context = context
        next()
    }).catch((err) => {
        response.unAuthorized(res, 'internal server error')
    })
}

