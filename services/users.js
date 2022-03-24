"use strict";
const encrypt = require("../permit/crypto");
const auth = require("../permit/auth");
const response = require("../exchange/response");
const message = require("../helpers/message");
var mongoose = require("mongoose");
var moment = require("moment");

const service = require("../services/reports");
const pushNotificationService = require("./pushNotification");
const { round } = require("lodash");
const services = require("../services/recommended");
const { hasPlan } = require("../models/recommended");

const milesToRadian = function (miles) {
  var earthRadiusInMiles = 3959;
  return miles / earthRadiusInMiles;
};

const userTempModel = async (users, totalCount) => {
  var result = {
    users: users,
    totalCount: totalCount,
  };
  return result;
};

const set = (model, entity, context) => {
  const log = context.logger.start("services/users/set");

  if (model.firstName) {
    entity.firstName = model.firstName;
  }
  if (model.lastName) {
    entity.lastName = model.lastName;
  }
  if (model.status) {
    if (context.user.type == "admin") {
      if ((model.status == 'inActive') || (model.status == 'delete')) {
        entity.token = ''
        entity.status = model.status;
      }
      if (model.status == "rejected") {
        if (model.rejectedReason) {
          entity.status = model.status;
          entity.rejectedReason = model.rejectedReason;
          entity.token = ''
        } else {
          return response.unAuthorized(res, "reason_is_required");
        }
      } else {
        entity.status = model.status;
      }
    }
  }
  if (model.gender) {
    entity.gender = model.gender;
  }
  if (model.fcmToken) {
    entity.fcmToken = model.fcmToken;
  }
  if (model.isVisible == false || model.isVisible == true) {
    entity.isVisible = model.isVisible;
  }
  if (model.alcohol) {
    entity.alcohol = model.alcohol;
  }
  if (model.smoking) {
    entity.smoking = model.smoking;
  }
  if (model.marijuana) {
    entity.marijuana = model.marijuana;
  }
  if (model.diet) {
    entity.diet = model.diet;
  }
  if (model.pets) {
    entity.pets = model.pets;
  }
  if (model.maritalStatus) {
    entity.maritalStatus = model.maritalStatus;
  }
  if (model.wantsKids) {
    entity.wantsKids = model.wantsKids;
  }
  if (model.userName) {
    entity.userName = model.userName;
  }
  if (model.occupation) {
    entity.occupation = model.occupation;
  }

  if (model.height) {
    entity.height = model.height;
  }
  if (model.religion) {
    entity.religion = model.religion;
  }
  if (model.postalCode) {
    entity.postalCode = model.postalCode;
  }
  if (model.currentCity) {
    entity.currentCity = model.currentCity;
  }
  if (model.profilePic) {
    entity.profilePic = model.profilePic;
  }
  if (model.address) {
    if (model.address.location) {
      entity.address.location = model.address.location;
    }
  }
  if (model.race) {
    entity.race = model.race;
  }

  if (model.visibleAge == false || model.visibleAge == true) {
    entity.visibleAge = model.visibleAge;
  }
  if (model.visibleLocation == false || model.visibleLocation == true) {
    entity.visibleLocation = model.visibleLocation;
  }
  if (model.visiblelikeDislike == false || model.visiblelikeDislike == true) {
    entity.visiblelikeDislike = model.visiblelikeDislike;
  }
  if (model.visibleImage == false || model.visibleImage == true) {
    entity.visibleImage = model.visibleImage;
  }
  if (model.orientation) {
    entity.orientation = model.orientation;
  }
  if (model.languages) {
    entity.languages = model.languages;
  }

  if (model.bodyType) {
    entity.bodyType = model.bodyType;
  }
  // if (model.ethnicity) {
  //   entity.ethnicity = model.ethnicity;
  // }
  if (model.employment) {
    entity.employment = model.employment;
  }
  if (model.astrologicalSign) {
    entity.astrologicalSign = model.astrologicalSign;
  }
  if (model.email) {
    entity.email = model.email;
  }
  if (model.aboutMe) {
    entity.aboutMe = model.aboutMe;
  }
  if (model.location) {
    entity.location = model.location;
  }
  if (model.postalCode) {
    entity.postalCode = model.postalCode;
  }
  if (model.race) {
    entity.race = model.race;
  }
  // if (model.address) {
  //   entity.address = model.address;
  // }
  if (model.work) {
    entity.work = model.work;
  }

  if (model.images) {
    entity.images = model.images;
  }
  if (model.password) {
    entity.password = model.password;
  }
  if (model.firebaseToken) {
    entity.firebaseToken = model.firebaseToken;
  }
  if (model.uId) {
    entity.uId = model.uId;
  }
  if (model.tempToken) {
    entity.tempToken = model.tempToken;
  }
  if (model.age) {
    entity.age = model.age;
  }
  if (model.basicQuestions) {
    entity.basicQuestions = model.basicQuestions;
  }
  if (model.education) {
    entity.education = model.education;
  }
  if (model.imageRemoved == "true") {
    for (var i = 0; i < entity.images.length; i++) {
      if (entity.images[i]._id == model.image._id) {
        entity.images.splice(i, 1);
      }
    }
  }
  if (model.basicQuestionRemoved == "true") {
    for (var i = 0; i < entity.basicQuestions.length; i++) {
      if (entity.basicQuestions[i]._id == model.basicQuestion._id) {
        entity.basicQuestions.splice(i, 1);
      }
    }
  }
  if (model.educationRemoved == "true") {
    for (var i = 0; i < entity.educations.length; i++) {
      if (entity.educations[i]._id == model.education._id) {
        entity.educations.splice(i, 1);
      }
    }
  }

  if (model.aboutMeQuestions && model.aboutMeQuestions.length != 0) {
    if (entity.aboutMeQuestions && entity.aboutMeQuestions.length == 0) {
      entity.aboutMeQuestions = model.aboutMeQuestions;
    } else {
      model.aboutMeQuestions.forEach((modelQue) => {
        entity.aboutMeQuestions.forEach((entityQue) => {
          if (entityQue.questionId == modelQue.questionId) {
            let index = entity.aboutMeQuestions.indexOf(entityQue);
            entity.aboutMeQuestions.splice(index, 1);
          }
        });
        if (modelQue.isRemoved == false) {
          entity.aboutMeQuestions.push(modelQue);
        }
      });
    }
  }

  if (model.interests && model.interests.length != 0) {
    if (entity.interests && entity.interests.length == 0) {
      entity.interests = model.interests;
    } else {
      model.interests.forEach((modelQue) => {
        entity.interests.forEach((entityQue) => {
          if (entityQue.questionId == modelQue.questionId) {
            let index = entity.interests.indexOf(entityQue);
            entity.interests.splice(index, 1);
          }
        });
        if (modelQue.isRemoved == false) {
          entity.interests.push(modelQue);
        }
      });
    }
  }

  if (model.preferences) {
    if (model.preferences.women == false || model.preferences.women == true) {
      entity.preferences.women = model.preferences.women;
    }
    if (model.preferences.men == false || model.preferences.men == true) {
      entity.preferences.men = model.preferences.men;
    }

    if (model.preferences.alcohol) {
      entity.preferences.alcohol = model.preferences.alcohol;
    }
    if (model.preferences.race) {
      entity.preferences.race = model.preferences.race;
    }
    if (model.preferences.education) {
      entity.preferences.education = model.preferences.education;
    }
    if (model.preferences.astrologicalSign) {
      entity.preferences.astrologicalSign = model.preferences.astrologicalSign;
    }
    if (model.preferences.smoking) {
      entity.preferences.smoking = model.preferences.smoking;
    }

    if (model.preferences.diet) {
      entity.preferences.diet = model.preferences.diet;
    }
    if (model.preferences.pets) {
      entity.preferences.pets = model.preferences.pets;
    }
    if (model.preferences.maritalStatus) {
      entity.preferences.maritalStatus = model.preferences.maritalStatus;
    }
    if (model.preferences.distance) {
      entity.preferences.distance = model.preferences.distance;
    }
    if (model.preferences.wantsKids) {
      entity.preferences.wantsKids = model.preferences.wantsKids;
    }
    if (model.preferences.occupation) {
      entity.preferences.occupation = model.preferences.occupation;
    }

    if (model.preferences.age) {
      if (model.preferences.age.from) {
        entity.preferences.age.from = model.preferences.age.from;
      }
      if (model.preferences.age.to) {
        entity.preferences.age.to = model.preferences.age.to;
      }
    }
    if (model.preferences.height) {
      if (model.preferences.height.from) {
        entity.preferences.height.from = model.preferences.height.from;
      }
      if (model.preferences.height.to) {
        entity.preferences.height.to = model.preferences.height.to;
      }
    }

    if (model.preferences.religion) {
      entity.preferences.religion = model.preferences.religion;
    }

    if (model.preferences.languages) {
      entity.preferences.languages = model.preferences.languages;
    }

    if (model.preferences.bodyType) {
      entity.preferences.bodyType = model.preferences.bodyType;
    }
    if (model.preferences.employment) {
      entity.preferences.employment = model.preferences.employment;
    }
    if (model.basicQuestionId) {
      for (var i = 0; i < entity.basicQuestions.length; i++) {
        if (entity.basicQuestions.questionId[i]._id == model.basicQuestionsId) {
          entity.basicQuestions.splice(i, 1);
        }
      }
      entity.basicQuestions.push(model.basicQuestions);
    }
    if (model.preferences.educationRemoved == "true") {
      for (var i = 0; i < entity.educations.length; i++) {
        if (
          entity.preferences.educations[i]._id ==
          model.preferences.education._id
        ) {
          entity.preferences.educations.splice(i, 1);
        }
      }
    }
  }

  log.end();
  entity.save();
  return entity;
};

