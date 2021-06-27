const request = require("supertest");
const { app, db } = require("../app");

describe("/vaccinations", () => {
  let database;

  beforeAll(async () => {
    database = await db;
  });

  it("returns data on all the performed vaccinations", () => {
    request(app)
      .get("/vaccinations")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(7000);
      });
  });

  it("returns data on vaccinations performed on a certain day", () => {
    request(app)
      .get("/vaccinations?date=2021-03-07")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(81);
      });
  });

  afterAll(async () => {
    database.close();
  });
});
