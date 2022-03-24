'use strict'

const response = require('../exchange/response')

exports.create = (req, res, next) => {

    if (!req.body.name) {
        response.failure(res, 'name is required')
    }
    
    return next()
}

exports.getById = (req, res, next) => {

    if (!req.params && !req.params.id) {

        return response.failure(res, 'id is required')
    }

    return next()
}


exports.delete = (req, res, next) => {
    if (!req.params && !req.params.id) {
        return response.failure(res, 'id is required')

    }
    return next()
}