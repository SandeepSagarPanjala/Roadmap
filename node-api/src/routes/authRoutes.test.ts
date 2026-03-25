import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app.js";

describe("Authentication Routes & Validation", () => {
  it("POST /api/auth/login should return 200 and tokens for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "sandeep", password: "test1234" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    
    // Check if the Refresh Token cookie (jwt) is set and HttpOnly
    const setCookieHeader = res.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/jwt=.*; HttpOnly/);
  });

  it("POST /api/auth/login should return 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "sandeep", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("POST /api/auth/login should return 400 for missing fields (Joi Validation)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "sandeep" }); // password missing!

    expect(res.status).toBe(400);
    expect(res.text).toContain('"password" is required');
  });

  it("POST /api/auth/refresh should return 401 if missing cookie", async () => {
    const res = await request(app).post("/api/auth/refresh");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Refresh Token Cookie is missing");
  });

  it("POST /api/auth/logout should always return 200", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});
