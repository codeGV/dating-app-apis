"use strict";

const response = require("../exchange/response");
const service = require("../services/users");
const mapper = require("../mappers/user");
const api = require("./api-base")("users", "user");
const message = require("../helpers/message");

api.login = async (req, res) => {
  const log = req.context.logger.start("api/users/login");
  try {
    if (!service.login) {
      throw new Error(message.methodError);
    }
    const user = await service.login(req.body, req.context, res);
    log.end();
    return response.authorized(res, mapper.toUser(user));
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};
api.getSocketUsers = async (req, res) => {
  const log = req.context.logger.start("api/users/getSocketUsers");
  try {
    if (!service.login) {
      throw new Error(message.methodError);
    }
    const user = await service.getSocketUsers(req, req.context);
    log.end();
    return response.data(res, user);
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};

api.userExists = async (req, res) => {
  const log = req.context.logger.start("api/users/userExists");
  try {
    if (!service.userExists) {
      throw new Error(message.methodError);
    }
    const user = await service.userExists(req.body, req.context, res);
    log.end();
    return response.authorized(res, user);
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};

api.logOut = async (req, res) => {
  const log = req.context.logger.start("api/users/logout");
  try {
    if (!service.logOut) {
      throw new Error(message.methodError);
    }
    const user = await service.logOut(res, req.context);
    log.end();
    return response.data(res, mapper.toModel(user));
  } catch (err) {
    log.error(err.message);
    log.end();
    return response.failure(res, err.message);
  }
};
api.addField = async (req, res) => {
  try {
    const user = await service.addField();
    return response.data(res, user);
  } catch (err) {
    return response.failure(res, err.message);
  }
};
api.turn = async (req, res) => {
  try {
    const user = await service.turn(req.body, req.context);
    return response.data(res, user);
  } catch (err) {
    return response.failure(res, err.message);
  }
};

module.exports = api;
