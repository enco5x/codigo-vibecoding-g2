import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("true should be true", () => {
    expect(true).toBe(true);
  });

  it("1 + 1 should equal 2", () => {
    expect(1 + 1).toBe(2);
  });
});
