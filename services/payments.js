"use strict";
const braintree = require("braintree");
const moment = require("moment");

const tempPaymentModel = async (payment, canAudioCall, canVedioCall) => {
  var result = {
    status: payment.status,
    _id: payment._id,
    transactionId: payment.transactionId,
    userId: payment.userId,
    planId: payment.planId,
    expiryDate: payment.expiryDate,
    audioCall: payment.audioCall,
    vedioCall: payment.vedioCall,
    timeStamp: payment.timeStamp,
    canAudioCall: canAudioCall,
    canVedioCall: canVedioCall,
  };
  if (payment.lastAudioCallTime) {
    result.lastAudioCallTime = payment.lastAudioCallTime;
  }
  if (payment.lastVedioCallTime) {
    result.lastVedioCallTime = payment.lastVedioCallTime;
  }
  return result;
};

const set = async (model, entity, context) => {
  const log = context.logger.start("services/payments/set");
  try {
    let now = await moment();

    // update audio call
    if (model.from == "audioCall") {
      if (entity.audioCall && entity.audioCall > 0) {
        entity.audioCall = entity.audioCall - 1;
      }
      entity.lastAudioCallTime = now;
    }

    // update vedio call
    if (model.from == "vedioCall") {
      if (entity.vedioCall && entity.vedioCall > 0) {
        entity.vedioCall = entity.vedioCall - 1;
      }
      entity.lastVedioCallTime = now;
    }
    log.end();
    entity.save();
    return entity;
  } catch (err) {
    throw new Error(err);
  }
};

const payment = async (req, res) => {
  // all credentials
  const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "tgjvv93j225njykw",
    publicKey: "bfz6xr9qw3scx7ms",
    privateKey: "6767c6c455700f39995c93301eac6a4a",
  });

  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;

  return new Promise((resolve, reject) => {
    gateway.transaction.sale(
      {
        amount: "31.00",
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (result) {
          resolve(result);
          console.log(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const create = async (req, context, res) => {
  const log = context.logger.start("services/payments/checkout");
  try {
    let paymentTemp = {};

    await payment(req, res)
      .then(
        async (res) => {
          // try {
          console.log("ID:::", res.transaction.id);
          let now = await moment();
          let payment;
          let plan;
          let expiryDate;
          // new plan
          plan = await db.plan.findById(req.body.planId);
          let user = await db.user.findById(context.user._id);

          paymentTemp = {
            transactionId: res.transaction.id,
            // transactionId: "1234",
            userId: context.user._id,
            planId: req.body.planId,
          };

          payment = await db.payment.find({
            userId: {
              $eq: context.user._id,
            },
            status: "active",
          });

          if (payment && payment.length != 0) {
            for (let item of payment) {
              if (item) {
                let usersPlan = await db.plan.findById(item.planId);
                if (usersPlan.planType == plan.planType) {
                  // if same planType
                  expiryDate = await moment(item.expiryDate).add(
                    plan.duration,
                    "M"
                  );
                  if (plan.planType == "basic") {
                    item.audioCall = item.audioCall + plan.duration;
                    item.vedioCall = item.vedioCall + plan.duration;
                  }
                  item.expiryDate = expiryDate;
                  item.save();
                  user.paymentId = item._id;
                } else if (
                  usersPlan.planType == "basic" &&
                  plan.planType == "pro"
                ) {
                  // if existing plan is basic an new is pro then
                  item.audioCall = 0;
                  item.vedioCall = 0;
                  item.status = "inactive";
                  item.save();

                  expiryDate = moment(now).add(plan.duration, "M");
                  paymentTemp.expiryDate = expiryDate;
                  payment = await new db.payment(paymentTemp).save();
                  user.paymentId = payment._id;
                } else {
                  console.log("you can not downgrade your plan");
                }
              }
            }
          } else {
            expiryDate = moment(now).add(plan.duration, "M");
            paymentTemp.expiryDate = expiryDate;
            if (plan.planType == "basic") {
              paymentTemp.audioCall = plan.duration;
              paymentTemp.vedioCall = plan.duration;
            }
            payment = await new db.payment(paymentTemp).save();
            user.paymentId = payment._id;
          }
          // save plan in user
          user.planId = req.body.planId;
          user.save();

          log.end();
          return payment;
        },
        (error) => {
          log.end();
          throw new Error(error);
        }
      )
      // } catch (err) {
      //   log.end();
      //   throw new Error(err);
      // }
      .catch((error) => {
        log.end();
        throw new Error(error);
      });
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const paymentToken = async (req, context, res) => {
  const log = context.logger.start("services/payments/paymentToken");

  // all credentials
  const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "tgjvv93j225njykw",
    publicKey: "bfz6xr9qw3scx7ms",
    privateKey: "6767c6c455700f39995c93301eac6a4a",
  });

  return new Promise((resolve, reject) => {
    gateway.clientToken.generate({}, async (error, response) => {
      if (response) {
        const clientToken = {
          token: response.clientToken,
        };
        resolve(clientToken);
        console.log(clientToken);
        log.end();
      } else {
        reject(error);
        log.end();
      }
    });
  });
};

const getById = async (id, context) => {
  const log = context.logger.start(`services/payments/getById:${id}`);
  try {
    let canAudioCall;
    let canVedioCall;

    let payment = await db.payment.findById(id);
    if (!payment) {
      throw new Error("invalid payment");
    }
    let currentMonth = await moment().format("MMM");

    // for audio call
    if (
      payment.lastAudioCallTime == null ||
      payment.lastAudioCallTime == undefined ||
      payment.lastAudioCallTime == ""
    ) {
      canAudioCall = true;
    } else {
      let lastAudioCallMonth = await moment(payment.lastAudioCallTime).format(
        "MMM"
      );
      if (lastAudioCallMonth == currentMonth || payment.audioCall == 0) {
        canAudioCall = false;
      } else {
        canAudioCall = true;
      }
    }
    // for vedio call
    if (
      payment.lastVedioCallTime == null ||
      payment.lastVedioCallTime == undefined ||
      payment.lastVedioCallTime == ""
    ) {
      canVedioCall = true;
    } else {
      let lastVedioCallMonth = await moment(payment.lastVedioCallTime).format(
        "MMM"
      );
      if (lastVedioCallMonth == currentMonth || payment.vedioCall == 0) {
        canVedioCall = false;
      } else {
        canVedioCall = true;
      }
    }
    let createTempPaymentModel = await tempPaymentModel(
      payment,
      canAudioCall,
      canVedioCall
    );
    payment = createTempPaymentModel;
    log.end();
    return payment;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const update = async (id, model, context) => {
  const log = context.logger.start(`services/payments:${id}`);
  try {
    const entity = await db.payment.findById(id);
    if (!entity) {
      throw new Error("invalid payment");
    }
    if (model.isSuccess == true) {
      await set(model, entity, context);
    }
    log.end();
    return entity;
  } catch (err) {
    throw new Error(err);
  }
};

exports.payment = payment;
exports.create = create;
exports.paymentToken = paymentToken;
exports.getById = getById;
exports.update = update;
