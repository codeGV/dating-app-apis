"use strict";
const mongoose = require("mongoose");

module.exports = {
  firstName: {
    type: String,
    lowercase: String,
    trim: true,
  },
  type: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["active", "pending", "inactive","rejected","delete"],
  },
  rejectedReason:String,
  isVisible: {
    type: Boolean,
    default: true,
    enum: [false, true],
  },
  lastName: {
    type: String,
    lowercase: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: String,
    trim: true,
  },
  profilePic: {
    url: String,
    thumbnail: String,
    resize_url: String,
    resize_thumbnail: String,
  },
  work: String,
  isExists: {
    type: String,
    default: "true",
    enum: ["true", "false"],
  },
  currentCity: String,
  postalCode: String,
  address: {
    location: {
      type: {
        type: "String",
        required: true,
        enum: ["Point", "LineString", "Polygon"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [<longitude>, <latitude>]
        index: "2dsphere", // create the geospatial index
      },
    },
  },
  gender: {
    type: String,
    lowercase: String,
    default: "male",
    enum: ["male", "female"],
  },

  visibleAge: {
    type: Boolean,
    default: true,
    enum: [true, false],
  },
  visiblelikeDislike: {
    type: Boolean,
    default: true,
    enum: [true, false],
  },
  visibleImage: {
    type: Boolean,
    default: true,
    enum: [true, false],
  },
  visibleLocation: {
    type: Boolean,
    default: true,
    enum: [true, false],
  },
  orientation: {
    type: String,
    lowercase: String,
    enum: ["male", "female"],
  },
  occupation: String,
  languages: [
    {
      option: String,
    },
  ],
  // race: String,
  bodyType: String,

  employment: String,
  astrologicalSign: String,
  alcohol: String,
  smoking: String,
  marijuana: String,
  diet: String,
  pets: String,
  maritalStatus: String,

  wantsKids: String,
  userName: String,

  age: Number,
  phone: String,
  height: Number,
  religion: String,
  images: [
    {
      url: String,
      thumbnail: String,
      resize_url: String,
      resize_thumbnail: String,
    },
  ],
  race: String,
  token: String,
  education: String,
  basicQuestions: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
      },
      que: String,
      ans: {
        value: String,
        _id: String,
      },
    },
  ],
  aboutMeQuestions: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
      },
      que: String,
      ans: String,
    },
  ],
  interests: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
      },
      que: String,
      ans: String,
    },
  ],
  preferences: {
    women: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    men: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    age: {
      from: Number,
      to: Number,
    },
    height: {
      from: Number,
      to: Number,
    },
    occupation: String,
    distance: String,
    bodyType: String,
    languages: [
      {
        option: String,
      },
    ],
    race: String,
    religion: String,
    pets: String,
    maritalStatus: String,
    wantsKids: String,
    education: String,
    employment: String,
    astrologicalSign: String,
    alcohol: String,
    smoking: String,
    diet: String,
  },
  firebaseToken: String,
  uId: String,
  tempToken: String,
  password: String,
  loginType: {
    type: String,
    lowercase: String,
    default: "app",
    enum: ["app", "google", "facebook"],
  },
  planId: {
    type: mongoose.Schema.ObjectId,
  },
  paymentId: String,
  subscriptionPlan: {
    planType: {
      type: String,
      lowercase: String,
      enum: ["basic", "pro"],
    },
  },
  isReported: {
    type: String,
    default: "false",
    enum: ["true", "false"],
  },
  fcmToken: String,
  reportedByCount: Number,
  matchingPercentage: Number,
  // reportedBy: [],
};
