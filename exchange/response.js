'use strict'

const success = (res, message) => {
    res.status(200)
        .json({
            isSuccess: true,
            statusCode: 200,
            data: message
        })
}

const failure = (res, message) => {
    res.status(400)
        .json({
            isSuccess: false,
            statusCode: 400,
            error: message
        })
}

const unAuthorized = (res, message) => {
    res.status(401)
        .json({
            isSuccess: false,
            statusCode: 401,
            error: message
        })
}

const data = (res, data) => {
    res.status(200)
        .json({
            isSuccess: true,
            statusCode: 200,
            data: data,
            message: res.message
        })
}

const pendingReq = (res, data) => {
    res.status(201)
        .json({
            isSuccess: true,
            statusCode: 201,
            data: data,
            message: res.message
        })
}

const page = (res, data, pageNo, pageSize, total) => {
    res.status(200)
        .json({
            isSuccess: true,
            statusCode: 200,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            items: data
        })
}

const authorized = (res, data, token) => {
    res.status(200)
        .set('x-access-token', token)
        .json({
            isSuccess: true,
            statusCode: 200,
            data: data
        })
}
const notFound = (res, message) => {
    res.status(404)
        .json({
            isSuccess: false,
            statusCode: 404,
            error: message
        })
}
const notAcceptable = (res, message) => {
    res.status(406)
        .json({
            isSuccess: false,
            statusCode: 406,
            error: message
        })
}
const unprocessableEntity = (res, message) => {
    res.status(422)
        .json({
            isSuccess: false,
            statusCode: 422,
            error: message
        })
}


exports.data = data
exports.page = page
exports.success = success
exports.failure = failure
exports.authorized = authorized
exports.unAuthorized = unAuthorized
exports.pendingReq= pendingReq
exports.notAcceptable= notAcceptable
exports.notFound= notFound
exports.unprocessableEntity = unprocessableEntity 
