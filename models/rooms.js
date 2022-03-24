"use strict";
const mongoose = require("mongoose");

const room = mongoose.Schema({
  name1: { type: String, default: "", required: true },
  name2: { type: String, default: "", required: true },
  lastActive: { type: Date, default: Date.now },
  createdOn: { type: Date, default: Date.now },
});

mongoose.model("Room", room);
// hooks.configure(user)
module.exports = room;
