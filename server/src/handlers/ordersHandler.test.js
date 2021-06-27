const request = require("supertest");
const { app, db } = require("../app");

describe("/orders", () => {
  let database;

  beforeAll(async () => {
    database = await db;
  });

  it("Returns the contents of the respective table when queried", () => {
    request(app)
      .get("/orders?brand=antiqua")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1661);
      });
  });

  it("Returns orders from manufacturer x that arrived on date y", () => {
    request(app)
      .get("/orders?brand=antiqua&date=2021-03-07")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(13);
      });
  });

  it("Returns orders from manufacturer x that arrived prior to day y", () => {
    request(app)
      .get("/orders?brand=antiqua&before=2021-03-07")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1042);
      });
  });

  it("Returns 404 when the table does not exist", () => {
    request(app)
      .get("/orders?brand=nonexistent")
      .expect((res) => {
        expect(res.status).toBe(404);
      });
  });

  afterAll(async () => {
    database.close();
  });
});
