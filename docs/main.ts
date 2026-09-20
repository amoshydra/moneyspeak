import { verbalizeMoney } from "../src/index.js";

const CURRENCIES = [
  "USD", "SGD", "EUR", "GBP", "JPY", "CNY", "TWD",
  "HKD", "MYR", "IDR", "INR", "THB", "KWD",
];

const LOCALES = [
  "en-US", "en-GB", "en-IN", "en-SG", "de-DE", "fr-FR", "es-ES", "it-IT",
  "nl-NL", "id-ID", "ms-MY", "ja-JP", "zh-CN", "zh-TW", "yue-HK", "th-TH", "ta-IN",
];

const EXAMPLES: Array<{ locale: string; currency: string; amount: string }> = [
  { locale: "en-US", currency: "USD", amount: "123.45" },
  { locale: "en-US", currency: "SGD", amount: "123.45" },
  { locale: "en-GB", currency: "GBP", amount: "123.45" },
  { locale: "de-DE", currency: "EUR", amount: "123.45" },
  { locale: "fr-FR", currency: "EUR", amount: "123.45" },
  { locale: "id-ID", currency: "IDR", amount: "123.45" },
  { locale: "ta-IN", currency: "INR", amount: "123.45" },
  { locale: "ja-JP", currency: "JPY", amount: "123" },
  { locale: "ja-JP", currency: "USD", amount: "123.45" },
  { locale: "zh-CN", currency: "CNY", amount: "123.45" },
  { locale: "th-TH", currency: "THB", amount: "123.45" },
  { locale: "en-US", currency: "KWD", amount: "123.456" },
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
    const result = verbalizeMoney({ amount, currency, locale });
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
update();

/* Examples --------------------------------------------------------------- */

const examplesBody = q<HTMLTableSectionElement>("#examples-body");

for (const example of EXAMPLES) {
  const result = verbalizeMoney({
    amount: example.amount,
    currency: example.currency,
    locale: example.locale,
  });

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
