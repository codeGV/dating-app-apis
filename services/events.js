"use strict";

const response = require("../exchange/response");

const create = async (req, model, context, res) => {
  const log = context.logger.start(`services/events`);
  try {
    let event;
    if (context.user.type == "admin") {
      event = await new db.event(model).save();
    } else {
      throw response.unAuthorized(res, "unAuthorized_user");
    }
    log.end();
    return event;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const getById = async (id, context) => {
  const log = context.logger.start(`services/events/getById:${id}`);
  try {
    const event = await db.event.findById(id);
    log.end();
    return event;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const get = async (req, page, context) => {
  const log = context.logger.start(`services/events/get`);
  let events;
  let queryModel;
  const params = req.query;
  try {
    if (
      params.status != undefined &&
      params.status != null &&
      params.status != ""
    ) {
      queryModel = {
        status: {
          $eq: params.status,
        },
      };
      // find event
      events = await db.event
        .find(queryModel)
        .skip(page.skipCount)
        .limit(page.items)
        .sort({
          timeStamp: -1,
        });
    } else {
      events = await db.event
        .find()
        .skip(page.skipCount)
        .limit(page.items)
        .sort({
          timeStamp: -1,
        });
    }
    log.end();
    return events;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const deleteevent = async (id, context, res) => {
  const log = context.logger.start(`services/events/delete:${id}`);
  try {
    const event = await db.event.findByIdAndRemove(id);
    log.end();
    return event;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

exports.create = create;
exports.getById = getById;
exports.get = get;
exports.deleteevent = deleteevent;
