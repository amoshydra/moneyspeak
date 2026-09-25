import { verbalizeMoney } from "../src/index.js";
import type { VerbalizeOptions } from "../src/index.js";

const CURRENCIES = [
  "USD", "SGD", "EUR", "GBP", "JPY", "CNY", "TWD", "HKD",
  "KRW", "MYR", "IDR", "THB", "VND", "PHP", "INR", "BDT",
  "NPR", "PKR", "LKR", "KHR", "LAK", "MMK", "KWD",
];

const LOCALES = [
  "en-US", "en-GB", "en-IN", "en-SG", "en-MY", "en-PH",
  "de-DE", "fr-FR", "es-ES", "it-IT", "nl-NL",
  "id-ID", "ms-MY", "fil-PH", "th-TH", "vi-VN",
  "zh-CN", "zh-TW", "zh-HK", "yue-HK", "ja-JP", "ko-KR",
  "hi-IN", "ta-IN", "te-IN", "ml-IN", "kn-IN", "mr-IN", "gu-IN", "pa-IN",
  "bn-BD", "ne-NP", "ur-PK", "km-KH", "lo-LA", "my-MM",
];

const EXAMPLES: Array<{ locale: string; currency: string; amount: string }> = [
  // English
  { locale: "en-US", currency: "USD", amount: "123.45" },
  { locale: "en-US", currency: "SGD", amount: "123.45" },
  { locale: "en-US", currency: "USD", amount: "0.45" },
  { locale: "en-US", currency: "USD", amount: "-123.45" },
  { locale: "en-US", currency: "USD", amount: "1000000.05" },
  { locale: "en-US", currency: "JPY", amount: "123.45" },
  { locale: "en-US", currency: "KWD", amount: "123.456" },
  { locale: "en-GB", currency: "GBP", amount: "123.45" },
  { locale: "en-SG", currency: "SGD", amount: "123.45" },
  { locale: "en-MY", currency: "MYR", amount: "123.45" },
  { locale: "en-PH", currency: "PHP", amount: "123.45" },
  // Europe
  { locale: "de-DE", currency: "EUR", amount: "123.45" },
  { locale: "fr-FR", currency: "EUR", amount: "123.45" },
  { locale: "es-ES", currency: "EUR", amount: "123.45" },
  { locale: "it-IT", currency: "EUR", amount: "123.45" },
  { locale: "nl-NL", currency: "EUR", amount: "123.45" },
  // South East Asia
  { locale: "id-ID", currency: "IDR", amount: "123.45" },
  { locale: "id-ID", currency: "USD", amount: "123.45" },
  { locale: "ms-MY", currency: "MYR", amount: "123.45" },
  { locale: "fil-PH", currency: "PHP", amount: "123.45" },
  { locale: "th-TH", currency: "THB", amount: "123.45" },
  { locale: "vi-VN", currency: "USD", amount: "123.45" },
  { locale: "km-KH", currency: "KHR", amount: "123.45" },
  { locale: "lo-LA", currency: "LAK", amount: "123.45" },
  { locale: "my-MM", currency: "MMK", amount: "123.45" },
  // East Asia
  { locale: "zh-CN", currency: "CNY", amount: "123.45" },
  { locale: "zh-TW", currency: "TWD", amount: "123.45" },
  { locale: "zh-HK", currency: "HKD", amount: "123.45" },
  { locale: "yue-HK", currency: "HKD", amount: "123.45" },
  { locale: "ja-JP", currency: "JPY", amount: "123" },
  { locale: "ja-JP", currency: "USD", amount: "123.45" },
  { locale: "ja-JP", currency: "CNY", amount: "123.45" },
  { locale: "ko-KR", currency: "KRW", amount: "123" },
  { locale: "ko-KR", currency: "USD", amount: "123.45" },
  // South Asia
  { locale: "hi-IN", currency: "INR", amount: "123.45" },
  { locale: "ta-IN", currency: "INR", amount: "123.45" },
  { locale: "te-IN", currency: "INR", amount: "123.45" },
  { locale: "ml-IN", currency: "INR", amount: "123.45" },
  { locale: "kn-IN", currency: "INR", amount: "123.45" },
  { locale: "mr-IN", currency: "INR", amount: "123.45" },
  { locale: "gu-IN", currency: "INR", amount: "123.45" },
  { locale: "pa-IN", currency: "INR", amount: "123.45" },
  { locale: "bn-BD", currency: "BDT", amount: "123.45" },
  { locale: "ne-NP", currency: "NPR", amount: "123.45" },
  { locale: "ur-PK", currency: "PKR", amount: "123" },
];

