const express = require("express");

const PORT = process.env.PORT || 3001;

const healthCheckHandler = require("./handlers/healthCheckHandler");
const ordersHandler = require("./handlers/ordersHandler");
const { db } = require("./util/database");

const app = express();

app.get("/health", healthCheckHandler);

app.get("/orders", ordersHandler);

module.exports = {
  app,
  db,
  port: PORT,
};
