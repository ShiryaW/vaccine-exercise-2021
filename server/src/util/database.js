const sqlite = require("sqlite3").verbose();
const reader = require("./reader");

const { FILEPATH } = require("./constants");

let isBuilt = false;

const db = new sqlite.Database(":memory:", async (err) => {
  if (err) {
    return console.error("Error connecting to database:", err.message);
  }
  console.log("Connected to SQLite3 database.");
});

async function buildDatabase(db) {
  if (isBuilt) return;

  const antiqua = await reader.readFile(`${FILEPATH.RESOURCES}/Antiqua.source`);
  const solarBuddhica = await reader.readFile(
    `${FILEPATH.RESOURCES}/SolarBuddhica.source`
  );
  const zerpfy = await reader.readFile(`${FILEPATH.RESOURCES}/Zerpfy.source`);
  const vaccinations = await reader.readFile(
    `${FILEPATH.RESOURCES}/vaccinations.source`
  );

  if (
    antiqua.error ||
    solarBuddhica.error ||
    zerpfy.error ||
    vaccinations.error
  ) {
    console.error("Error reading database source files.");
    return;
  }

  const brands = {
    antiqua,
    solarBuddhica,
    zerpfy,
  };

  Object.keys(brands).forEach((brand) => {
    db.run(
      `CREATE TABLE ${brand}(
    id VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    orderNumber INT UNIQUE NOT NULL,
    responsiblePerson VARCHAR NOT NULL,
    healthCareDistrict VARCHAR NOT NULL,
    vaccine VARCHAR NOT NULL,
    injections INT NOT NULL,
    arrived VARCHAR NOT NULL
    )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          populateBrandTable(db, brand, brands[brand]);
        }
      }
    );
  });

  db.run(
    `CREATE TABLE vaccinations(
    vaccinationId VARCHAR NOT NULL UNIQUE PRIMARY KEY,
    sourceBottle VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    vaccinationDate VARCHAR NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        populatVaccinationsTable(db, vaccinations);
      }
    }
  );

  isBuilt = true;
}

function populateBrandTable(db, brand, contents) {
  contents.forEach((row) => {
    db.run(
      `INSERT INTO ${brand}(id, orderNumber, responsiblePerson, healthCareDistrict, vaccine, injections, arrived) 
      VALUES("${row.id}", ${row.orderNumber}, "${row.responsiblePerson}", "${row.healthCareDistrict}", "${row.vaccine}", ${row.injections}, "${row.arrived}")`
    );
  });
}

function populatVaccinationsTable(db, contents) {
  contents.forEach((row) => {
    db.run(`INSERT INTO vaccinations(vaccinationId, sourceBottle, gender, vaccinationDate) 
    VALUES("${row["vaccination-id"]}", "${row.sourceBottle}", "${row.gender}", "${row.vaccinationDate}")`);
  });
}

module.exports = {
  db: (async () => {
    await buildDatabase(db);
    return db;
  })(),
};
