"use strict";
const response = require("../exchange/response");
const likesService = require("./likes");

const create = async (req, model, context, res) => {
  const log = context.logger.start("services/blocks");
  try {
    let block;
    let recommended
    if (model.blockBy && model.blockTo) {
      block = await db.block.findOne({
        blockBy: {
          $eq: model.blockBy,
        },
        blockTo: {
          $eq: model.blockTo,
        },
      });
    }
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
           if((recommended.user[0])._id==model.blockTo){
              console.log((recommended.user[0])._id==model.blockTo)
              recommended.user.splice(0, 1);
           }
           if(recommended.user[1]){
         if((recommended.user[1])._id==model.blockTo){
         console.log((recommended.user[1])._id==model.blockTo)
               recommended.user.splice(1, 1);
            }
           }
           recommended.save()
         }
         
        }
       
    if (!block) {
      block = await new db.block(model).save();
      let query = {
        likedBy: {
          $eq: model.blockTo,
        },
        likedTo: {
          $eq: model.blockBy,
        },
      };
      await likesService.deleteLikes(query, context);
    } else {
      return response.unprocessableEntity(res, "user_already_blocked");
    }
    log.end();
    return block;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const get = async (req, page, context) => {
  const log = context.logger.start(`services/blocks/get`);
  try {
    let params = req.query;
    let query = {};
    let blocks;
    if (params) {
      if (params.userId != null && params.userId != undefined) {
        query = {
          blockdTo: {
            $eq: params.userId,
          },
        };
      } else {
        query = {};
      }
    }
    blocks = await db.block.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "blockBy",
          foreignField: "_id",
          as: "blockBy",
        },
      },
      { $unwind: "$blockBy" },
      {
        $project: {
          blockTo: 1,

          "blockBy._id": 1,
          "blockBy.firstName": 1,
          "blockBy.lastName": 1,
          "blockBy.age": 1,
          "blockBy.address": 1,
          "blockBy.images": 1,
        },
      },
    ]);

    log.end();
    return blocks;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

exports.create = create;
exports.get = get;
