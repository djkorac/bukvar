import { describe, expect, it } from "vitest";
import { isActive } from "./nav-active";

describe("isActive", () => {
  it("matches the section's own page", () => {
    expect(isActive("/words", "/words")).toBe(true);
  });

  it("matches detail pages beneath the section", () => {
    expect(isActive("/words/zdravo", "/words")).toBe(true);
    expect(isActive("/grammar/gender", "/grammar")).toBe(true);
  });

  it("ignores trailing slashes on either side", () => {
    expect(isActive("/words/", "/words")).toBe(true);
    expect(isActive("/words/zdravo/", "/words")).toBe(true);
  });

  it("does not match a sibling that merely shares a prefix", () => {
    expect(isActive("/words", "/word")).toBe(false);
    expect(isActive("/grammar-notes", "/grammar")).toBe(false);
  });

  it("does not match unrelated sections", () => {
    expect(isActive("/levels", "/words")).toBe(false);
  });

  it("treats the root as exact-only so it isn't active everywhere", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/words", "/")).toBe(false);
  });
});
