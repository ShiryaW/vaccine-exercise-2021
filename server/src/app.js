const express = require("express");

const PORT = process.env.PORT || 3001;

const healthCheckHandler = require("./handlers/healthCheckHandler");
const ordersHandler = require("./handlers/ordersHandler");
const vaccinationsHandler = require("./handlers/vaccinationsHandler");
const db = require("./util/database");

const app = express();

app.get("/health", healthCheckHandler);

app.get("/orders", ordersHandler);

app.get("/vaccinations", vaccinationsHandler);

module.exports = {
  app,
  db,
  port: PORT,
};
