"use strict";
const mongoose = require("mongoose");

// User Module
module.exports = {
  likedBy: {
    type: mongoose.Schema.ObjectId,
  },
  likedTo: String,
  status: {
    type: String,
    default: "like",
    enum: ["like", "dislike"],
  },
  turn: {
    type: Boolean,
    default: "false",
    enum: ["true", "false"],
  },
  iGivePermission:{
    type: Boolean,
    default: "false",
    enum: ["true", "false"],
  },
  iHavePermission:{
    type: Boolean,
    default: "false",
    enum: ["true", "false"],
  }
};
