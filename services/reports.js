"use strict";
const message = require("../helpers/message");
// const report = require("./reports");
const response = require("../exchange/response");
const likesService = require("./likes");

const create = async (req, model, context, res) => {
  const log = context.logger.start("services/reports");
  let report
  let recommended
  try {
    // let report = await new db.report(model).save();
    // if (model.reportBy && model.reportTo) {
      report = await db.report.findOne({
        reportedBy: {
          $eq:context.user.id,
        },
        reportedTo: {
          $eq: model.reportedTo,
        },
      });

      recommended = await db.recommended.findOne({
        userId: {
          $eq:context.user.id,
        },
        // user: {
        //   $eq: model.reportedTo
        // },
      });

      if(recommended){
       console.log("recommended",recommended)
       if ((recommended.user).length!=0) {
        //   if (user) {
            if((recommended.user[0])._id==model.reportedTo){
               console.log((recommended.user[0])._id==model.reportedTo)
               recommended.user.splice(0, 1);
            }
            if(recommended.user[1]){
          if((recommended.user[1])._id==model.reportedTo){
          console.log((recommended.user[1])._id==model.reportedTo)
                recommended.user.splice(1, 1);
             }
            }
            recommended.save()
          }
          
         }
        


    // }
    if (!report) {
       report = await new db.report(model).save();
      report.reportedBy=context.user.id
       report.save()
      let query = {
        likedBy: {
          $eq: model.reportedTo,
        },
        likedTo: {
          $eq: context.user.id,
        },
      };
      await likesService.deleteLikes(query, context);
    } else {
      return response.unprocessableEntity(res, "user_already_reported");
    }
    let user = await db.user.findById(model.reportedTo);
    
    if (!user) {
      throw new Error(message.userError);
    }
    user.isReported = "true";
    user.save();
    log.end();
    return report;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const get = async (req, page, context) => {
  const log = context.logger.start(`services/reports/get`);
  try {
    let params = req.query;
    console.log("paramsmsmms", params);
    let query = {};
    let report;
    if (params.userId != null && params.userId != undefined) {
      query = {
        reportedTo: {
          $eq: params.userId,
        },
      };
    }

    report = await db.report.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      { $unwind: "$reportedBy" },
      {
        $project: {
          _id: 0,
          reason: 1,
          "reportedBy._id": 1,
          "reportedBy.firstName": 1,
          "reportedBy.lastName": 1,
        },
      },
    ]);
    log.end();
    return report;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};
exports.create = create;

exports.get = get;
