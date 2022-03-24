"use strict";
const FCM = require("fcm-node");
const serverKey =
  "AAAAG6vUDuE:APA91bFncs1hfrqG-vWLO_F5aeBfARy7X3_Gc6WTeNIylfZKZOaBrLZesFR2HgqL5v0jNBQt0HwiRfvEwgOWQvgAC6ItzEwoC2yzyS4NL37aKlNQbjPsQYpoQQAlvXvwo_oWN2ION5-c";
const fcm = new FCM(serverKey);
const message = require("../helpers/message");

const sendNotification = async (model) => {
  try {
    let sendNotifications = await new db.pushNotification(model).save();
    return sendNotifications;
  } catch (err) {
    throw new Error(err);
  }
};

const create = async (req, model, context, res) => {
  // const log = context.logger.start("services/pushNotifications");
  try {
    let sendNotifications;
    let user;
    let msgFromUser;
    let message;

    user = await db.user.findById(model.userId);
    if (!user) {
      throw new Error(message.userError);
    }
    if (model.from == "approved") {
      message = {
        to: user.fcmToken,
        collapse_key: "green",
        notification: model.notification,
          data: model.data,
      };
    }
    if (model.from == "rejected") {
      message = {
        to: user.fcmToken,
        collapse_key: "green",
        notification: model.notification,
        data: model.data,
      };
    }
    if (model.from == "chat") {
      msgFromUser = await db.user.findById(model.msgFromId);
      if (!msgFromUser) {
        throw new Error(message.userError);
      }
      message = {
        to: user.fcmToken,
        collapse_key: "green",
        // notification: {
        //   title: model.notification.title,
        //   body: model.notification.body,
        // },
        data: {
          title: model.notification.title,
          body: model.notification.body,
          profilePic: msgFromUser.profilePic,
        },
      };
    }
    
    if (model.from == "call") {
      message = {
        to: user.fcmToken,
        collapse_key: "green",
        data: {
          object: model.data,
        },
      };
    }
    if (model.from == "like") {
      message = {
        registration_ids: model.to,
        collapse_key: "green",
        notification: model.notification,
        data: model.data,
      };
    }
    if (model.from == "turn") {
      message = {
        to: user.fcmToken,
        collapse_key: "green",
        notification: model.notification,
        data: model.data,
      };
    }

    await fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!", err);
      } else {
        let temp = [];
        console.log("Successfully sent with response: ", JSON.parse(response));
        temp = JSON.parse(response);
        model.messageId = temp.results[0].message_id;
        if (temp.success == 1) {
          sendNotifications = sendNotification(model).then((result) => {
            console.log("resultttt", result);
          });
        }
      }
      // log.end();
      return sendNotifications;
    });
  } catch (err) {
    // log.end();
    throw new Error(err);
  }
};

exports.create = create;

// var message = {
//   to: user.fcmToken,
//   collapse_key: "green",
//   notification: {
//     title: model.notification.title,
//     body: model.notification.body,
//     image: msgFromUser.profilePic.url,
//   },
//   data: {
//     title: model.notification.title,
//     body: model.notification.body,
//     profilePic: msgFromUser.profilePic,
//   },
// };
