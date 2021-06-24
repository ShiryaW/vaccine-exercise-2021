const { db } = require("../util/database");
const { BRANDS } = require("../util/constants");

module.exports = (req, res) => {
  if (!req.query.brand || !BRANDS.includes(req.query.brand)) {
    res.status(404).send({ message: "invalid query" });
    return;
  }

  const sql = `SELECT * FROM ${req.query.brand}`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    res.status(200).send(rows);
  });
};
