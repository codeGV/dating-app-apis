'use strict'
const validator = require('validator');

const response = require('../exchange/response')

exports.canCreate = (req, res, next) => {
    if (req.body.loginType == 'app') {
        if (!req.body.firstName) {
            response.failure(res, 'FirstName  is required')
        }
        if (!req.body.lastName) {
            response.failure(res, 'LastName  is required')
        }
        if (!req.body.phone) {
            response.failure(res, 'phone is required')
        }
    }
    return next()
}
exports.userExists = (req, res, next) => {
    if (!req.body.loginType) {
        return response.failure(res, 'LoginType is required')
    }
    // if (!req.body.email) {
    //     return response.failure(res, 'Email is required')
    // }
    return next()
}

exports.getById = (req, res, next) => {

    if (!req.params && !req.params.id) {

        return response.failure(res, 'id is required')
    }

    return next()
}

exports.update = (req, res, next) => {
    if (!req.params && !req.params.id) {
        return response.failure(res, 'id is required')
    }
    return next()
}


exports.login = (req, res, next) => {
    if (!req.body.email) {
        response.failure(res, 'email is required')
    }
    if (!req.body.password) {
        response.failure(res, 'Password  is required')
    }
    return next()
}

// exports.changePassword = (req, res, next) => {
//     if (!req.body.password) {
//         response.failure(res, 'Password is required')
//     }
//     if (!req.body.newPassword) {
//         response.failure(res, 'NewPassword is required')
//     }

//     return next()
// }
// exports.forgotPassword = (req, res, next) => {
//     if (!req.body.phone) {
//         response.failure(res, 'Phone is required')
//     }
//     return next()
// }

// exports.resetPassword = (req, res, next) => {
//     if (!req.body.otp) {
//         response.failure(res, 'otp is required')
//     }
//     if (!req.body.newPassword) {
//         response.failure(res, 'new password is required')
//     }
//     return next()
// }