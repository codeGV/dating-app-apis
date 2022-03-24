"use strict";
module.exports = {
  duration: {
    type: Number,
  },
  durationType: {
    type: String,
    default: "days",
    enum: ["days", "months", "years"],
  },
  planType: {
    type: String,
    default: "basic",
    enum: ["basic", "pro"],
  },
  monthlyPrice: {
    type: Number,
  },
  offer: Number,
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
};
