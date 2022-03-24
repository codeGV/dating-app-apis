"use strict";
const cron = require("cron").CronJob;
const moment = require("moment");

const start = async (startOn) => {
  let job = new cron({
    cronTime: startOn,
    onTick: async () => {
      let now = await moment().format("DD-MM-YYYY");
      console.log("now dateeee:", now);
      // let startOfDay = now.startOf("day");
      // let endOfDay = now.endOf("day");
      let payments = await db.payment.find({
        status: {
          $eq: "active",
        },
      });

      if (payments && payments.length != 0) {
        for (let payment of payments) {
          if (payment) {
            let expiryDate = await moment(payment.expiryDate).format(
              "DD-MM-YYYY"
            );
            console.log("expiryDatedateeee:", expiryDate);

            if (now == expiryDate) {
              payment.status = "inactive";
              payment.save();
            }
          }
        }
      }
    },
    start: true,
  });
};
console.log("After job instantiation");
exports.schedule = () => {
  // start(`2 * * * * *`);
  start(`0 5 * * *`);
};

// let payments = await db.payment.updateMany(
//   {
//     status: {
//       $eq: "active",
//     },
//     expiryDate: {
//       $gte: startOfDay,
//       $lt: endOfDay,
//     },
//   },
//   { $set: { status: "inactive" } }
// );
