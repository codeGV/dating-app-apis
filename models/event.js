"use strict";
module.exports = {
  name: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inActive"],
  },
  image: {
    url: String,
    thumbnail: String,
    resize_url: String,
    resize_thumbnail: String,
  },
  link: String,
};
