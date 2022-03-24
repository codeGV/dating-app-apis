"use strict";

const response = require("../exchange/response");

exports.canCreate = (req, res, next) => {
  if (!req.body.duration) {
    response.failure(res, "Duration is required");
  }
  if (!req.body.durationType) {
    response.failure(res, "DurationType is required");
  }
  if (!req.body.planType) {
    response.failure(res, "PlanType is required");
  }
  if (!req.body.monthlyPrice) {
    response.failure(res, "MonthlyPrice is required");
  }

  return next();
};

exports.getById = (req, res, next) => {
  if (!req.params && !req.params.id) {
    return response.failure(res, "id is required");
  }

  return next();
};

exports.update = (req, res, next) => {
  if (!req.params && !req.params.id) {
    return response.failure(res, "id is required");
  }
  return next();
};

exports.delete = (req, res, next) => {
  if (!req.params && !req.params.id) {
    return response.failure(res, "id is required");
  }
  return next();
};
