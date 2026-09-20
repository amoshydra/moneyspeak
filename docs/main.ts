import { resolveCurrency, verbalizeMoney, parseMoney } from "../src/index.js";
import { setAccessibleMoney, defineCurrencyAmount, srOnlyCss } from "../src/dom.js";

/* The visually hidden class the DOM helpers expect. Injected once, page-wide. */
const styleTag = document.createElement("style");
styleTag.textContent = srOnlyCss;
document.head.append(styleTag);

/* Register <currency-amount>; the element on the page upgrades itself. */
defineCurrencyAmount();

/** Query a required element, failing loudly if the markup and script drift. */
function q<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`docs: missing required element ${selector}`);
  return el;
}

/* ----------------------------------------------------------------------- */
/* Live demo                                                               */
/* ----------------------------------------------------------------------- */

const demoForm = q<HTMLFormElement>("#demo-form");
const amountInput = q<HTMLInputElement>("#amount");
const currencySelect = q<HTMLSelectElement>("#currency");
const localeSelect = q<HTMLSelectElement>("#locale");
const demoStatus = q<HTMLParagraphElement>("#demo-status");

const outStrategy = q<HTMLElement>("#out-strategy");
const outSpoken = q<HTMLElement>("#out-spoken");
const outDisplay = q<HTMLElement>("#out-display");
const outName = q<HTMLElement>("#out-name");
const outExponent = q<HTMLElement>("#out-exponent");
const outSubunit = q<HTMLElement>("#out-subunit");
const outSources = q<HTMLElement>("#out-sources");

let lastSpoken = "";

function updateDemo(): void {
  const amount = amountInput.value.trim() || "0";
  const currency = currencySelect.value;
  const locale = localeSelect.value;

  try {
    const resolved = resolveCurrency(currency, locale);
    const result = verbalizeMoney({ amount, currency, locale });
    lastSpoken = result.spoken;

    outStrategy.textContent = result.strategy;
    outSpoken.textContent = result.spoken;
    outDisplay.textContent = result.display;
    outName.textContent = `${resolved.name.one ?? resolved.name.other} / ${resolved.name.other}`;
    outExponent.textContent = String(resolved.exponent);
    outSubunit.textContent = resolved.subunit
      ? `${resolved.subunit.one ?? resolved.subunit.other} / ${resolved.subunit.other}`
      : "none (no minor unit)";
    outSources.textContent = Object.entries(resolved.sources)
      .map(([key, source]) => `${key}: ${source}`)
      .join(", ");

    const warnings = result.warnings.length > 0 ? ` Warning: ${result.warnings.join(" ")}` : "";
    demoStatus.textContent = `${result.spoken}. Strategy: ${result.strategy}.${warnings}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    lastSpoken = "";
    demoStatus.textContent = `Could not resolve ${currency}: ${message}`;
    outStrategy.textContent = "error";
    outSpoken.textContent = message;
    outDisplay.textContent = "—";
    outName.textContent = "—";
    outExponent.textContent = "—";
    outSubunit.textContent = "—";
    outSources.textContent = "—";
  }
}

function speak(text: string): void {
  if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
    demoStatus.textContent = "Speech synthesis is not available in this browser.";
    return;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

demoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateDemo();
  if (lastSpoken) speak(lastSpoken);
});

amountInput.addEventListener("input", updateDemo);
currencySelect.addEventListener("change", updateDemo);
localeSelect.addEventListener("change", updateDemo);

updateDemo();

/* ----------------------------------------------------------------------- */
/* parseMoney demo                                                         */
/* ----------------------------------------------------------------------- */

const parseForm = q<HTMLFormElement>("#parse-form");
const parseInput = q<HTMLInputElement>("#parse-input");
const parseStatus = q<HTMLParagraphElement>("#parse-status");

parseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = parseInput.value.trim();
  if (text === "") {
    parseStatus.textContent = "Type an amount to parse.";
    return;
  }
  try {
    const parsed = parseMoney(text, localeSelect.value);
    const warnings = parsed.warnings.length > 0 ? ` Warning: ${parsed.warnings.join(" ")}` : "";
    parseStatus.textContent = `amount ${parsed.amount}, currency ${parsed.currency}, locale ${parsed.locale}.${warnings}`;
  } catch (error) {
    parseStatus.textContent = error instanceof Error ? error.message : String(error);
  }
});

/* ----------------------------------------------------------------------- */
/* Accessibility examples                                                  */
/* ----------------------------------------------------------------------- */

setAccessibleMoney(q<HTMLElement>("#accessible-set"), {
  amount: "123.45",
  currency: "SGD",
  locale: "en-SG",
});
