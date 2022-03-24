"use strict";
module.exports = {
  question: {
    type: String,
    lowercase: true,
  },
  option: [
    {
      value: String,
    },
  ],
  text: {
    type: String,
  },
  type: {
    type: String,
    default: "registration",
    enum: ["registration", "interest", "aboutMe"],
  },
};
