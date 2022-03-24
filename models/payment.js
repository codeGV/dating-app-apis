"use strict";

module.exports = {
  transactionId: String,
  userId: String,
  planId: String,
  status: {
    type: String,
    default: "active",
    enum: ["active", , "inactive"],
  },
  audioCall: Number,
  lastAudioCallTime: Date,

  vedioCall: Number,
  lastVedioCallTime: Date,

  expiryDate: Date,
};