function q<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`docs: missing ${selector}`);
  return el;
}

function fillSelect(select: HTMLSelectElement, values: string[], selected: string): void {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    if (value === selected) option.selected = true;
    select.append(option);
  }
}

function speak(text: string, locale: string): void {
  if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  speechSynthesis.speak(utterance);
}

/* Decimal workaround toggle ---------------------------------------------- */

const breakInput = q<HTMLInputElement>("#decimal-break");
const breakNote = q<HTMLElement>("#break-note");

const options = (): VerbalizeOptions => ({ decimalBreak: breakInput.checked ? "auto" : "none" });

function updateNote(): void {
  breakNote.textContent = breakInput.checked
    ? "workaround on: a word joiner (U+2060) is inserted before the decimal separator, so VoiceOver does not read it as an English “point”."
    : "workaround off: the plain ASCII “.” is emitted. VoiceOver on macOS/iOS reads it as an English “point”.";
}

/* Demo ------------------------------------------------------------------- */

const form = q<HTMLFormElement>("#demo-form");
const amountInput = q<HTMLInputElement>("#amount");
const currencySelect = q<HTMLSelectElement>("#currency");
const localeSelect = q<HTMLSelectElement>("#locale");
const outSpoken = q<HTMLElement>("#out-spoken");
const outDisplay = q<HTMLElement>("#out-display");
const outStrategy = q<HTMLElement>("#out-strategy");
const status = q<HTMLElement>("#demo-status");

fillSelect(currencySelect, CURRENCIES, "SGD");
fillSelect(localeSelect, LOCALES, "en-US");

let current: { spoken: string; locale: string } | null = null;

function update(): void {
  const amount = amountInput.value.trim() || "0";
  const currency = currencySelect.value;
  const locale = localeSelect.value;

  try {
    const result = verbalizeMoney({ amount, currency, locale }, options());
    outSpoken.textContent = result.spoken;
    outSpoken.lang = locale;
    outDisplay.textContent = result.display;
    outStrategy.textContent = result.strategy;
    current = { spoken: result.spoken, locale };
    status.textContent = result.warnings.length > 0 ? `Warning: ${result.warnings.join(" ")}` : "";
  } catch (error) {
    outSpoken.textContent = "n/a";
    outDisplay.textContent = "n/a";
    outStrategy.textContent = "error";
    current = null;
    status.textContent = error instanceof Error ? error.message : String(error);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
  if (current) speak(current.spoken, current.locale);
});

amountInput.addEventListener("input", update);
currencySelect.addEventListener("change", update);
localeSelect.addEventListener("change", update);
breakInput.addEventListener("change", () => {
  updateNote();
  update();
  renderExamples();
});
updateNote();
update();

/* Examples --------------------------------------------------------------- */

const examplesBody = q<HTMLTableSectionElement>("#examples-body");

function renderExamples(): void {
  examplesBody.textContent = "";

  for (const example of EXAMPLES) {
    const result = verbalizeMoney(
      { amount: example.amount, currency: example.currency, locale: example.locale },
      options(),
    );

    const row = document.createElement("tr");

    const localeCell = document.createElement("td");
    localeCell.textContent = example.locale;

    const inputCell = document.createElement("td");
    inputCell.className = "mono";
    inputCell.textContent = result.display;

    const spokenCell = document.createElement("td");
    spokenCell.lang = example.locale;
    spokenCell.textContent = result.spoken;

    const playCell = document.createElement("td");
    const play = document.createElement("button");
    play.type = "button";
    play.className = "play";
    play.textContent = "Play";
    play.setAttribute("aria-label", `Play: ${result.spoken}`);
    play.addEventListener("click", () => speak(result.spoken, example.locale));
    playCell.append(play);

    row.append(localeCell, inputCell, spokenCell, playCell);
    examplesBody.append(row);
  }
}

renderExamples();
