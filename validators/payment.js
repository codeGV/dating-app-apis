"use strict";
const response = require("../exchange/response");

exports.canCreate = (req, res, next) => {
  if (!req.body.planId) {
    response.failure(res, "PlanId  is required");
  }
  if (!req.body.paymentMethodNonce) {
    response.failure(res, "PaymentMethodNonce  is required");
  }
  return next();
};
exports.getById = (req, res, next) => {
  if (!req.params.id) {
    response.failure(res, "id is required");
  }
  return next();
};

// exports.update = (req, res, next) => {
//     if (!req.params.id) {
//         response.failure(res, 'id is required');
//     }
//     return next()
// }
