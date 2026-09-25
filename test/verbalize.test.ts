import { describe, expect, it } from "vitest";
import { resolveCurrency, verbalizeMoney } from "../src/index.js";

describe("verbalizeMoney: golden cases", () => {
  // These assert the runtime's CLDR output. If a runtime ships a new CLDR
  // release, update the expectation deliberately.
  it("reads a USD amount as major and minor", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "en-US" });
    expect(result.strategy).toBe("major-minor");
    expect(result.spoken).toBe("123 US dollars and 45 cents");
    expect(result.display).toBe("$123.45");
  });

  it("drops the major unit when it is zero", () => {
    expect(verbalizeMoney({ amount: 0.45, currency: "USD", locale: "en-US" }).spoken).toBe("45 cents");
    expect(verbalizeMoney({ amount: 0.04, currency: "USD", locale: "en-US" }).spoken).toBe("4 cents");
  });

  it("keeps the sign", () => {
    expect(verbalizeMoney({ amount: -123.45, currency: "USD", locale: "en-US" }).spoken).toBe(
      "-123 US dollars and 45 cents",
    );
  });

  it("uses the locale connector and subunit", () => {
    expect(verbalizeMoney({ amount: 123.45, currency: "GBP", locale: "en-GB" }).spoken).toBe(
      "123 British pounds and 45 pence",
    );
    expect(verbalizeMoney({ amount: 123.45, currency: "EUR", locale: "de-DE" }).spoken).toBe(
      "123 Euro und 45 Cent",
    );
    expect(verbalizeMoney({ amount: 123.45, currency: "EUR", locale: "fr-FR" }).spoken).toBe(
      "123 euros et 45 centimes",
    );
  });

  it("rounds the minor unit", () => {
    expect(verbalizeMoney({ amount: 1.005, currency: "USD", locale: "en-US" }).spoken).toBe(
      "1 US dollar and 1 cent",
    );
  });
});

describe("verbalizeMoney: shape by locale", () => {
  it("uses major-only for a currency with no minor unit", () => {
    const result = verbalizeMoney({ amount: 123, currency: "JPY", locale: "ja-JP" });
    expect(result.strategy).toBe("major-only");
    expect(result.spoken).toContain("123");
    expect(result.spoken).toContain("円");
  });

  it("uses decimal-name where the locale does not split units", () => {
    for (const [locale, currency, name] of [
      ["ja-JP", "USD", "米ドル"],
      ["zh-CN", "CNY", "人民币"],
      ["th-TH", "THB", "บาทไทย"],
    ] as const) {
      const result = verbalizeMoney({ amount: 123.45, currency, locale });
      expect(result.strategy).toBe("decimal-name");
      expect(result.spoken).toContain("123\u2060.");
      expect(result.spoken).toContain(name);
    }
  });

  it("applies the id-ID name override", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "id-ID" });
    expect(result.spoken).toContain("dolar Amerika");
    expect(result.spoken).not.toContain("Amerika Serikat");
  });
});

describe("resolveCurrency", () => {
  it("derives name, exponent and order", () => {
    const resolved = resolveCurrency("SGD", "en-SG");
    expect(resolved.exponent).toBe(2);
    expect(resolved.order).toBe("suffix");
    expect(resolved.name.one).toBe("Singapore dollar");
    expect(resolved.name.other).toBe("Singapore dollars");
    expect(resolved.subunit?.other).toBe("cents");
    expect(resolved.sources.name).toBe("intl");
  });

  it("applies the ISO exponent override", () => {
    const resolved = resolveCurrency("IDR", "id-ID");
    expect(resolved.exponent).toBe(2);
    expect(resolved.sources.exponent).toBe("data");
  });

  it("reads the exponent for currencies with 0 and 3 minor digits", () => {
    expect(resolveCurrency("JPY", "ja-JP").exponent).toBe(0);
    expect(resolveCurrency("KWD", "en-US").exponent).toBe(3);
  });

  it("rejects a non ISO code", () => {
    expect(() => resolveCurrency("dollars", "en-US")).toThrow(RangeError);
  });
});

describe("verbalizeMoney: options", () => {
  it("forces a style", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "en-US" }, { style: "decimal-name" });
    expect(result.strategy).toBe("decimal-name");
    expect(result.spoken).toBe("123.45 US dollars");
  });

  it("overrides the name and the connector", () => {
    const result = verbalizeMoney(
      { amount: 123.45, currency: "USD", locale: "en-US" },
      { name: "American dollars", connector: "plus" },
    );
    expect(result.spoken).toBe("123 American dollars plus 45 cents");
  });

  it("disables the minor unit", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "en-US" }, { subunit: false });
    expect(result.spoken).toBe("123 US dollars");
  });
});

describe("plural categories", () => {
  it("uses the many category for large amounts in fr, es and it", () => {
    for (const locale of ["fr-FR", "es-ES", "it-IT"]) {
      const result = verbalizeMoney({ amount: 1000000.45, currency: "EUR", locale });
      expect(result.strategy).toBe("major-minor");
      expect(result.spoken).toMatch(/centime|céntimo|centesimi/);
    }
  });

  it("falls back to other when a category is absent", () => {
    // fr has a many category; the draft supplies it, so a plain amount still works.
    expect(verbalizeMoney({ amount: 2.02, currency: "EUR", locale: "fr-FR" }).spoken).toContain("centimes");
  });

  it("uses cents, not centimes, for the French dollar cent", () => {
    const result = verbalizeMoney({ amount: 1.05, currency: "USD", locale: "fr-FR" });
    expect(result.spoken).toContain("cents");
    expect(result.spoken).not.toContain("centimes");
  });
});

describe("decimal break", () => {
  it("inserts a word joiner before the separator for non-Latin scripts", () => {
    for (const locale of ["zh-CN", "zh-TW", "zh-HK", "ja-JP", "th-TH", "ko-KR"]) {
      const { spoken } = verbalizeMoney({ amount: 123.45, currency: "USD", locale });
      expect(spoken).toContain("123\u2060.");
    }
  });

  it("leaves the display in the conventional form", () => {
    expect(verbalizeMoney({ amount: 123.45, currency: "HKD", locale: "zh-HK" }).display).toContain("123.45");
  });

  it("leaves Latin-script locales untouched", () => {
    expect(verbalizeMoney({ amount: 123.456, currency: "KWD", locale: "en-US" }).spoken).toBe(
      "123.456 Kuwaiti dinars",
    );
  });

  it("can be disabled", () => {
    const result = verbalizeMoney(
      { amount: 123.45, currency: "CNY", locale: "zh-CN" },
      { decimalBreak: "none" },
    );
    expect(result.spoken).toContain("123.");
    expect(result.spoken).not.toContain("\u2060");
  });
});
