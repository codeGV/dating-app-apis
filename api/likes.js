// module.exports = require('./api-base')('likes', 'like')
"use strict";

const response = require("../exchange/response");
const service = require("../services/likes");
const mapper = require("../mappers/like");
const api = require("./api-base")("likes", "like");
const message = require("../helpers/message");

api.matchPermission = async (req, res) => {
    try {
      const like = await service.matchPermission(req.body, req.context);
      return response.data(res, like);
    } catch (err) {
      return response.failure(res, err.message);
    }
  };
  module.exports = api;