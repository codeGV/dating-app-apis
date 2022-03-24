var socketio = require("socket.io");
var mongoose = require("mongoose");
var events = require("events");
var eventEmitter = new events.EventEmitter();
console.log("connected");
var moment = require("moment");
const service = require("../services/pushNotification");

require("../models/rooms.js");
var roomModel = mongoose.model("Room");

require("../models/chats.js");
var chatModel = mongoose.model("Chat");

module.exports.sockets = function (http) {
  io = socketio.listen(http);

  var ioChat = io;
  let userList = [];
  let oldChats = [];
  var sendOldChats, setRoom;

  //socket.io magic starts here
  ioChat.on("connection", function (socket) {
    // console.log("socketio chat connected.");

    //function to get user name
    socket.on("init", function (data) {
      console.log("User Connected");
      // socket.emit("connected", "Welcome");

      socket.userId = data.userId;
      let tempData = {
        to: data.userId,
      };
      // console.log("datattatatta:::", data);
      userExists(tempData).then((isExists) => {
        if (!isExists) {
          db.user.findById(data.userId).exec(function (err, user) {
            if (err) {
              console.log("user get error", err);
            } else {
              if (user) {
                userList.push({
                  userId: user._id,
                  userName: user.firstName,
                  images: user.images,
                });
                socket.emit("login", {
                  userList: userList,
                });

                socket.broadcast.emit("user joined", {
                  userId: data.userId,
                });
                // console.log("before userrsss listtttt", userList);
                socket.join(data.userId);

                // console.log("after userrsss listtttt", userList);
              }
            }
          });
        } else {
          socket.emit("getUsers", userList);
        }
      });
    });

    socket.on("set-room", function (room) {
      //leaving room.
      socket.leave(socket.room);
      //getting room data.
      eventEmitter.emit("get-room-data", room);
      //setting room and join.
      setRoom = function (roomId) {
        socket.room = roomId;
        // console.log("roomId : " + socket.room);
        socket.join(socket.room);
        io.to(socket.room).emit("set-room", socket.room);
      };
    });
    // old chat.
    socket.on("old-chats", function (room) {
      eventEmitter.emit("get-old-chats", room);
      // console.log("oldChatss up");
      sendOldChats = function () {
        io.to(socket.room).emit("old-chats", {
          room: room.room,
          result: oldChats,
        });
      };
    }); // end of old chat
    //showing msg on typing.
    socket.on("typing", function (data) {
      socket.to(socket.room).broadcast.emit("typing", data);
    });
    //for showing chats.
    socket.on("chat-msg", function (data) {
      //emits event to save chat to database.
      eventEmitter.emit("save-chat", {
        msgFromId: data.msgFromId,
        msgFrom: data.msgFrom,
        msgToId: data.msgToId,
        msgTo: data.msgTo,
        msg: data.msg,
        room: socket.room,
        date: data.date,
      });

      let msgTime = moment(data.date).format("LT");
      let msgDate = moment(data.date).format("L");
      //emits event to send chat msg to all clients.
      // console.log("msgDate", msgDate);
      ioChat.to(socket.room).emit("chat-msg", {
        msgFromId: data.msgFromId,
        msgToId: data.msgToId,
        msgFrom: socket.username,
        msgFromPic: data.msgFromPic,
        msg: data.msg,
        // time: msgTime,
        date: data.date,
      });
    });

    // send notification if another user is not connected
    socket.on("wakeup-call", function (data) {
      console.log("wakeup-call", data.to);
      let model = {
        userId: data.to,
        data: data,
        from: "call",
      };
      service.create("", model, "", "");
    });

    // another user is connected
    socket.on("call-acknowledgement", function (data) {
      console.log("call-acknowledgement", data);
      io.in(data.from).emit("call:acknowledged", data);
    });

    // call
    socket.on("call", async (data) => {
      console.log("call to", data.to);
      userExists(data).then((isExists) => {
        console.log("isExists isExists", isExists);
        if (isExists) {
          io.in(data.to).emit("call:incoming", data);
        } else {
          let message = {
            msg: "offline",
          };
          io.in(data.to).emit("call end", message);
          // socket.emit("userExists", false);
        }
      });
    });

    socket.on("iceCandidate", function (data) {
      // console.log("call:iceCandidate", data.from);
      // console.log("call:iceCandidate to", data.to);
      io.in(data.to).emit("call:iceCandidate", data);
    });

    socket.on("answer", function (data) {
      // console.log("answer from", data.from);
      io.in(data.to).emit("call:answer", data);
    });

    socket.on("answered", function (data) {
      // console.log("answer from", data.from);
      // console.log("answer to", data.to);
      io.in(data.to).emit("call:answered", data);
    });

    socket.on("getUsers", function () {
      // await onUsersGet(userList);
      socket.emit("getUsers", userList);
      // console.log("in get userrsss listtttt", userList);
    });

    socket.on("user count", function () {
      socket.emit("user count", userList.length);
    });

    socket.on("call end", function (data) {
      console.log("emit end call", data);
      io.in(data.to).emit("call end", data);
    });

    socket.on("disconnect", function () {
      console.log("User Disconnected");
      for (let i = 0; i < userList.length; i++) {
        // console.log("socket user", socket.userId);
        // console.log("userList in disconnect", userList);

        if (socket.userId == userList[i].userId) {
          userList.splice(i, 1);
        }

        // console.log("userList in disconnect after splice", userList);
      }
      socket.broadcast.emit("user left", {
        userId: socket.userId,
      });
      // socket.emit("getUsers", userList);
    });
  }); //end of io.on(connection).

  userExists = (data) => {
    return new Promise(async (resolve) => {
      let userExistss = await userList.some((user) => user.userId == data.to);
      // console.log("in functionnnnn", userExistss);
      resolve(userExistss);
    });
  };
  //saving chats to database.
  eventEmitter.on("save-chat", function (data) {
    // console.log("save-chat:", data);
    try {
      var newChat = new chatModel({
        msgFromId: data.msgFromId,
        msgFrom: data.msgFrom,
        msgToId: data.msgToId,
        msgTo: data.msgTo,
        msg: data.msg,
        room: data.room,
        createdOn: data.date,
      });
    } catch (err) {
      console.log(err);
    }
    newChat.save(function (err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        // console.log("Chat Saved", result);
        let senderName =
          result.msgFrom[0].toUpperCase() + result.msgFrom.slice(1);
        let model = {
          notification: {
            title: ` ${senderName}`,
            body: `${result.msg} `,
          },
          userId: result.msgToId,
          msgFromId: result.msgFromId,
          from: "chat",
        };
        service.create("", model, "", "");
      }
    });
  });

  //listening get-room-data event.
  eventEmitter.on("get-room-data", function (room) {
    // console.log("get-room-data:", room);
    db.rooms.find(
      {
        $or: [
          {
            name1: room.name1,
          },
          {
            name1: room.name2,
          },
          {
            name2: room.name1,
          },
          {
            name2: room.name2,
          },
        ],
      },
      function (err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          if (result == "" || result == undefined || result == null) {
            var today = Date.now();

            newRoom = new roomModel({
              name1: room.name1,
              name2: room.name2,
              lastActive: today,
              createdOn: today,
            });

            newRoom.save(function (err, newResult) {
              if (err) {
                console.log("Error : " + err);
              } else if (
                newResult == "" ||
                newResult == undefined ||
                newResult == null
              ) {
                console.log("Some Error Occured During Room Creation.");
              } else {
                setRoom(newResult._id); //calling setRoom function.
              }
            }); //end of saving room.
          } else {
            var jresult = JSON.parse(JSON.stringify(result));
            setRoom(jresult[0]._id); //calling setRoom function.
          }
        } //end of else.
      }
    ); //end of find room.
  }); //end of get-room-data listener.

  eventEmitter.on("get-old-chats", function (data) {
    // console.log("get-old-chatssssssssssssssssssss");
    db.chats
      .find({
        room: {
          $eq: data.room,
        },
      })
      .exec(function (err, chats) {
        if (err) {
          console.log("Error : " + err);
        } else {
          if (chats.length != 0) {
            let tempchats = chats.sort(function (a, b) {
              return new Date(a.createdOn) - new Date(b.createdOn);
            });
            if (oldChats.length != 0) {
              oldChats = [];
            }

            tempchats.forEach((chat) => {
              let chatDetial = {
                chatId: chat._id,
                msgFrom: chat.msgFromId,
                msgTo: chat.msgToId,
                msg: chat.msg,
                room: chat.room,
                date: chat.createdOn,
              };
              oldChats.push(chatDetial);
            });
            // console.log("stack " + Object.keys(oldChats));
            sendOldChats();
          } else {
            oldChats = [];
            sendOldChats();
          }
        }
      });
  });
};

// socket.on("call", async (data) => {
//   // console.log("call from", data.from);
//   // console.log("call to", data.to);
//   userExists(data).then((isExists) => {
//     if (isExists) {
//       io.in(data.to).emit("call:incoming", data);
//     } else {
//       socket.emit("userExists", false);
//     }
//   });
// });
