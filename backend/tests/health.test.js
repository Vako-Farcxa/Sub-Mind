const request = require("supertest");
const { app } = require("../src/app");

describe("health endpoint", () => {
  it("returns the API health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        service: "sub-mind-api",
        status: "ok",
        timestamp: expect.any(String),
      },
    });
  });
});
