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
    // zh sets split: false, so even a currency with a known subunit is read
    // as a decimal number.
    for (const [locale, currency, name] of [
      ["zh-CN", "CNY", "人民币"],
      ["zh-TW", "CNY", "人民幣"],
      ["zh-HK", "CNY", "人民幣"],
    ] as const) {
      const result = verbalizeMoney({ amount: 123.45, currency, locale });
      expect(result.strategy).toBe("decimal-name");
      expect(result.spoken).toContain("123.");
      expect(result.spoken).toContain(name);
    }
  });

  it("reads a Japanese amount as major and minor", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "ja-JP" });
    expect(result.strategy).toBe("major-minor");
    expect(result.spoken).toContain("米ドル");
    expect(result.spoken).toContain("セント");
  });

  it("reads a Thai amount as major and minor", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "THB", locale: "th-TH" });
    expect(result.strategy).toBe("major-minor");
    expect(result.spoken).toContain("บาท");
    expect(result.spoken).toContain("สตางค์");
  });

  it("falls back to decimal-name for a currency with no known kind", () => {
    // PLN is not in the kind table, so there is no subunit word to use.
    const result = verbalizeMoney({ amount: 123.45, currency: "PLN", locale: "ja-JP" });
    expect(result.strategy).toBe("decimal-name");
    expect(result.spoken).toContain("123.45");
  });

  it("applies the id-ID name override", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "id-ID" });
    expect(result.spoken).toContain("dolar Amerika");
    expect(result.spoken).not.toContain("Amerika Serikat");
  });
});

describe("subunit resolution", () => {
  it("prefers the explicit override over the kind word", () => {
    // zh is split: false, so force the strategy to observe the subunit words
    // rather than the decimal reading. USD -> override 美分; CNY -> kind fen -> 分.
    const usd = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "zh-CN" }, { style: "major-minor" });
    expect(usd.strategy).toBe("major-minor");
    expect(usd.spoken).toContain("美分");

    const cny = verbalizeMoney({ amount: 123.45, currency: "CNY", locale: "zh-CN" }, { style: "major-minor" });
    expect(cny.strategy).toBe("major-minor");
    expect(cny.spoken).toContain("分");
  });

  it("uses the language's own word when it has one", () => {
    expect(resolveCurrency("USD", "ko-KR").subunit?.other).toBe("센트");
    expect(verbalizeMoney({ amount: 123.45, currency: "USD", locale: "ko-KR" }).spoken).toContain("센트");
  });

  it("falls back to the international name for a kind the language has no word for", () => {
    // Outside the Nordic languages and English, no language carries a word for
    // `ore`, so ko-KR SEK resolves through the kind's international name.
    expect(resolveCurrency("SEK", "ko-KR").subunit?.other).toBe("øre");
    expect(verbalizeMoney({ amount: "1.05", currency: "SEK", locale: "ko-KR" }).strategy).toBe("major-minor");
  });
});

describe("guards", () => {
  it("warns when the spoken form contains the ISO code", () => {
    const result = verbalizeMoney({ amount: 123.45, currency: "ZZZ", locale: "en-US" });
    expect(result.warnings.join(" ")).toContain("contains the ISO code");
  });

  it("uses the name, not the symbol, in a locale that renders both", () => {
    // CLDR's Turkish name format is symbol-then-name, so taking the first
    // currency part made the name "$" and the spoken form "123 $".
    expect(resolveCurrency("USD", "tr-TR").name.other).toBe("ABD doları");
    const result = verbalizeMoney({ amount: 123.45, currency: "USD", locale: "tr-TR" });
    expect(result.spoken).toContain("ABD doları");
    expect(result.spoken).not.toContain("$");
  });

  it("warns when the name embeds the code", () => {
    const result = verbalizeMoney({ amount: 123, currency: "XSU", locale: "ro-RO" });
    expect(result.warnings.join(" ")).toContain("contains the ISO code");
  });

  it("keeps every digit of a large amount in display", () => {
    const result = verbalizeMoney({ amount: "99999999999999.99", currency: "USD", locale: "en-US" });
    expect(result.spoken).toContain("99999999999999");
    expect(result.display).toBe("$99,999,999,999,999.99");
  });

  it("treats a sub-micro amount as zero rather than throwing", () => {
    expect(verbalizeMoney({ amount: 1e-7, currency: "USD", locale: "en-US" }).spoken).toBe("0 US dollars");
  });

  it("does not print a negative zero", () => {
    expect(verbalizeMoney({ amount: -0.004, currency: "USD", locale: "en-US" }).spoken).toBe("0 US dollars");
  });

  it("handles a value at the exponential threshold", () => {
    expect(verbalizeMoney({ amount: 1e21, currency: "USD", locale: "en-US" }).spoken).toContain(
      "1000000000000000000000",
    );
  });

  it("reads any value through toString, exactly", () => {
    // A decimal library value, a number, a string and a bigint all agree.
    const decimal = { toString: () => "123.45" };
    const expected = "123 US dollars and 45 cents";
    expect(verbalizeMoney({ amount: decimal, currency: "USD", locale: "en-US" }).spoken).toBe(expected);
    expect(verbalizeMoney({ amount: 123.45, currency: "USD", locale: "en-US" }).spoken).toBe(expected);
    expect(verbalizeMoney({ amount: "123.45", currency: "USD", locale: "en-US" }).spoken).toBe(expected);
  });

  it("expands exponential notation the same way for a number, a string and a bigint", () => {
    const expected = "1000000000000000000000 US dollars";
    expect(verbalizeMoney({ amount: 1e21, currency: "USD", locale: "en-US" }).spoken).toBe(expected);
    expect(verbalizeMoney({ amount: "1e21", currency: "USD", locale: "en-US" }).spoken).toBe(expected);
    expect(verbalizeMoney({ amount: 10n ** 21n, currency: "USD", locale: "en-US" }).spoken).toBe(expected);
  });
});

