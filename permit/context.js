'use strict'
const auth = require('./auth')
const response = require('../exchange/response')

const builder = (req, res, next) => {
    const context = {
        logger: require('@open-age/logger')('permit:context:builder')
    }

    req.context = context
    if (next) {
        return next()
    }
    return null
}

const validateToken = (req, res) => {
    builder(req, res)
    const log = req.context.logger.start(`permit/auth/validateToken`)
    try {
        const token = req.headers['x-access-token']

        if (!token) {
            log.end()
            return response.failure(res, 'token is required')
        }

        const details = auth.extractToken(token, req.context)

        if (details.name === 'TokenExpiredError') {
            log.end()
            return response.failure(res, 'token expired')
        }

        if (details.name === 'JsonWebTokenError') {
            log.end()
            return response.failure(res, 'token is invalid')
        }
        log.end()

        return response.success(res, 'token is valid')
    } catch (err) {
        throw new Error(err)
    }
}

const requiresToken = async (req, res, next) => {
    builder(req, res)
    const log = req.context.logger.start(`permit/auth/requiresToken`)
    try {
        const token = req.headers['x-access-token']

        if (!token) {
            log.end()
            return response.failure(res, 'token is required')
        }

        const decodedUser = auth.extractToken(token, req.context)

        const user = await db.user.findById(decodedUser._id)
        if (user) {

            if (user.token === '' || user.token === null || user.token === undefined) {
                return response.failure(res, 'token doesnot exist,maybe token is changed So, Try login again first.')
            }
            if ((user.token !== token)) {
                log.end()
                return response.unAuthorized(res, 'unauthorized_user')
            }

            req.context.user = user
            log.end()
            return next()
        }
        return response.unAuthorized(res, 'invalid token')
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

exports.builder = builder
exports.requiresToken = requiresToken
exports.validateToken = validateToken






// if (req.url == "/api/users/verifyRegOtp") {
//     if ((user.regToken !== token)) {
//         log.end()
//         return response.unAuthorized(res, 'invalid token to authorized user')
//     }
// } else if (req.url == "/api/users/verifyOtp") {
//     if ((user.tempToken !== token)) {
//         log.end()
//         return response.unAuthorized(res, 'invalid token ')
//     }
// } else {
//     if (user.token === '' || user.token === null || user.token === undefined) {
//         return response.failure(res, 'token doesnot exist,maybe token is changed So, Try login again first.')
//     }
//     if ((user.token !== token)) {
//         log.end()
//         return response.unAuthorized(res, 'unAuthorized User')
//     }
// }
