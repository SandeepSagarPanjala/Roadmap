import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app.js"; // Import the Express App (without starting the server!)

describe("App Health Check", () => {
  it("GET / should return WELCOME TO NODE API", async () => {
    // Supertest simulates the HTTP request entirely in-memory!
    const response = await request(app).get("/");
    
    // Vitest assertions
    expect(response.status).toBe(200);
    expect(response.text).toBe("WELCOME TO NODE API");
  });

  it("GET /non-existent-route should return 404 JSON", async () => {
    const response = await request(app).get("/does-not-exist");
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Route Not Found: /does-not-exist");
    expect(response.body.success).toBe(false);
  });
});
