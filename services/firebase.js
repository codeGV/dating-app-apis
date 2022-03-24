"use strict";

var admin = require("firebase-admin");

var serviceAccount = require("../key/notificationKey.json");

var admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mrandmrs-58993.firebaseio.com",
});
console.log(admin);

exports.admin = admin;
