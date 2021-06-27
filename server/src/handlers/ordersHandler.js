const { db } = require("../util/database");
const { BRANDS } = require("../util/constants");

module.exports = (req, res) => {
  if (!req.query.brand || !BRANDS.includes(req.query.brand)) {
    res.status(404).send({ message: "invalid query" });
    return;
  }

  let sql = `SELECT * FROM ${req.query.brand}`;

  if (req.query.before) {
    sql = `SELECT * FROM ${req.query.brand} WHERE arrived <= "${req.query.before}"`;
  } else if (req.query.date) {
    sql = `SELECT * FROM ${req.query.brand} WHERE arrived LIKE "${req.query.date}%"`;
  }

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send();
      throw err;
    }

    res.status(200).send(rows);
  });
};
