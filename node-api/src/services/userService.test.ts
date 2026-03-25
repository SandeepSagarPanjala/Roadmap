import "dotenv/config";
import { describe, it, expect } from "vitest";
import * as userService from "./userService.js";

describe("userService", () => {
  it("getUserByUsername should perfectly return the target user object", () => {
    const user = userService.getUserByUsername("sandeep");
    expect(user).toBeDefined();
    expect(user?.name).toBe("Sandeep");
    // Unit tests interact directly with the mock array, so password hash is included here
    expect(user?.password).toBeDefined(); 
  });

  it("getUserById should drop the password field when returning public object", () => {
    const user = userService.getUserById(1);
    expect(user).toBeDefined();
    expect(user?.username).toBe("sandeep");
    expect((user as any)?.password).toBeUndefined(); 
  });
});
