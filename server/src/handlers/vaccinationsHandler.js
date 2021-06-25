const { db } = require("../util/database");

module.exports = (_, res) => {
  const sql = `SELECT * FROM vaccinations`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send();
      throw err;
    }

    res.status(200).send(rows);
  });
};
