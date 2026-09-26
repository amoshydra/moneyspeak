import { describe, expect, it } from "vitest";
import { verbalizeMoney } from "../src/index.js";

const SYMBOLS = ["$", "€", "£", "¥", "₹", "฿", "₩"];

const MATRIX: Array<[string, string]> = [
  ["en-US", "USD"],
  ["en-US", "SGD"],
  ["en-GB", "GBP"],
  ["en-IN", "INR"],
  ["en-SG", "SGD"],
  ["de-DE", "EUR"],
  ["fr-FR", "EUR"],
  ["es-ES", "EUR"],
  ["it-IT", "USD"],
  ["nl-NL", "EUR"],
  ["id-ID", "IDR"],
  ["ms-MY", "MYR"],
  ["ja-JP", "JPY"],
  ["ja-JP", "USD"],
  ["zh-CN", "CNY"],
  ["zh-TW", "TWD"],
  ["yue-HK", "HKD"],
  ["th-TH", "THB"],
  ["ta-IN", "INR"],
];

describe("invariants", () => {
  for (const [locale, currency] of MATRIX) {
    it(`${locale} ${currency} never emits a code or a symbol`, () => {
      const { spoken, strategy } = verbalizeMoney({ amount: 123.45, currency, locale });
      expect(spoken.length).toBeGreaterThan(0);
      expect(["major-minor", "decimal-name", "major-only"]).toContain(strategy);
      expect(spoken).not.toContain(currency);
      for (const symbol of SYMBOLS) expect(spoken).not.toContain(symbol);
    });
  }

  it("always keeps the digits", () => {
    const { spoken } = verbalizeMoney({ amount: 123.45, currency: "SGD", locale: "en-US" });
    expect(spoken).toContain("123");
    expect(spoken).toContain("45");
  });

  it("handles zero", () => {
    expect(verbalizeMoney({ amount: 0, currency: "USD", locale: "en-US" }).spoken).toBe("0 US dollars");
  });

  it("handles large values without losing digits", () => {
    const { spoken } = verbalizeMoney({
      amount: "123456789012345.67",
      currency: "USD",
      locale: "en-US",
    });
    expect(spoken).toContain("123456789012345");
    expect(spoken).toContain("67");
  });

  it("accepts bigint", () => {
    expect(verbalizeMoney({ amount: 123n, currency: "USD", locale: "en-US" }).spoken).toBe("123 US dollars");
  });

  it("rounds half up at the minor unit", () => {
    expect(verbalizeMoney({ amount: 2.345, currency: "USD", locale: "en-US" }).spoken).toBe(
      "2 US dollars and 35 cents",
    );
  });
});
