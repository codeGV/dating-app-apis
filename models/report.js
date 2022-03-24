'use strict'
const mongoose = require('mongoose')
// User Module
module.exports = {
   
   reason:String,
   reasonName:String,
   reportedTo:String,
   reportedBy:{type: mongoose.Schema.ObjectId},
}