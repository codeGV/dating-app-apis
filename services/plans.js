"use strict";

const response = require("../exchange/response");
const { round } = require("lodash");

const set = async (model, entity, context) => {
  const log = context.logger.start("services/plans/set");
  try {
    if (model.monthlyPrice) {
      entity.monthlyPrice = model.monthlyPrice;
    }
    if (entity.duration != 1) {
      // if update plans except monthly plan
      let plan = await db.plan.findOne({
        planType: {
          $eq: entity.planType,
        },
        duration: 1,
      });
      if (plan) {
        if (model.monthlyPrice <= plan.monthlyPrice) {
          let offer = plan.monthlyPrice - model.monthlyPrice;
          offer = (offer / plan.monthlyPrice) * 100;
          offer = round(offer, 2);
          entity.offer = offer;
        }
      }
    } else {
      // if update monthly plan
      let plans = await db.plan.find({
        planType: {
          $eq: entity.planType,
        },
        duration: { $ne: 1 },
      });
      if (plans) {
        plans.forEach((plan) => {
          if (model.monthlyPrice >= plan.monthlyPrice) {
            let offer = model.monthlyPrice - plan.monthlyPrice;
            offer = (offer / model.monthlyPrice) * 100;
            offer = round(offer, 2);
            plan.offer = offer;
          }
          plan.save();
        });
      }
    }
    if (model.status) {
      entity.status = model.status;
    }

    log.end();
    entity.save();
    return entity;
  } catch (err) {
    throw new Error(err);
  }
};

const create = async (req, model, context, res) => {
  const log = context.logger.start(`services/plans`);

  try {
    let plan;
    let count;
    if (context.user.type == "admin") {
      if (model.planType) {
        count = await db.plan
          .find({
            planType: {
              $eq: model.planType,
            },
          })
          .count();
      }
      if (count < 3) {
        if (model.duration != 1) {
          let existingPlan = await db.plan.findOne({
            planType: {
              $eq: model.planType,
            },
            duration: 1,
          });
          if (existingPlan) {
            if (model.monthlyPrice <= existingPlan.monthlyPrice) {
              let offer = existingPlan.monthlyPrice - model.monthlyPrice;
              offer = (offer / existingPlan.monthlyPrice) * 100;
              offer = round(offer, 2);
              model.offer = offer;
            }
          }
        }
        plan = await new db.plan(model).save();
      } else {
        throw new Error(`Unable to add more ${model.planType} plans`);
      }
    } else {
      throw response.unAuthorized(res, "unAuthorized_user");
    }
    log.end();
    return plan;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const update = async (id, model, context) => {
  const log = context.logger.start(`services/plans:${id}`);
  try {
    const entity = await db.plan.findById(id);

    if (!entity) {
      throw new Error("invalid plan");
    }
    // call set method to update plan
    await set(model, entity, context);

    log.end();
    return entity;
  } catch (err) {
    throw new Error(err);
  }
};

const getById = async (id, context) => {
  const log = context.logger.start(`services/plans/getById:${id}`);
  try {
    const plan = await db.plan.findById(id);
    log.end();
    return plan;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const get = async (req, page, context) => {
  const log = context.logger.start(`services/plans/get`);
  let plans;
  let query = {};
  const params = req.query;
  try {
    if (
      params.status != undefined &&
      params.status != null &&
      params.planType != undefined &&
      params.planType != null
    ) {
      query = {
        status: {
          $eq: params.status,
        },
        planType: {
          $eq: params.planType,
        },
      };
    } else if (
      params.status != undefined &&
      params.status != null &&
      params.planType == undefined &&
      params.planType == null
    ) {
      query = {
        status: {
          $eq: params.status,
        },
      };
    } else if (
      params.status == undefined &&
      params.status == null &&
      params.planType != undefined &&
      params.planType != null
    ) {
      query = {
        planType: {
          $eq: params.planType,
        },
      };
    } else {
      query = {};
    }
    plans = await db.plan.find(query);
    log.end();
    return plans;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

exports.create = create;
exports.getById = getById;
exports.get = get;
exports.update = update;
