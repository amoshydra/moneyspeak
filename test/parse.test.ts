import { describe, expect, it } from "vitest";
import { parseMoney } from "../src/index.js";

describe("parseMoney", () => {
  it("reads an explicit currency", () => {
    expect(parseMoney("$123.45", "en-US", { currency: "USD" })).toMatchObject({
      amount: "123.45",
      currency: "USD",
    });
  });

  it("reads a three letter code from the text", () => {
    expect(parseMoney("SGD123.45", "en-SG")).toMatchObject({ amount: "123.45", currency: "SGD" });
  });

  it("reads an unambiguous symbol", () => {
    expect(parseMoney("€123,45", "de-DE")).toMatchObject({ amount: "123.45", currency: "EUR" });
    expect(parseMoney("£99", "en-GB")).toMatchObject({ amount: "99", currency: "GBP" });
  });

  it("refuses an ambiguous symbol", () => {
    expect(() => parseMoney("$123.45", "en-US")).toThrow(TypeError);
    expect(() => parseMoney("¥123", "ja-JP")).toThrow(TypeError);
  });
});
