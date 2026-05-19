const request = require("supertest");
const { app } = require("../src/app");

describe("auth routes", () => {
  it("requires authentication for the current user endpoint", async () => {
    const response = await request(app).get("/api/auth/me").expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: "Authentication required",
    });
  });

  it("clears auth cookies during logout", async () => {
    const response = await request(app).post("/api/auth/logout").expect(200);

    expect(response.body).toEqual({
      success: true,
      data: { loggedOut: true },
    });
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("accessToken=;"),
        expect.stringContaining("refreshToken=;"),
      ]),
    );
  });

});
