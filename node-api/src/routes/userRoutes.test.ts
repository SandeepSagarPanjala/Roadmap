import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../app.js";

describe("Users Routes & Protected Endpoints", () => {
  let validAccessToken: string;

  // We need a valid token to test protected routes successfully
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "sandeep", password: "test1234" });
    
    validAccessToken = loginRes.body.accessToken;
  });

  it("GET /api/users should return 401 without an Authorization header", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access Token is missing");
  });

  it("GET /api/users should return 401 with an intentionally invalid token", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", "Bearer faketoken123");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access Token is invalid or expired");
  });

  it("GET /api/users should return 200 and an array of users with a valid token", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${validAccessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // password should be omitted based on our userService logic
    expect(res.body[0].password).toBeUndefined();
  });

  it("POST /api/users/add should return 400 for short password (Joi Validation)", async () => {
    const res = await request(app)
      .post("/api/users/add")
      .send({ name: "Bob", username: "bob", password: "123" }); // password < 6 chars

    expect(res.status).toBe(400);
    expect(res.text).toContain('"password" length must be at least 6 characters long');
  });

  it("POST /api/users/add should return 201 when fully valid", async () => {
    const res = await request(app)
      .post("/api/users/add")
      .send({ name: "Bob", username: "bob", password: "securepassword" });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe("bob");
    expect(res.body.password).toBeUndefined(); // Should omit the hashed password when returning the new user
  });
});