// const create = async (req, model, context, res) => {
//   const log = context.logger.start("services/users");
//   try {
//     let users = message.users;
//     let password = encrypt.getHash("123456", context);
//     console.log("password::::", password);
//     let user;
//     user = await db.user.insertMany(users);
//     log.end();
//     return user;
//   } catch (err) {
//     log.end();
//     throw new Error(err);
//   }
// };

const create = async (req, model, context, res) => {
  const log = context.logger.start("services/users");
  try {
    let user;

    let query = {};

    // if (model.email && model.loginType == "app") {
    //   query.email = model.email;
    // }

    if (model.loginType) {
      query.loginType = model.loginType;
    }
    if (model.email) {
      query.email = model.email;
    }
    // if (model.uId) {
    //   query.uId = model.uId;
    // }

    // find user
    user = await db.user.findOne(query);

    if (!user) {
      if (model.loginType == "app") {
        if (model.email) {
          user = await db.user.findOne({
            email: {
              $eq: model.email,
            },
          });
          if (user && user.status == "pending") {
            log.end();
            await set(model, user, context);
            return user;
          }
          model.password = model.firstName + model.phone;
          // encrypt password
          model.password = encrypt.getHash(model.password, context);

          // create user
          user = await new db.user(model).save();
          if (user.basicQuestions) {
            if (user.basicQuestions.length < 10) {
              user.status = "pending";
            }
          }
          user.save();
        }
      } else {
        // create user
        user = await new db.user(model).save();
        if (user.basicQuestions) {
          if (user.basicQuestions.length < 10) {
            user.status = "pending";
          }
        }
        user.orientation = user.gender;
        user.save();
      }
    } else {
      model.password = model.firstName + model.phone;
      // encrypt password
      model.password = encrypt.getHash(model.password, context);

      if (user.status == "pending" || user.status == "rejected") {
        await set(model, user, context);
        user.rejectedReason = "";
        if (user.status == "rejected") {
          user.status = 'pending'
        }
        user.save();
      } else if (user.status == "active" && user.loginType !== "app") {
        // generate token
        const token = auth.getToken(user.id, false, context);
        if (!token) {
          return response.unAuthorized(res, "token_error");
        }
        user.token = token;
        user.save();
      }
    }

    log.end();
    return user;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const userExists = async (model, context, res) => {
  const log = context.logger.start("services/users/userExists");
  try {
    let user;
    let plan;
    let query = {};

    if (model.loginType) {
      query.loginType = model.loginType;
    }

    if (model.uId) {
      query.uId = model.uId;
    }
    if (model.email) {
      query.email = model.email;
    }
    user = await db.user.findOne(query);
    if (user) {
      if (
        user.status == "active" &&
        (user.loginType == "facebook" || user.loginType == "google")
      ) {
        // generate token
        const token = await auth.getToken(user.id, false, context);
        if (!token) {
          return response.unAuthorized(res, "token_error");
        }
        user.token = token;
        user.save();
      }

      if (user.planId != null && user.planId != undefined) {
        plan = await db.plan.findOne({
          _id: {
            $eq: user.planId,
          },
        });
        if (plan) {
          user.subscriptionPlan = plan;
        }
      }
    }
    if (!user || user.status == 'delete') {
      return response.unprocessableEntity(res, "new_user");
    } else {
      return user;
    }
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const getById = async (id, context) => {
  const log = context.logger.start(`services/users/getById:${id}`);
  try {
    let user;
    let contextUser = await db.user.findById(context.user.id);
    let query = {
      _id: {
        $eq: mongoose.Types.ObjectId(id),
      },
    };
    user = await db.user.aggregate([{ $match: query }]);

    if (user && user.length != 0) {
      user = user[0];


      if (context.user.id != user._id) {
        let matchingPercentage = 0;
        if (
          contextUser.preferences.men == true &&
          contextUser.preferences.women == false

        ) {
          if (user.gender == "male") {
            matchingPercentage = matchingPercentage + 1;
          }
        }

        if (
          contextUser.preferences.women == true &&
          contextUser.preferences.men == false
        ) {
          if (user.gender == "female") {
            matchingPercentage = matchingPercentage + 1;
          }
        }
        if (
          contextUser.preferences.men == true &&
          contextUser.preferences.women == true
        ) {
          if (user.gender == "male" || user.gender == "female") {
            matchingPercentage = matchingPercentage + 1;
          }
        }
        if (contextUser.preferences.age) {
          if (
            contextUser.preferences.age.from &&
            contextUser.preferences.age.to
          ) {
            if (
              user.age <= contextUser.preferences.age.to &&
              user.age >= contextUser.preferences.age.from
            ) {
              matchingPercentage = matchingPercentage + 1;
            }
          }
        }

        if (
          contextUser.preferences.alcohol == "Open to any" ||
          contextUser.preferences.alcohol == user.alcohol
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        if (
          contextUser.preferences.smoking == "Open to any" ||
          contextUser.preferences.smoking == user.smoking
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        if (
          contextUser.preferences.diet == "Open to any" ||
          contextUser.preferences.diet == user.diet
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        if (
          contextUser.preferences.maritalStatus == "Open to any" ||
          contextUser.preferences.maritalStatus == user.maritalStatus
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        if (
          contextUser.preferences.religion == "Open to any" ||
          contextUser.preferences.religion == user.religion
        ) {
          matchingPercentage = matchingPercentage + 1;
        }

        if (contextUser.preferences.height) {
          if (
            contextUser.preferences.height.from &&
            contextUser.preferences.height.to
          ) {
            if (
              user.height <= contextUser.preferences.height.to &&
              user.height >= contextUser.preferences.height.from
            ) {
              matchingPercentage = matchingPercentage + 1;
            }
          }
        }
        if (
          contextUser.preferences.bodyType == "Open to any" ||
          contextUser.preferences.bodyType == user.bodyType
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        if (
          contextUser.preferences.languages &&
          contextUser.preferences.languages.length != 0
        ) {
          let userLanguages = contextUser.preferences.languages;
          let isExists = userLanguages.some((el) => el.option == "Open to any");
          if (!isExists) {
            if (user.languages && user.languages.length != 0) {
              user.languages.some((el) => {
                userLanguages.some((language) => {
                  if (language.option == el.option) {
                    matchingPercentage = matchingPercentage + 1;
                    return language.option == el.option;
                  }
                });
              });
            }
          } else {
            matchingPercentage = matchingPercentage + 1;
          }
        }
        if (
          contextUser.preferences.race == "Open to any" ||
          contextUser.preferences.race == user.race
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        if (
          contextUser.preferences.wantsKids == "Open to any" ||
          contextUser.preferences.wantsKids == user.wantsKids
        ) {
          matchingPercentage = matchingPercentage + 1;
        }
        matchingPercentage = (matchingPercentage / 12) * 100;
        console.log("userrrrrrrrrrrrrr", matchingPercentage);
        if (matchingPercentage > 95) {
          user.matchingPercentage = 95
        } else {
          user.matchingPercentage = round(matchingPercentage, 2);
        }
      }
      // push profile pic in images array
      // if (user.profilePic) {
      //   if (user.images) {
      //     if((user.images[0]).url!=undefined){
      //       // console.log((user.images[0]).url!=undefined)
      //       user.images.splice(0, 0, user.profilePic);
      //     }

      //   }
      // }
      //get users who report this user
      let req = {
        query: {
          userId: id,
        },
      };
      let reports = await service.get(req, "", context);
      if (reports && reports.length != 0) {
        user.reportedBy = reports;
      } else {
        user.reportedBy = [];
      }
      // get subscription plan
      if (user.planId != null && user.planId != undefined) {
        let plan = await db.plan.findOne({
          _id: {
            $eq: user.planId,
          },
        });
        if (plan) {
          user.subscriptionPlan = plan;
        }
      }
    } else {
      throw new Error(message.userError);
    }
    log.end();
    return user;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const update = async (id, model, context) => {
  const log = context.logger.start(`services/users:${id}`);
  try {
    let entity = await db.user.findById(id);

    console.log("user update model::", model);

    if (!entity) {
      throw new Error("invalid user");
    }

    // call set method to update user
    await set(model, entity, context);
    if (entity.planId != null && entity.planId != undefined) {
      // // find user
      let plan = await db.plan.findOne({
        _id: {
          $eq: entity.planId,
        },
      });
      if (plan) {
        entity.subscriptionPlan = plan;
      }
    }
    console.log("user update res", entity);
    if (model.status == 'active') {
      let model = {
        notification: {
          title: `Account Approved`,
          body: `your account has been approved you can continue with login`,
        },
        data: {
          type: "approved",

          userDetail: {
            name: entity.firstName,
            profilePic: entity.profilePic,
          }
        },
        userId: id,
        from: "approved",
      };
      await pushNotificationService.create("", model, "", "");

    }
    if (model.status == 'rejected') {
      let model = {
        notification: {
          title: `Account Rejected`,
          body: `your account has been rejected`,
        },
        data: {
          type: "rejected",

          userDetail: {
            name: entity.firstName,
            profilePic: entity.profilePic,
          }
        },
        userId: id,
        from: "rejected",
      };
      await pushNotificationService.create("", model, "", "");

    }
    return entity;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const login = async (model, context, res) => {
  const log = context.logger.start(`services/users/login`);

  try {
    let user;
    const query = {};

    if (model.email) {
      query.email = model.email;
    }

    // find user
    user = await db.user.findOne(query);

    // user not found
    if (!user) {
      log.end();
      throw new Error(message.userError);
    }

    if (user.status == "active") {
      // match password
      const isMatched = encrypt.compareHash(
        model.password,
        user.password,
        context
      );
      if (!isMatched) {
        log.end();
        throw new Error(message.passwordError);
      }

      // create token
      const token = auth.getToken(user._id, false, context);
      if (!token) {
        throw new Error("token error");
      }
      user.token = token;
      // user.status = 'active';
      user.save();
    } else {
      // return response.unAuthorized(res, "profile_in_progress")
      return response.unprocessableEntity(res, "profile_in_progress");
    }

    log.end();
    return user;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const logOut = async (res, context) => {
  const log = context.logger.start(`services/users/logOut`);

  try {
    const user = await db.user.findOne({
      _id: {
        $eq: context.user.id,
      },
    });
    if (!user) {
      throw new Error(message.userError);
    }
    user.token = "";
    user.fcmToken = ""
    user.save();
    res.message = message.logOutMessage;
    log.end();
    return response.data(res, "");
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const getSocketUsers = async (req, context) => {
  const log = context.logger.start(`services/users/getSocketUsers`);

  try {
    let query = {};
    let likes;
    let likedTo = [];
    let likedBy = [];
    let params = req.query;
    let user = await db.user.findById(params.userId);
    if (!user) {
      throw new Error(message.userError);
    }
    if (user.type == "user") {
      // liked to other users
      query = {
        likedBy: user._id,
      };


      likes = await db.like.find(query, { _id: 0, likedTo: 1 });


      if (likes.length == 0) {
        throw new Error("user does not like anyone");
      }
      likes.forEach((like) => {
        likedTo.push(mongoose.Types.ObjectId(like.likedTo));
      });
      // liked by other users
      query = {
        likedBy: likedTo,
        likedTo: user.id,
      };
      likes = await db.like.find(query, { _id: 0, likedBy: 1 });
      if (likes.length == 0) {
        throw new Error("no one likes to this user");
      }
      likes.forEach((like) => {
        likedBy.push(like.likedBy);
      });

      query = {
        _id: likedBy,
      };
    } else {
      query = {
        msgToId: user.id,
      };
      let chat = await db.chats.distinct("msgFromId", query);
      if (chat.length == 0) {
        throw new Error("no chat found");
      } else {
        query = {
          _id: chat,
        };
      }
    }

    // chat list users who likes to each other
    console.log("users", user)
    console.log("querry", query)
    let users = await db.user.find(query, {
      firstName: 1,
      lastName: 1,
      profilePic: 1,
    });
    console.log('2query', query)
    console.log("users", users)
    if (users.length != 0) {
      let tempUsers = [];
      for (let value of users) {
        if (value) {
          query = {
            $or: [
              {
                $and: [{ msgFromId: user.id }, { msgToId: value.id }],
              },
              {
                $and: [{ msgFromId: value.id }, { msgToId: user._id }],
              },
            ],
          };
          console.log('3query', query)
          // get user chat
          let chat = await db.chats.find(query);
          let like = await db.like.findOne({
            likedBy: {
              $eq: value.id,
            },
            likedTo: {
              $eq: user.id,
            },

          });
          let mylike = await db.like.findOne({
            likedBy: {
              $eq: user.id,
            },
            likedTo: {
              $eq: value.id,
            },

          });
          like.iGivePermission = mylike.iGivePermission
          like.iHavePermission = mylike.iHavePermission
          console.log('like', like)
          let temp = await db.like.findOne
          if (user.type == "admin") {

            if (chat.length != 0) {
              chat = await db.chats.findOne(query).sort({ _id: -1 }).limit(1);
              tempUsers.push({
                isNewChat: false,
                lastMessage: chat.msg,
                msgDate: chat.createdOn,
                userId: value._id,
                userName: value.firstName + " " + value.lastName,
                profilePic: value.profilePic,
                // turn: like.turn,
              });
            } else {
              tempUsers.push({
                isNewChat: true,
                lastMessage: "",
                msgDate: "",
                userId: value._id,
                userName: value.firstName + " " + value.lastName,
                profilePic: value.profilePic,
                // turn: like.turn,
              });
            }
          } else {
            if (chat.length != 0) {
              chat = await db.chats.findOne(query).sort({ _id: -1 }).limit(1);
              tempUsers.push({
                isNewChat: false,
                lastMessage: chat.msg,
                msgDate: chat.createdOn,
                userId: value._id,
                userName: value.firstName + " " + value.lastName,
                profilePic: value.profilePic,
                turn: like.turn,
                iGivePermission: mylike.iGivePermission,
                iHavePermission: mylike.iHavePermission
              });
            } else {
              tempUsers.push({
                isNewChat: true,
                lastMessage: "",
                msgDate: "",
                userId: value._id,
                userName: value.firstName + " " + value.lastName,
                profilePic: value.profilePic,
                turn: like.turn,
                iGivePermission: mylike.iGivePermission,
                iHavePermission: mylike.iHavePermission

              });
            }
          }
        }
      }
      users = tempUsers.sort(function (a, b) {
        return new Date(b.msgDate) - new Date(a.msgDate);
      });
    }
    log.end();
    return users;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const addField = async () => {
  try {
    let user = await db.user.update(
      {},
      { $set: { paymentId: "1" } },
      { upsert: false, multi: true }
    );
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const get = async (req, page, context, res) => {
  const log = context.logger.start(`services/users/get`);
  try {
    let params = req.query;
    let query = {};
    let users;
    let likes;
    let blockedUser;
    let reporteduser;
    let result = [];

    if (
      params.type &&
      params.type != null &&
      params.type != undefined &&
      params.type != ""
    ) {
      query = {
        type: {
          $eq: params.type,
        },
      };
    }
    if (
      params.status &&
      params.status != null &&
      params.status != undefined &&
      params.status != ""
    ) {
      query = Object.assign(
        {
          status: {
            $eq: params.status,
          },
        },
        query
      );
    }
    if (params.reportedUser && params.reportedUser == "true") {
      query = Object.assign(
        {
          isReported: {
            $eq: "true",
          },
        },
        query
      );
    }
    if (
      params.userId !== null &&
      params.userId != undefined &&
      params.longitude !== null &&
      params.longitude != undefined &&
      params.latitude !== null &&
      params.latitude != undefined &&
      params.isLocation == "true"
    ) {
      let user = await db.user.findById(params.userId);
      if (!user) {
        throw new Error(message.userError);
      }
      let distance;
      if (user.preferences && user.preferences.distance) {
        distance = JSON.parse(user.preferences.distance);
        distance = distance * 0.621371;
      } else {
        distance = 100 * 0.621371;
      }
      // let coordinates = user.address.location.coordinates;
      let coordinates = [
        JSON.parse(params.longitude),
        JSON.parse(params.latitude),
      ];

      let likesQuery = {
        likedBy: {
          $eq: params.userId,
        },
      };
      let blockQuery = {
        blockBy: {
          $eq: params.userId,
        },
      };
      let reportQuery = {
        reportedBy: {
          $eq: params.userId,
        },
      };

      // like/dislike users
      likes = await db.like.find(likesQuery, { _id: 0, likedTo: 1 });
      if (likes.length != 0) {
        likes.forEach((row) => {
          result.push(mongoose.Types.ObjectId(row.likedTo));
        });
      }

      // blocked users
      blockedUser = await db.block.find(blockQuery, { _id: 0, blockTo: 1 });
      if (blockedUser.length != 0) {
        blockedUser.forEach((row) => {
          result.push(mongoose.Types.ObjectId(row.blockTo));
        });
      }
      // repored users
      reporteduser = await db.report.find(reportQuery, { _id: 0, reportedTo: 1 });
      if (reporteduser.length != 0) {
        reporteduser.forEach((row) => {
          result.push(mongoose.Types.ObjectId(row.reportedTo));
        });
      }
      // user itself
      result.push(user._id);

      query = {
        type: "user",
        status: "active",
        isVisible: true,
        status: {
          $ne: 'delete',
        },
        _id: { $nin: result },
        "address.location": {
          $geoWithin: {
            $centerSphere: [coordinates, milesToRadian(distance)],
          },
        },
      };

      // recommanded users
      if (params.isRecommended == "true") {
        query = Object.assign(
          {
            _id: { $nin: result },
          },
          query
        );
        if (user.preferences.men == true && user.preferences.women == false) {
          query = Object.assign(
            {
              gender: "male",
            },
            query
          );
        }
        if (user.preferences.women == true && user.preferences.men == false) {
          query = Object.assign(
            {
              gender: "female",
            },
            query
          );
        }
        if (user.preferences.men == true && user.preferences.women == true) {
          query = Object.assign(
            {
              gender: { $in: ["male", "female"] },
            },
            query
          );
        }
        if (user.preferences.age) {
          if (user.preferences.age.from && user.preferences.age.to) {
            query = Object.assign(
              {
                age: {
                  $gte: user.preferences.age.from,
                  $lte: user.preferences.age.to,
                },
              },
              query
            );
          }
        }
        if (user.preferences.alcohol != "Open to any") {
          query = Object.assign(
            {
              alcohol: user.preferences.alcohol,
              // alcohol: { $in: [user.preferences.alcohol, "Open to any"] },
            },
            query
          );
        }
        if (user.preferences.smoking != "Open to any") {
          query = Object.assign(
            {
              smoking: user.preferences.smoking,
            },
            query
          );
        }
        if (user.preferences.diet != "Open to any") {
          query = Object.assign(
            {
              diet: user.preferences.diet,
            },
            query
          );
        }
        if (user.preferences.maritalStatus != "Open to any") {
          query = Object.assign(
            {
              maritalStatus: user.preferences.maritalStatus,
            },
            query
          );
        }
        if (user.preferences.religion != "Open to any") {
          query = Object.assign(
            {
              religion: user.preferences.religion,
            },
            query
          );
        }

        users = await db.user.find(query);
        let tempUsers = [];

        // match height
        if (users.length != 0) {
          if (user.preferences.height) {
            if (user.preferences.height.from && user.preferences.height.to) {
              users = await users.filter((tempuser) => {
                if (
                  tempuser.height >= user.preferences.height.from &&
                  tempuser.height <= user.preferences.height.to
                ) {
                  return (
                    tempuser.height >= user.preferences.height.from &&
                    tempuser.height <= user.preferences.height.to
                  );
                } else {
                  tempuser.matchingPercentage = 50;
                  tempUsers.push(tempuser);
                }
              });
            }
          }
        }

        // match bodyType
        if (user.preferences.bodyType != "Open to any") {
          if (users.length != 0) {
            if (user.preferences.bodyType) {
              users = await users.filter((tempuser) => {
                if (tempuser.bodyType == user.preferences.bodyType) {
                  return tempuser.bodyType == user.preferences.bodyType;
                } else {
                  tempuser.matchingPercentage = 60;
                  tempUsers.push(tempuser);
                }
              });
            }
          }
        }

        // match language
        if (users.length != 0) {
          if (
            user.preferences.languages &&
            user.preferences.languages.length != 0
          ) {
            let userLanguages = user.preferences.languages;
            let isExists = userLanguages.some(
              (el) => el.option == "Open to any"
            );
            console.log("isExistststs", isExists);
            if (!isExists) {
              users = await users.filter((tempuser) => {
                if (tempuser.languages && tempuser.languages.length != 0) {
                  return tempuser.languages.some((el) => {
                    return userLanguages.some((language) => {
                      if (language.option == el.option) {
                        return language.option == el.option;
                      } else {
                        tempuser.matchingPercentage = 70;
                        tempUsers.push(tempuser);
                      }
                    });
                  });
                }
              });
            }
          }
        }

        // match ethnicity
        if (user.preferences.race != "Open to any") {
          if (users.length != 0) {
            if (user.preferences.race) {
              users = await users.filter((tempuser) => {
                if (tempuser.race == user.preferences.race) {
                  return tempuser.race == user.preferences.race;
                } else {
                  tempuser.matchingPercentage = 80;
                  tempUsers.push(tempuser);
                }
              });
            }
          }
        }

        //  match wantkids
        if (user.preferences.wantsKids != "Open to any") {
          if (users.length != 0) {
            if (user.preferences.wantsKids) {
              users = await users.filter((tempuser) => {
                if (tempuser.wantsKids == user.preferences.wantsKids) {
                  return tempuser.wantsKids == user.preferences.wantsKids;
                } else {
                  tempuser.matchingPercentage = 90;
                  tempUsers.push(tempuser);
                }
              });
            }
          }
        }
        //  remaining users who cross all filters
        if (users.length != 0) {
          for (let user of users) {
            if (user) {
              user.matchingPercentage = 95;
              tempUsers.push(user);
            }
          }
        }
        console.log("percentage")
        if (tempUsers.length != 0) {
          console.log("tempUser")
          // return users according to plan basic/pro
          if (user.planId) {
            let plan = await db.plan.findById(user.planId);
            console.log("plan")
            if (plan) {
              console.log("plannnn::::", plan.planType)
              if (plan.planType == "basic") {
                console.log("if {plan basic}", plan.planType)
                let recommendedUser = await db.recommended.findOne({
                  userId: {
                    $eq: params.userId
                  },
                })
                console.log("basic:::recommendedUser", recommendedUser)
                if (recommendedUser != null && recommendedUser != undefined) {
                  if (recommendedUser.recommendedDate == moment(new Date()).format("DD/MM/YYYY")) {
                    if (recommendedUser.hasPlan) {
                      tempUsers = recommendedUser.user
                      console.log("basic:::hasPlan", tempUsers)
                    } else {
                      console.log("basic:::date match and has plan false", tempUsers)
                      if (tempUsers && tempUsers.length) {
                        tempUsers.splice(2, tempUsers.length - 1);
                        recommendedUser.user = tempUsers
                        recommendedUser.recommendedDate = moment(new Date()).format("DD/MM/YYYY")
                        recommendedUser.hasPlan = true
                        await recommendedUser.save()
                        console.log("basic::recommendedUser2", recommendedUser)
                      }
                    }
                  } else {
                    console.log("basic:::date doesnot match::tempUsers.length",tempUsers.length)
                    if (tempUsers && tempUsers.length) {
                      tempUsers.splice(2, tempUsers.length - 1);
                      recommendedUser.user = tempUsers
                      recommendedUser.recommendedDate = moment(new Date()).format("DD/MM/YYYY")
                      console.log("basic:::date doesnot match::if::tempUsers.length",tempUsers.length)
                      await recommendedUser.save()
                      console.log("basic::if::recommendedUser2", recommendedUser)
                    }
                  }
                } else {
                  console.log("basic:::new user::else", tempUsers.length)
                  if (tempUsers.length > 2) {
                    console.log("basic:::new user::else::if", tempUsers.length)
                    tempUsers.splice(2, tempUsers.length - 1);
                    let temp = {
                      userId: params.userId,
                      recommendedDate: moment(new Date()).format("DD/MM/YYYY"),
                      user: tempUsers,
                      hasPlan: true
                    }
                    await services.create("", temp, context, res);
                  } else {
                    let temp = {
                      userId: params.userId,
                      recommendedDate: moment(new Date()).format("DD/MM/YYYY"),
                      user: tempUsers,
                      hasPlan: true
                    }
                    await services.create("", temp, context, res);
                  }
                }
              } else {
                console.log("if {plan pro}", plan.planType)
                let recommendedUser = await db.recommended.findOne({
                  userId: {
                    $eq: params.userId
                  },
                })
                console.log("pro:::recommendedUser", recommendedUser)
                if (recommendedUser != null && recommendedUser != undefined) {
                  if (recommendedUser.recommendedDate == moment(new Date()).format("DD/MM/YYYY")) {
                    if (recommendedUser.hasPlan) {
                      tempUsers = recommendedUser.user
                      console.log("pro:::hasPlan", tempUsers)
                    } else {
                      console.log("pro:::date match and has plan false", tempUsers)
                      if (tempUsers && tempUsers.length) {
                        tempUsers.splice(5, tempUsers.length - 1)
                        recommendedUser.user = tempUsers
                        recommendedUser.recommendedDate = moment(new Date()).format("DD/MM/YYYY")
                        recommendedUser.hasPlan = true
                        await recommendedUser.save()
                        console.log("pro::recommendedUser2", recommendedUser)
                      }
                    }
                  } else {
                    console.log("pro:::date doesnot match::tempUsers.length",tempUsers.length)
                    if (tempUsers && tempUsers.length) {
                      tempUsers.splice(5, tempUsers.length - 1);
                      recommendedUser.user = tempUsers
                      recommendedUser.recommendedDate = moment(new Date()).format("DD/MM/YYYY")
                      await recommendedUser.save()
                      console.log("pro::recommendedUser", recommendedUser)
                    }
                  }
                } else {
                  console.log("pro:::new user::else", tempUsers.length)
                  if (tempUsers.length > 5) {
                    console.log("pro:::new user::else::if", tempUsers.length)
                    tempUsers.splice(5, tempUsers.length - 1);
                    let temp = {
                      userId: params.userId,
                      recommendedDate: moment(new Date()).format("DD/MM/YYYY"),
                      user: tempUsers,
                      hasPlan: true
                    }
                    await services.create("", temp, context, res);
                  } else {
                    let temp = {
                      userId: params.userId,
                      recommendedDate: moment(new Date()).format("DD/MM/YYYY"),
                      user: tempUsers,
                      hasPlan: true
                    }
                    await services.create("", temp, context, res);
                  }
                }
                console.log("out from else pro")
              }
            }
          } else {
            console.log("final else::default")
            if (tempUsers.length > 2) {
              console.log("final else::if::before", tempUsers.length)
              tempUsers.splice(2, tempUsers.length - 1);
              console.log("final else::if::after", tempUsers.length)
              let recommendedUser = await db.recommended.findOne({
                userId: {
                  $eq: params.userId
                },
              })
              console.log("final else::if::recommendedUser", recommendedUser)

              if (recommendedUser != null && recommendedUser != undefined) {
                if (recommendedUser.recommendedDate == moment(new Date()).format("DD/MM/YYYY")) {
                  tempUser = recommendedUser.user
                  // console.log("tempUsers::::::", tempUsers)
                } else {
                  // console.log('recommended::::', tempUsers)
                  recommendedUser.user = tempUser
                  recommendedUser.recommendedDate = moment(new Date()).format("DD/MM/YYYY")
                  recommendedUser.save()
                }

              } else {
                console.log("final else::if::recommendedUser::else")

                let temp = {
                  userId: params.userId,
                  recommendedDate: moment(new Date()).format("DD/MM/YYYY"),
                  user: tempUsers,
                  hasPlan: false
                }
                // await new db.recommended(temp).save();
                await services.create("", temp, context, res);
              }
            } else {
              console.log("final else::else")

              let temp = {
                userId: params.userId,
                recommendedDate: moment(new Date()).format("DD/MM/YYYY"),
                user: tempUsers,
                hasPlan: false
              }
              // await new db.recommended(temp).save();
              await services.create("", temp, context, res);

            }
          }
        }
        // console.log("users", tempUsers)
        users = tempUsers;
      } else {
        users = await db.user.find(query);
      }
    } else {
      if (
        page &&
        page.pageNo != undefined &&
        page.pageNo != null &&
        page.pageNo != ""
      ) {
        users = await db.user
          .find(query)
          .skip(page.skipCount)
          .limit(page.items)
          .sort({
            timeStamp: -1,
          });
      } else {
        users = await db.user.find(query).sort({
          timeStamp: -1,
        });
      }
    }

    // add profile pic in images array and give total reportedCount of each user
    if (users.length != 0) {
      for (let user of users) {
        if (user) {
          let object = {};
          if (user.profilePic) {
            object = user.profilePic;
          }
          if (user.images) {
            user.images.splice(0, 0, object);
          }
          // if (user.images && user.images.length != 0) {
          //   user.images.splice(0, 0, object);
          // }
          let req = {
            query: {
              userId: user._id.toString(),
            },
          };
          let reports = await service.get(req, "", context);
          user.reportedByCount = reports.length;
        }
      }
    }
    // total users
    let count = await db.user.find(query)
    let totalCount = count.length;
    let createUserTempModel = await userTempModel(users, totalCount);
    users = createUserTempModel;

    log.end();
    return users;
  } catch (err) {
    log.end();
    throw new Error(err);
  }
};

const turn = async (body, context) => {
  try {
    let user = await db.user.findById(body.msgFromId);
    let msgToUser = await db.user.findById(body.msgToId);
    let like = await db.like.findOne({
      likedBy: {
        $eq: body.msgFromId,
      },
      likedTo: {
        $eq: body.msgToId,
      },
    });
    if (like) {
      like.turn = "true";
      like.save();
    }
    let senderName = user.firstName[0].toUpperCase() + user.firstName.slice(1);
    let model = {
      notification: {
        title: ` ${user.firstName} ${user.lastName}`,
        body: `It's your turn`,
      },
      data: {
        type: "turn",
        msgFromUser: {
          name: user.firstName,
          profilePic: user.profilePic,
        },
        msgToUser: {
          name: msgToUser.firstName,
          profilePic: msgToUser.profilePic,
        },
      },
      userId: body.msgToId,
      msgFromId: body.msgFromId,
      from: "turn",
    };
    await pushNotificationService.create("", model, "", "");

    return;
  } catch (err) {
    throw new Error(err);
  }
};

exports.create = create;
exports.login = login;
exports.update = update;
exports.getById = getById;
exports.get = get;
exports.logOut = logOut;
exports.userExists = userExists;
exports.getSocketUsers = getSocketUsers;
exports.addField = addField;
exports.turn = turn;

// const getById = async (id, context) => {
//   const log = context.logger.start(`services/users/getById:${id}`);
//   try {
//     let plan;
//     let user;
//     let query = {
//       _id: {
//         $eq: mongoose.Types.ObjectId(id),
//       },
//     };
//     user = await db.user.aggregate([
//       { $match: query },
//       { $unwind: "$basicQuestions" },
//       {
//         $lookup: {
//           from: "questions",
//           let: { question_Id: "$basicQuestions.questionId" },
//           pipeline: [
//             { $match: { $expr: { $eq: ["$_id", "$$question_Id"] } } },
//             { $project: { question: 1 } },
//           ],
//           as: "basicQuestions.que",
//         },
//       },
//       { $unwind: "$basicQuestions.que" },
//       {
//         $group: {
//           _id: "$_id",
//           root: { $mergeObjects: "$$ROOT" },
//           basicQuestions: { $push: "$basicQuestions" },
//         },
//       },
//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: ["$root", "$$ROOT"],
//           },
//         },
//       },
//       {
//         $project: {
//           root: 0,
//         },
//       },
//     ]);
//     if (user.length != 0) {
//       user = user[0];
//       let req = {
//         query: {
//           userId: id,
//         },
//       };
//       let reports = await service.get(req, "", context);
//       if (reports && reports.length != 0) {
//         user.reportedBy = reports;
//       }
//     } else {
//       throw new Error("User not found");
//     }

//     if (user.planId != null && user.planId != undefined) {
//       // // find user
//       plan = await db.plan.findOne({
//         _id: {
//           $eq: user.planId,
//         },
//       });
//       if (plan) {
//         user.subscriptionPlan = plan;
//       }
//     }
//     log.end();
//     return user;
//   } catch (err) {
//     log.end();
//     throw new Error(err);
//   }
// };

// get all user query
// const get = async (req, page, context) => {
//   const log = context.logger.start(`services/users/get`);
//   try {
//     let params = req.query;
//     let query = {};
//     let users;
//     let likes;
//     let blockedUser;
//     let result = [];

//     if (
//       params.type &&
//       params.type != null &&
//       params.type != undefined &&
//       params.type != ""
//     ) {
//       query = {
//         type: {
//           $eq: params.type,
//         },
//       };
//     }
//     if (
//       params.status &&
//       params.status != null &&
//       params.status != undefined &&
//       params.status != ""
//     ) {
//       query = Object.assign(
//         {
//           status: {
//             $eq: params.status,
//           },
//         },
//         query
//       );
//     }
//     if (params.reportedUser && params.reportedUser == "true") {
//       query = Object.assign(
//         {
//           isReported: {
//             $eq: "true",
//           },
//         },
//         query
//       );
//     }
//     console.log("queryyyyyyyyyyy::", query);
//     if (
//       params.userId !== null &&
//       params.userId != undefined &&
//       params.longitude !== null &&
//       params.longitude != undefined &&
//       params.latitude !== null &&
//       params.latitude != undefined
//     ) {
//       let user = await db.user.findById(params.userId);
//       if (!user) {
//         throw new Error(message.userError);
//       }
//       let distance;
//       if (user.preferences && user.preferences.distance) {
//         distance = JSON.parse(user.preferences.distance);
//         distance = distance * 0.621371;
//       } else {
//         distance = 100 * 0.621371;
//       }
//       // let coordinates = user.address.location.coordinates;
//       let coordinates = [
//         JSON.parse(params.longitude),
//         JSON.parse(params.latitude),
//       ];

//       let likesQuery = {
//         likedBy: {
//           $eq: params.userId,
//         },
//       };
//       let blockQuery = {
//         blockedBy: {
//           $eq: params.userId,
//         },
//       };

//       // like/dislike users
//       likes = await db.like.find(likesQuery, { _id: 0, likedTo: 1 });
//       if (likes.length != 0) {
//         likes.forEach((row) => {
//           result.push(mongoose.Types.ObjectId(row.likedTo));
//         });
//       }

//       // blocked users
//       blockedUser = await db.block.find(blockQuery, { _id: 0, blockedTo: 1 });
//       if (blockedUser.length != 0) {
//         blockedUser.forEach((row) => {
//           result.push(mongoose.Types.ObjectId(row.blockedTo));
//         });
//       }
//       // user itself
//       result.push(user._id);

//       query = {
//         type: "user",
//         status: "active",
//         isVisible: true,
//         _id: { $nin: result },
//         "address.location": {
//           $geoWithin: {
//             $centerSphere: [coordinates, milesToRadian(distance)],
//           },
//         },
//       };

//       if (user.preferences.men == true) {
//         query = Object.assign(
//           {
//             gender: "male",
//           },
//           query
//         );
//       }
//       if (user.preferences.women == true) {
//         query = Object.assign(
//           {
//             gender: "female",
//           },
//           query
//         );
//       }
//       if (user.preferences.men == true && user.preferences.women == true) {
//         query = Object.assign(
//           {
//             gender: { $in: ["male", "female"] },
//           },
//           query
//         );
//       }
//       users = await db.user.aggregate([
//         { $match: query },
//         { $unwind: "$basicQuestions" },
//         {
//           $lookup: {
//             from: "questions",
//             let: { question_Id: "$basicQuestions.questionId" },
//             pipeline: [
//               { $match: { $expr: { $eq: ["$_id", "$$question_Id"] } } },
//               { $project: { question: 1 } },
//             ],
//             as: "basicQuestions.que",
//           },
//         },
//         { $unwind: "$basicQuestions.que" },
//         {
//           $group: {
//             _id: "$_id",
//             root: { $mergeObjects: "$$ROOT" },
//             basicQuestions: { $push: "$basicQuestions" },
//           },
//         },
//         {
//           $replaceRoot: {
//             newRoot: {
//               $mergeObjects: ["$root", "$$ROOT"],
//             },
//           },
//         },
//         {
//           $project: {
//             root: 0,
//           },
//         },
//       ]);

//       if (users.length != 0) {
//         if (user.preferences.age) {
//           if (user.preferences.age.from && user.preferences.age.to) {
//             users = await users.filter((tempuser) => {
//               return (
//                 tempuser.age >= user.preferences.age.from &&
//                 tempuser.age <= user.preferences.age.to
//               );
//             });
//           }
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.height) {
//           if (user.preferences.height.from && user.preferences.height.to) {
//             users = await users.filter((tempuser) => {
//               return (
//                 tempuser.height >= user.preferences.height.from &&
//                 tempuser.height <= user.preferences.height.to
//               );
//             });
//           }
//         }
//       }
//       if (users.length != 0) {
//         if (
//           user.preferences.languages &&
//           user.preferences.languages.length != 0
//         ) {
//           let userLanguages = user.preferences.languages;
//           users = await users.filter((tempuser) => {
//             if (tempuser.languages && tempuser.languages.length != 0) {
//               return tempuser.languages.some((el) => {
//                 return userLanguages.some((language) => {
//                   return language.option == el.option;
//                 });
//               });
//             }
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.bodyType) {
//           users = await users.filter((tempuser) => {
//             return tempuser.bodyType == user.preferences.bodyType;
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.ethnicity) {
//           users = await users.filter((tempuser) => {
//             return tempuser.ethnicity == user.preferences.ethnicity;
//           });
//         }
//       }

//       if (users.length != 0) {
//         if (user.preferences.alcohol) {
//           users = await users.filter((tempuser) => {
//             return tempuser.alcohol == user.preferences.alcohol;
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.smoking) {
//           users = await users.filter((tempuser) => {
//             return tempuser.smoking == user.preferences.smoking;
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.marijuana) {
//           users = await users.filter((tempuser) => {
//             return tempuser.marijuana == user.preferences.marijuana;
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.diet) {
//           users = await users.filter((tempuser) => {
//             return tempuser.diet == user.preferences.diet;
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.kids) {
//           users = await users.filter((tempuser) => {
//             return tempuser.kids == user.preferences.kids;
//           });
//         }
//       }
//       if (users.length != 0) {
//         if (user.preferences.wantsKids) {
//           users = await users.filter((tempuser) => {
//             return tempuser.wantsKids == user.preferences.wantsKids;
//           });
//         }
//       }
//     } else {
//       if (
//         page &&
//         page.pageNo != undefined &&
//         page.pageNo != null &&
//         page.pageNo != ""
//       ) {
//         users = await db.user.aggregate([
//           { $match: query },
//           { $unwind: "$basicQuestions" },
//           {
//             $lookup: {
//               from: "questions",
//               let: { question_Id: "$basicQuestions.questionId" },
//               pipeline: [
//                 { $match: { $expr: { $eq: ["$_id", "$$question_Id"] } } },
//                 { $project: { question: 1 } },
//               ],
//               as: "basicQuestions.que",
//             },
//           },
//           { $unwind: "$basicQuestions.que" },
//           {
//             $group: {
//               _id: "$_id",
//               root: { $mergeObjects: "$$ROOT" },
//               basicQuestions: { $push: "$basicQuestions" },
//             },
//           },
//           {
//             $replaceRoot: {
//               newRoot: {
//                 $mergeObjects: ["$root", "$$ROOT"],
//               },
//             },
//           },
//           {
//             $project: {
//               root: 0,
//             },
//           },
//           { $sort: { timestamp: -1 } },
//           { $limit: page.items },
//           { $skip: page.skipCount },
//         ]);
//       } else {
//         users = await db.user.aggregate([
//           { $match: query },
//           { $unwind: "$basicQuestions" },
//           {
//             $lookup: {
//               from: "questions",
//               let: { question_Id: "$basicQuestions.questionId" },
//               pipeline: [
//                 { $match: { $expr: { $eq: ["$_id", "$$question_Id"] } } },
//                 { $project: { question: 1 } },
//               ],
//               as: "basicQuestions.que",
//             },
//           },
//           { $unwind: "$basicQuestions.que" },
//           {
//             $group: {
//               _id: "$_id",
//               root: { $mergeObjects: "$$ROOT" },
//               basicQuestions: { $push: "$basicQuestions" },
//             },
//           },
//           {
//             $replaceRoot: {
//               newRoot: {
//                 $mergeObjects: ["$root", "$$ROOT"],
//               },
//             },
//           },
//           {
//             $project: {
//               root: 0,
//             },
//           },
//           { $sort: { timestamp: -1 } },
//         ]);
//       }
//     }

//     // add profile pic in images array and give total reportedCount of each user
//     if (users.length != 0) {
//       for (let user of users) {
//         if (user) {
//           let object = {};
//           if (user.profilePic) {
//             object = user.profilePic;
//           }
//           if (user.images && user.images.length != 0) {
//             user.images.splice(0, 0, object);
//           }
//           let req = {
//             query: {
//               userId: user._id.toString(),
//             },
//           };
//           let reports = await service.get(req, "", context);
//           user.reportedByCount = reports.length;
//         }
//       }
//       // reported users
//       // if (params.reportedUser && params.reportedUser == "true") {
//       //   users = await users.filter((tempuser) => {
//       //     return tempuser.reportedByCount != 0;
//       //   });
//       // }
//     }
//     // total users
//     let totalCount = await db.user.find(query).count();
//     let createUserTempModel = await userTempModel(users, totalCount);
//     users = createUserTempModel;

//     log.end();
//     return users;
//   } catch (err) {
//     log.end();
//     throw new Error(err);
//   }
// };
