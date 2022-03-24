'use strict'
const response = require('../exchange/response');
const message = require('../helpers/message');
const pagination = require('../helpers/paging');

module.exports = (serviceName, mapperName) => {

    const service = require('../services')[serviceName];
    const mapper = require('../mappers')[mapperName];

    if (!service) {
        throw new Error(`services.${service} does not exist`);
    }
    if (!mapper) {
        throw new Error(`mappers.${mapper} does not exist`);
    }
    return {
        create: async (req, res) => {
            const log = req.context.logger.start(`api/${serviceName}`)
            try {
                if (!service.create) {
                    throw new Error(message.methodError);
                }
                const entity = await service.create(req, req.body, req.context, res);
                log.end()
                return response.data(res, mapper.toModel(entity))
            } catch (err) {
                log.error(err.message)
                log.end()
                return response.failure(res, err.message)
            }
        },
        getById: async (req, res) => {
            const log = req.context.logger.start(`api/${serviceName}/getById/${req.params.id}`)
            try {
                if (!service.getById) {
                    throw new Error(message.methodError);
                }
                const entity = await service.getById(req.params.id, req.context);
                log.end();
                return response.data(res, mapper.toModel(entity))
            } catch (err) {
                log.error(err.message)
                log.end()
                return response.failure(res, err.message)
            }
        },
        get: async (req, res) => {
            let log = req.context.logger.start(`api/${serviceName}/get`)
            try {
                if (!service.get) {
                    throw new Error(message.methodError);
                }
                const page = pagination.pager(req);
                const entity = await service.get(req, page, req.context);
                log.end();
                return response.data(res, entity)
            } catch (err) {
                log.error(err.message)
                log.end()
                return response.failure(res, err.message)
            }
        },
        update: async (req, res) => {
            let log = req.context.logger.start(`api/${serviceName}/${req.params.id}`)
            try {
                if (!service.update) {
                    throw new Error(message.methodError);
                }
                const entity = await service.update(req.params.id, req.body, req.context);
                log.end();
                return response.data(res, entity)
            } catch (err) {
                log.error(err.message)
                log.end()
                return response.failure(res, err.message)
            }
        }
    }
}