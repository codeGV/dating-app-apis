'use strict'

// User Module
module.exports = {
   
   recommendedDate:String,
   user:[],
   userId:String,
   hasPlan: {
      type: Boolean,
      default:false,
      enum: [true, false],
    },
   
}