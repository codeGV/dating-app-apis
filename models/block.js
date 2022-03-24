"use strict";
const mongoose = require('mongoose')

// User Module
module.exports = {
  blockBy: {
    type: mongoose.Schema.ObjectId,
  },
  blockTo: String,
};
