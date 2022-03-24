"use strict";

const response = require("../exchange/response");
const service = require("../services/payments");
const mapper = require("../mappers/payment");

exports.payment = async (req, res) => {
  try {
    const payment = await service.payment(req, res);
    return response.data(res, payment);
  } catch (err) {
    return response.failure(res, res.message);
  }
};

exports.create = async (req, res) => {
  const log = req.context.logger.start(`api/payments/checkout`);
  try {
    const payment = await service.create(req, req.context, res);
    log.end();
    return response.data(res, payment);
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};
exports.paymentToken = async (req, res) => {
  const log = req.context.logger.start(`api/payments/paymentToken`);
  try {
    const token = await service.paymentToken(req, req.context);
    log.end();
    return response.data(res, token);
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};
exports.getById = async (req, res) => {
  const log = req.context.logger.start(`api/payments/getById/:id`);
  try {
    const payment = await service.getById(req.params.id, req.context);
    log.end();
    return response.data(res, payment);
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};
exports.update = async (req, res) => {
  const log = req.context.logger.start(`api/payments/:id`);
  try {
    const payment = await service.update(req.params.id, req.body, req.context);
    log.end();
    return response.data(res, payment);
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};
