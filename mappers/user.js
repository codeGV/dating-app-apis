"use strict";

const { loginType } = require("../models/user");

// users create mapper
exports.toModel = (entity) => {
  let model = entity;
  return model;
};

// for particular user
exports.toGetUser = (entity) => {
  var model = {
    _id: entity._id,
    type: entity.type,
    rejectedReason:entity.rejectedReason,
    firstName: entity.firstName,
    lastName: entity.lastName,
    gender: entity.gender,
    profilePic: entity.profilePic,
    alcohol: entity.alcohol,
    smoking: entity.smoking,
    marijuana: entity.marijuana,
    diet: entity.diet,
    pets: entity.pets,
    kids: entity.kids,
    wantsKids: entity.wantsKids,
    occcupation: entity.occcupation,
    currentCity: entity.currentCity,
    height: entity.height,
    religion: entity.religion,
    postalCode: entity.postalCode,
    race: entity.race,
    age: entity.age,
    work: entity.work,
    status: entity.status,

    visibleName: entity.visibleName,
    visibleAge: entity.visibleAge,
    visibleLocation: entity.visibleLocation,
    orientation: entity.orientation,
    languages: entity.languages,
    connection: entity.connection,
    bodyType: entity.bodyType,
    employment: entity.employment,
    interests: entity.interests,
    astrologicalSign: entity.astrologicalSign,
    email: entity.email,
    postalCode: entity.postalCode,
    race: entity.race,
    visibleName: entity.visibleName,
    visibleAge: entity.visibleAge,
    visibleLocation: entity.visibleLocation,

    images: entity.images,
    firebaseToken: entity.firebaseToken,
    uId: entity.uId,
    tempToken: entity.tempToken,
    token: entity.token,
    address: entity.address,

    basicQuestions: entity.basicQuestions,
    aboutMeQuestions: entity.aboutMeQuestions,
    educations: entity.educations,
  };
  return model;
};

// for login
exports.toUser = (entity) => {
  var model = {
    _id: entity._id,
    type: entity.type,
    status: entity.status,
    userName: entity.userName,
    firstName: entity.firstName,
    lastName: entity.lastName,
    firmName: entity.firmName,
    email: entity.email,
    token: entity.token,
    phone: entity.phone,
    profilePic: entity.profilePic,
  };
  return model;
};

