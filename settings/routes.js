"use strict";

const fs = require("fs");
const specs = require("../specs");
const api = require("../api");
var auth = require("../permit");
const validator = require("../validators");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

const configure = (app, logger) => {
  const log = logger.start("settings:routes:configure");

  app.get("/specs", function (req, res) {
    fs.readFile("./public/specs.html", function (err, data) {
      if (err) {
        return res.json({
          isSuccess: false,
          error: err.toString(),
        });
      }
      res.contentType("text/html");
      res.send(data);
    });
  });

  app.get("/api/specs", function (req, res) {
    res.contentType("application/json");
    res.send(specs.get());
  });

  // .......................users routes..............................
  app.post("/api/users/addNewField", api.users.addField);
  app.post("/api/users/turn", api.users.turn);


  app.get("/api/users", auth.context.requiresToken, api.users.get);

  app.get(
    "/api/users/socketUsers",
    auth.context.builder,
    api.users.getSocketUsers
  );

  app.post(
    "/api/users",
    auth.context.builder,
    validator.users.canCreate,
    api.users.create
  );
  app.get(
    "/api/users/:id",
    auth.context.builder,
    auth.context.requiresToken,
    validator.users.getById,
    api.users.getById
  );
  app.put(
    "/api/users/:id",
    auth.context.builder,
    auth.context.requiresToken,
    validator.users.update,
    api.users.update
  );
  app.post(
    "/api/users/login",
    auth.context.builder,
    validator.users.login,
    api.users.login
  );
  app.post(
    "/api/users/userExists",
    auth.context.builder,
    validator.users.userExists,
    api.users.userExists
  );

  // app.post('/api/users/forgotPassword', auth.context.builder, validator.users.forgotPassword, api.users.forgotPassword);
  // app.post('/api/users/resetPassword', auth.context.builder, validator.users.resetPassword, api.users.resetPassword);
  // app.post('/api/users/changePassword', auth.context.builder, auth.context.requiresToken, validator.users.changePassword, api.users.changePassword);

  app.post(
    "/api/users/logOut",
    auth.context.builder,
    auth.context.requiresToken,
    api.users.logOut
  );

  // ................................upload files............................................
  app.post(
    "/api/files",
    auth.context.builder,
    multipartMiddleware,
    api.files.create
  );
  app.post("/api/files/upload", multipartMiddleware, api.files.upload);
  app.get("/api/files/:id", auth.context.builder, api.files.getById);
  //  app.get('/api/files', auth.context.builder, api.files.get);

  // // ................................upload htmlDocuments............................................
  // app.post('/api/documents', auth.context.builder, multipartMiddleware, api.documents.create)
  // app.post('/api/documents/upload', multipartMiddleware, api.documents.upload);
  // app.get('/api/documents', auth.context.builder, multipartMiddleware, api.documents.get)

  // ------------------------------------------plans-------------------------------
  app.get(
    "/api/plans/:id",
    auth.context.requiresToken,
    validator.plans.getById,
    api.plans.getById
  );
  app.post(
    "/api/plans",
    auth.context.builder,
    auth.context.requiresToken,
    validator.plans.canCreate,
    api.plans.create
  );
  app.get("/api/plans", auth.context.requiresToken, api.plans.get);
  app.put(
    "/api/plans/:id",
    auth.context.requiresToken,
    validator.plans.update,
    api.plans.update
  );
  // app.delete(
  //   "/api/plans/delete/:id",
  //   auth.context.requiresToken,
  //   validator.plans.delete,
  //   api.plans.delete
  // );

  // ------------------------------------------question-------------------------------
  app.get(
    "/api/questins/:id",
    auth.context.requiresToken,
    validator.questions.getById,
    api.questions.getById
  );
  app.post(
    "/api/questions",
    auth.context.builder,
    auth.context.requiresToken,
    api.questions.create
  );
  app.get("/api/questions", auth.context.builder, api.questions.get);
  // app.put('/api/questions/:id', auth.context.requiresToken, validator.questions.update, api.questions.update);
  app.delete(
    "/api/questions/delete/:id",
    auth.context.requiresToken,
    validator.questions.delete,
    api.questions.delete
  );

  // ------------------------------------------event-------------------------------
  app.get(
    "/api/events/:id",
    auth.context.requiresToken,
    validator.events.getById,
    api.events.getById
  );
  app.post(
    "/api/events",
    auth.context.builder,
    auth.context.requiresToken,
    api.events.create
  );
  app.get("/api/events", auth.context.requiresToken, api.events.get);
  // app.put('/api/events/:id', auth.context.requiresToken, validator.events.update, api.events.update);
  app.delete(
    "/api/events/delete/:id",
    auth.context.requiresToken,
    validator.events.delete,
    api.events.delete
  );

  // ------------------------------------------event-------------------------------
  app.get(
    "/api/announcements/:id",
    auth.context.requiresToken,
    validator.announcements.getById,
    api.announcements.getById
  );
  app.post(
    "/api/announcements",
    auth.context.builder,
    auth.context.requiresToken,
    api.announcements.create
  );
  app.get(
    "/api/announcements",
    auth.context.requiresToken,
    api.announcements.get
  );
  // app.put('/api/events/:id', auth.context.requiresToken, validator.events.update, api.events.update);
  app.delete(
    "/api/announcements/delete/:id",
    auth.context.requiresToken,
    validator.announcements.delete,
    api.announcements.delete
  );

  // ................................report.....................................
  app.post(
    "/api/reports",
    auth.context.builder,
    auth.context.requiresToken,
    api.reports.create
  );
  app.get("/api/reports", auth.context.builder, api.reports.get);

  // .................................reason.....................................
  app.post(
    "/api/reasons",
    auth.context.builder,
    auth.context.requiresToken,
    api.reasons.create
  );
  app.get("/api/reasons", auth.context.builder, api.reasons.get);
 // .................................recommended.....................................
 app.post(
  "/api/recommended",
  auth.context.builder,
  auth.context.requiresToken,
  api.recommended.create
);
app.get("/api/recommended", auth.context.builder, api.recommended.get);

  // .................................like.....................................
  app.post(
    "/api/likes",
    auth.context.builder,
    auth.context.requiresToken,
    api.likes.create
  );
  app.get(
    "/api/likes",
    auth.context.builder,
    auth.context.requiresToken,
    api.likes.get
  );
  app.put("/api/likes/:id", auth.context.requiresToken, api.likes.update);
  //   app.put(
  //     "/api/likes/:id",
  //     auth.context.builder,
  //     auth.context.requiresToken,
  //     api.likes.update
  //   );
  app.post("/api/likes/matchPermission",auth.context.requiresToken, api.likes.matchPermission);
  // .................................block....................................
  app.post(
    "/api/blocks",
    auth.context.builder,
    auth.context.requiresToken,
    api.blocks.create
  );
  app.get(
    "/api/blocks",
    auth.context.builder,
    auth.context.requiresToken,
    api.blocks.get
  );

  // ................................payments routes......................
  app.post(
    "/api/payments/checkout",
    auth.context.builder,
    auth.context.requiresToken,
    validator.payment.canCreate,
    api.payments.create
  );
  app.post("/api/payments/pay", api.payments.payment);
  app.get(
    "/api/payments/token",
    auth.context.builder,
    auth.context.requiresToken,
    api.payments.paymentToken
  );
  app.get("/api/payments/:id",auth.context.requiresToken,api.payments.getById);
  app.put("/api/payments/:id", auth.context.requiresToken, api.payments.update);
  // .............................sendNotifications...............................

  app.post(
    "/api/pushNotification",
    auth.context.builder,
    api.pushNotification.create
  );

  log.end();
};
exports.configure = configure;
