const { it, expect } = require("@jest/globals");
const request = require("supertest");

describe("/orders", () => {
  it("Returns the contents of the respective table when queried", async () => {
    const { app } = require("../app");

    await request(app)
      .get("/orders?brand=antiqua")
      .expect((res) => {
        expect(res.status).toBe(200);
      });
  });
});
