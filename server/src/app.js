const express = require("express");
const sqlite = require("sqlite3").verbose();

const PORT = process.env.PORT || 3001;

const healthCheckHandler = require("./handlers/healthCheckHandler");
const { BRANDS } = require("./util/constants");
const { buildDatabase } = require("./util/dbConstructor");

let db = new sqlite.Database(":memory:", async (err) => {
  if (err) {
    return console.error("Error connecting to database:", err.message);
  }
  console.log("Connected to SQLite3 database.");
  await buildDatabase(db);
});

const app = express();

app.get("/health", healthCheckHandler);

app.get("/orders", (req, res) => {
  if (!req.query.brand || !BRANDS.includes(req.query.brand)) {
    res.status(500).send({ message: "invalid query" });
    return;
  }

  const sql = `SELECT * FROM ${req.query.brand}`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    res.status(200).send(rows);
  });
});

module.exports = {
  app,
  db,
  port: PORT,
};
