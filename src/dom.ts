import { verbalizeMoney } from "./verbalize.js";
import { canonicalLocale } from "./derive.js";
import type { MoneyInput, VerbalizeOptions } from "./types.js";

export const SR_ONLY_CLASS = "moneyspeak-sr";

/**
 * CSS for the visually hidden spoken form. Keep the amount in one text node:
 * splitting the digits destroys the token before the synthesizer sees it.
 */
export const srOnlyCss = `.${SR_ONLY_CLASS}{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}`;

/**
 * Render a currency amount with a spoken form for assistive technology and the
 * conventional form for sighted users.
 */
export function setAccessibleMoney(el: Element, input: MoneyInput, options?: VerbalizeOptions): void {
  const doc = el.ownerDocument;
  const { spoken, display } = verbalizeMoney(input, options);

  el.textContent = "";

  const spokenEl = doc.createElement("div");
  // A block-level tag, not a span: VoiceOver honors lang on a <div> and
  // ignores it on a <span> even with display:block, so the language never
  // switches and a decimal is read with an English "point". Created via DOM,
  // so the nesting inside inline content is never reparsed by the parser.
  spokenEl.className = SR_ONLY_CLASS;
  spokenEl.lang = canonicalLocale(options?.locale ?? input.locale);
  spokenEl.dir = "auto";
  spokenEl.textContent = spoken;

  const displayEl = doc.createElement("span");
  displayEl.setAttribute("aria-hidden", "true");
  displayEl.textContent = display;

  el.append(spokenEl, displayEl);
}

/**
 * `HTMLElement` does not exist outside a browser. Guard the base so this entry
 * can be imported during server rendering without throwing.
 */
const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as unknown as typeof HTMLElement);

export class CurrencyAmountElement extends HTMLElementBase {
  static get observedAttributes(): string[] {
    return ["amount", "currency", "locale"];
  }

  connectedCallback(): void {
    this.#render();
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  #render(): void {
    const amount = this.getAttribute("amount");
    const currency = this.getAttribute("currency");
    if (!amount || !currency) return;
    try {
      setAccessibleMoney(this, {
        amount,
        currency,
        locale: this.getAttribute("locale") ?? undefined,
      });
    } catch {
      this.textContent = `${amount} ${currency}`;
    }
  }
}

export function defineCurrencyAmount(tag = "currency-amount"): void {
  if (typeof customElements !== "undefined" && !customElements.get(tag)) {
    customElements.define(tag, CurrencyAmountElement);
  }
}
