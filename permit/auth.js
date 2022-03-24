'use strict'

const jwt = require('jsonwebtoken')
const authConfig = require('config').get('auth')


const getToken = (_id, isExpired, context) => {
    const log = context.logger.start(`permit/auth/getToken:${_id}`)
    try {
        const extractFrom = {
            _id: _id,
            // device: device
        }

        const options = {}

        if (isExpired) {
            options.expiresIn = '11h'
        }

        const token = jwt.sign(extractFrom, authConfig.jwtKey, options)
        
        log.end()
        return token
    } catch (err) {
        throw new Error(err)
    }

}

const extractToken = (token, context) => {
    const log = context.logger.start(`permit/auth/requiresToken:${token}`)

    try {
        const decoded = jwt.verify(token, authConfig.jwtKey)
        log.end()
        return decoded
    } catch (err) {
        log.end()
        return err
    }
}

exports.getToken = getToken
exports.extractToken = extractToken
