"use strict";
var turf = require("@turf/turf");
var mongoose = require("mongoose");
const service = require("./pushNotification");

const set = async (model, entity, context) => {
  const log = context.logger.start("services/plans/set");
  try {
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
  const log = context.logger.start("services/likes");
  try {
    let like;
    let recommended
    if (model.likedBy && model.likedTo) {
      like = await db.like.findOne({
        likedBy: {
          $eq: model.likedBy,
        },
        likedTo: {
          $eq: model.likedTo,
        },
      });
    }
    console.log("recommended")
    recommended = await db.recommended.findOne({
      userId: {
        $eq:context.user.id,
      },
      // user: {
      //   $eq: model.reportedTo
      // },
    });
    if(recommended){
      console.log("recommended1")
      console.log("recommended",recommended)
      if ((recommended.user).length!=0) {
        console.log("recommended2")
       //   if (user) {
           if((recommended.user[0])._id==model.likedTo){
             console.log((recommended.user[0])._id==model.likedTo)
              recommended.user.splice(0, 1);
           }
           console.log("recommended3")
           if(recommended.user[1]){
         if((recommended.user[1])._id==model.likedTo){
          console.log((recommended.user[1])._id==model.likedTo)
               recommended.user.splice(1, 1);
            }
           }
           recommended.save()
           console.log("recommended5")
         }
         
        }
        console.log("recommended4")
    if (!like) {
      like = await new db.like(model).save();

      // send notification if user is already liked by likedTo user
      let likes = await db.like.findOne({
        likedBy: {
          $eq: model.likedTo,
        },
        likedTo: {
          $eq: model.likedBy,
        },
      });
      if (likes) {
        let likedByUser = await db.user.findById(model.likedBy);
        let likedToUser = await db.user.findById(model.likedTo);

        let data = {
          to: [likedByUser.fcmToken, likedToUser.fcmToken],
          notification: {
            title: "Match",
            body: "It's a match both of you can chat now",
          },
          data: {
            type: "like",
            likedByUser: {
              name: likedByUser.firstName + " " + likedByUser.lastName,
              profilePic: likedByUser.profilePic,
            },
            likedToUser: {
              name: likedToUser.firstName + " " + likedToUser.lastName,
              profilePic: likedToUser.profilePic,
            },
          },
          userId: model.likedTo,
          msgFromId: model.likedBy,
          from: "like",
        };
        console.log("recommended8")
        await service.create("", data, "", "");
      }
    } else {
      like = await set(model, like, context);
    }

    log.end();
    console.log("recommended10")
    return like;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const get = async (req, page, context) => {
  const log = context.logger.start(`services/likes/get`);
  try {
    let params = req.query;
    let query = {};
    let likes;
    let user;
    let userLocation;
    let userSelfLike;
    // let result = []
    if (params.userId) {
      user = await db.user.findById(params.userId);
      userLocation = user.address.location.coordinates;
    }
    if (params) {
      if (
        params.userId != null &&
        params.userId != undefined &&
        params.status != null &&
        params.status != undefined
      ) {
        query = {
          likedTo: {
            $eq: params.userId,
          },
          status: {
            $eq: params.status,
          },
        };
      } else if (
        params.userId != null &&
        params.userId != undefined &&
        params.status == null &&
        params.status == undefined
      ) {
        query = {
          likedTo: {
            $eq: params.userId,
          },
        };
      } else {
        query = {};
      }
    }
    likes = await db.like.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "likedBy",
          foreignField: "_id",
          as: "likedBy",
        },
      },
      { $unwind: "$likedBy" },

      {
        $project: {
          likedTo: 1,
          status: 1,
          "likedBy._id": 1,
          "likedBy.firstName": 1,
          "likedBy.lastName": 1,
          "likedBy.age": 1,
          "likedBy.address": 1,
          "likedBy.profilePic": 1,
        },
      },
    ]);

    let likesQuery = {
      likedTo: {
        $eq: params.userId,
      },
    };
  let result=[]
  let  templikes = await db.like.find(likesQuery, { _id: 1, likedBy: 1 });
 
  for(let item of templikes){
    if(item){
      let quedatary = {
        likedBy: { $eq: mongoose.Types.ObjectId(params.userId) },
        likedTo: { $eq: (item.likedBy).toString()},
     };
     let temp = await db.like.findOne(quedatary);
     let temppp=likes
  //   }
  // }
     if(temp){
       for(let liked of temppp){
         let index=temppp.indexOf(liked)
         if(liked){
            if(((liked.likedTo).toString())==((temp.likedBy).toString())){
             await likes.splice(index,1)
            }
         }
       }
     }
     
    }
   }
  console.log("likes",likes)

    // // like/dislike users
    // let like = await db.like.find(query, { _id: 0, likedBy: 1 });
    // if (like.length != 0) {
    //   like.forEach((row) => {
    //     result.push((row.likedBy).toString());
    //   });
    // }
    // for(let results of result){
    //   if(results){
    //     query = {
    //       likedBy: { $eq: mongoose.Types.ObjectId(params.userId) },
    //       likedTo: { $eq: results},
    //     };
    //     let temp = await db.like.find(query);
    //     let templike= await likes.filter((usermatch)=>{
    //       return usermatch._id!=temp._id
    //       // likes.splice(2, tempUsers.length - 1);
    //     })
    //     console.log(templike)
    //   }
    // }
  //  console.log(result)
  //   let likeQuery = {
  //     likedBy: {
  //       $eq:  { $eq: mongoose.Types.ObjectId(params.userId) },
  //     },
  //     likedTo: {
  //       $eq: result,
  //     },
  //   };

    // let temp = await db.like.find(likeQuery);
    // console.log(temp)

    let tempLikes = [];
    if (likes && likes.length != 0) {
      for (let like of likes) {
        if (like) {
          if (like.likedBy.address) {
            var from = turf.point(userLocation);
            var to = turf.point(like.likedBy.address.location.coordinates);
            var options = { units: "kilometers" };
            var distance = turf.distance(from, to, options);
            query = {
              likedBy: { $eq: mongoose.Types.ObjectId(params.userId) },
              likedTo: { $eq: like.likedBy._id },
            };
            let temp = await db.like.find(query);
            if (temp && temp.length != 0) {
              userSelfLike = true;
            } else {
              userSelfLike = false;
            }
            tempLikes.push({
              _id: like._id,
              likedTo: like.likedTo,
              status: like.status,
              userSelfLike: userSelfLike,
              likedBy: {
                _id: like.likedBy._id,
                firstName: like.likedBy.firstName,
                lastName: like.likedBy.lastName,
                age: like.likedBy.age,
                distance: distance,
                profilePic: like.likedBy.profilePic,
              },
            });
          }
        }
      }
      likes = tempLikes;
    }
    log.end();
    return likes;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const update = async (id, model, context) => {
  const log = context.logger.start(`services/likes:${id}`);
  try {
    let entity = await db.like.findById(id);
    if (!entity) {
      throw new Error("no data found");
    }
    await set(model, entity, context);
    log.end();
    return entity;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteLikes = async (model, context) => {
  const log = context.logger.start("services/likes/delete");
  try {
    let like = await db.like.findOne(model);
    if (like) {
      like = await db.like.findByIdAndRemove(like.id);
      console.log("like removed successfully");
    }
    log.end();
    return;
  } catch (err) {
    throw new Error(err);
  }
};

const matchPermission = async (model, context) => {
  const log = context.logger.start("services/likes/matchPermission");
  try {
    
    let like = await db.like.findOne({
      likedBy: {
        $eq: context.user.id,
      },
      likedTo: {
        $eq: model.userId,
      },
    });
    let otherUser= await db.like.findOne({
      likedBy: {
        $eq: model.userId,
      },
      likedTo: {
        $eq:  context.user.id,
      },
    });
    if (like) {
      like.iGivePermission= true;
     await like.save();
    }
    if (otherUser) {
      otherUser.iHavePermission= true;
     await otherUser.save();
    }
    
    return like
  } catch (err) {
    throw new Error(err);
  }
};

exports.create = create;
exports.get = get;
exports.update = update;
exports.deleteLikes = deleteLikes;
exports.matchPermission = matchPermission;

