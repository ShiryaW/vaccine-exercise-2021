const request = require("supertest");

describe("Health check", () => {
  it("Responds 200 OK", async () => {
    const { app } = require("../app");

    await request(app)
      .get("/health")
      .expect((res) => {
        expect(res.status).toBe(200);
      });
  });
});
