"use strict";

global.Promise = require("bluebird");

const express = require("express");
const morgan = require("morgan");
const appConfig = require("config").get("app");
const webConfig = require("config").get("webServer");

const logger = require("@open-age/logger")("server");
const port = process.env.PORT || appConfig.port || 3000;
const Http = require("http");

const app = express();
var server = Http.createServer(app);

const bodyParser = require("body-parser");

app.use(
  bodyParser.json({
    limit: "70mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "70mb",
    extended: true,
    parameterLimit: 70000,
  })
);

app.get("/mrandmrs/terms-and-conditions", (req, res) => {
  res.sendFile(__dirname + "/helpers/termsAndConditions.html");
});

require("./communication/chat.js").sockets(server);

const boot = () => {
  const log = logger.start("app:boot");
  log.info(`environment:  ${process.env.NODE_ENV}`);
  log.info("starting server ...");

  server.listen(port, () => {
    console.log(`listening on port: ${port}`);
    log.end();
  });
};

const init = () => {
  require("./settings/database").configure(logger);
  require("./settings/express").configure(app, logger);
  require("./settings/routes").configure(app, logger);

  require('./jobs/plan').schedule()

  app.get("/chat", function (req, res) {
    res.sendFile(__dirname + "/templates/index.html");
  });

  boot();
};

app.use(morgan("dev"));
init();