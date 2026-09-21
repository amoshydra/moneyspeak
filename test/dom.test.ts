import { describe, expect, it } from "vitest";

// These run in the Node environment, where `HTMLElement` and `customElements`
// do not exist. The entry must still import cleanly for server rendering.
describe("dom entry without a DOM", () => {
  it("imports without throwing", async () => {
    const mod = await import("../src/dom.js");
    expect(typeof mod.setAccessibleMoney).toBe("function");
    expect(typeof mod.defineCurrencyAmount).toBe("function");
    expect(typeof mod.CurrencyAmountElement).toBe("function");
    expect(typeof mod.srOnlyCss).toBe("string");
  });

  it("defineCurrencyAmount is a no-op", async () => {
    const mod = await import("../src/dom.js");
    expect(() => mod.defineCurrencyAmount()).not.toThrow();
  });
});
