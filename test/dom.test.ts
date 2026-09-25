import { describe, expect, it } from "vitest";
import { setAccessibleMoney } from "../src/dom.js";

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

interface FakeChild {
  tag?: string;
  className?: string;
  lang?: string;
  dir?: string;
  textContent?: string;
  attrs: Record<string, string>;
  setAttribute(name: string, value: string): void;
}

function fakeElement(): { el: Element; children: FakeChild[] } {
  const children: FakeChild[] = [];
  const el = {
    ownerDocument: {
      createElement: (tag: string) => {
        const child: FakeChild = {
          tag,
          attrs: {},
          setAttribute(name, value) {
            child.attrs[name] = value;
          },
        };
        children.push(child);
        return child;
      },
    },
    textContent: "old",
    append: () => {},
  };
  return { el: el as unknown as Element, children };
}

describe("setAccessibleMoney", () => {
  it("tags the spoken span with the language", () => {
    const { el, children } = fakeElement();
    setAccessibleMoney(el, { amount: 123.45, currency: "SGD", locale: "en-SG" });

    expect(children[0]?.tag).toBe("div");
    expect(children[0]?.className).toBe("moneyspeak-sr");
    expect(children[0]?.lang).toBe("en-SG");
    expect(children[0]?.dir).toBe("auto");
    expect(children[0]?.textContent).toContain("Singapore dollars");

    expect(children[1]?.attrs["aria-hidden"]).toBe("true");
  });

  it("canonicalizes the locale", () => {
    const { el, children } = fakeElement();
    setAccessibleMoney(el, { amount: 1, currency: "USD", locale: "en-us" });
    expect(children[0]?.lang).toBe("en-US");
  });
});