describe("resolveCurrency", () => {
  it("derives name, exponent and subunit", () => {
    const resolved = resolveCurrency("SGD", "en-SG");
    expect(resolved.exponent).toBe(2);
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
  it("selects the subunit plural from the minor value", () => {
    // fr/es/it have a `many` category, but it applies from 10^6 upward and the
    // minor value is below 10^exponent, so the subunit uses `one`/`other` only.
    // Assert the real output rather than a category that cannot fire.
    expect(verbalizeMoney({ amount: "1.01", currency: "EUR", locale: "fr-FR" }).spoken).toContain("1 centime");
    expect(verbalizeMoney({ amount: 2.02, currency: "EUR", locale: "fr-FR" }).spoken).toContain("centimes");
  });

  it("uses the category that matches the value, not a fixed pair", () => {
    expect(verbalizeMoney({ amount: 1, currency: "RUB", locale: "ru-RU" }).spoken).toContain("российский рубль");
    expect(verbalizeMoney({ amount: 2, currency: "RUB", locale: "ru-RU" }).spoken).toContain("российских рубля");
    expect(verbalizeMoney({ amount: 5, currency: "RUB", locale: "ru-RU" }).spoken).toContain("российских рублей");
  });

  it("handles Slavic few and many", () => {
    expect(verbalizeMoney({ amount: 5, currency: "PLN", locale: "pl-PL" }).spoken).toContain("złotych polskich");
    expect(verbalizeMoney({ amount: 5, currency: "CZK", locale: "cs-CZ" }).spoken).toContain("českých korun");
    expect(verbalizeMoney({ amount: 5, currency: "UAH", locale: "uk-UA" }).spoken).toContain("українських гривень");
  });

  it("handles a dual and a few category", () => {
    expect(verbalizeMoney({ amount: 3, currency: "EGP", locale: "ar-EG" }).spoken).toContain("جنيهات مصرية");
  });

  it("uses the singular for a decimal value where the locale puts it in one", () => {
    // French puts 1,5 in `one`, so the name is singular.
    expect(verbalizeMoney({ amount: "1.50", currency: "PLN", locale: "fr-FR" }).spoken).toContain("zloty polonais");
  });

  it("uses cents, not centimes, for the French dollar cent", () => {
    const result = verbalizeMoney({ amount: 1.05, currency: "USD", locale: "fr-FR" });
    expect(result.spoken).toContain("cents");
    expect(result.spoken).not.toContain("centimes");
  });
});

describe("decimal break", () => {
  // zh and yue keep split: false, so they take the decimal path, which is the
  // only path the workaround applies to.
  const DECIMAL_LOCALES = ["zh-CN", "zh-TW", "zh-HK", "yue-HK"];

  it("is off by default", () => {
    for (const locale of DECIMAL_LOCALES) {
      const { spoken } = verbalizeMoney({ amount: 123.45, currency: "CNY", locale });
      expect(spoken).not.toContain("\u2060");
      expect(spoken).toContain("123.");
    }
  });

  it("inserts a word joiner when enabled", () => {
    for (const locale of DECIMAL_LOCALES) {
      const { spoken } = verbalizeMoney(
        { amount: 123.45, currency: "CNY", locale },
        { decimalBreak: "auto" },
      );
      expect(spoken).toContain("123\u2060.");
    }
  });

  it("leaves the display in the conventional form", () => {
    expect(verbalizeMoney({ amount: 123.45, currency: "HKD", locale: "zh-HK" }).display).toContain("123.45");
  });

  it("never puts the word joiner in the display string", () => {
    for (const locale of ["zh-CN", "zh-TW", "zh-HK", "ja-JP", "th-TH", "ko-KR", "en-US", "de-DE"]) {
      const { display } = verbalizeMoney(
        { amount: 123.456, currency: "KWD", locale },
        { decimalBreak: "auto" },
      );
      expect(display).not.toContain("\u2060");
    }
  });

  it("does not apply to Latin-script locales even when enabled", () => {
    // PLN has no kind, so en-US takes the decimal path, and Latin scripts never
    // get a word joiner.
    expect(
      verbalizeMoney({ amount: 123.45, currency: "PLN", locale: "en-US" }, { decimalBreak: "auto" }).spoken,
    ).not.toContain("\u2060");
  });
});
