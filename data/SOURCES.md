# Subunit name verification

Verification of every entry in `data/subunits.json` against outside sources.
Checked 2026-09-21.

> **Model change (2026-09-26).** Subunits are now stored by *kind*, not by
> currency. `data/subunit-kinds.json` maps each currency to a kind (`USD`, `AUD`,
> `SGD`, ... -> `cent`; `EUR` -> `eurocent`; `GBP` -> `penny`), and
> `data/subunits.json` holds the word per language and kind. One word therefore
> serves every currency that shares the kind, and a currency added to a known
> kind inherits its words. The per-currency evidence below is unchanged and is
> still the source for each word; the few per-language exceptions (the `zh` US
> cent `美分`, the `ta` SGD cent `காசு`) moved to `data/overrides.json`.

Method and caveats:

- ISO 4217 defines only the *number of minor-unit decimal digits*. It does **not**
  define subunit names, so it is cited only for digit counts (the `null` entries),
  never as evidence of a word.
- For each currency I preferred the central bank / monetary authority or the
  country's Wikipedia article (which cites the issuing law), then a dictionary for
  the localized spelling.
- The "source URL" column lists the page I actually fetched. Where a spelling is
  only attested in a general dictionary rather than by the issuer, the note says so.
- `verdict` is one of: **confirmed**, **doubtful**, **wrong**, **no source**.

## Verdicts by currency

| currency | language | draft value | verdict | source URL | note |
| --- | --- | --- | --- | --- | --- |
| USD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/United_States_dollar | USD = 100 cents (Coinage Act 1792). |
| USD | de | one `Cent`, other `Cent` | confirmed | https://www.duden.de/rechtschreibung/Cent | Duden: "Untereinheit des Euro und der Währungseinheiten verschiedener Länder (z. B. der USA)"; 5 Cent. |
| USD | fr | one `cent`, many `centimes`, other `centimes` | wrong | https://en.wiktionary.org/wiki/cent | Singular `cent` is right for a dollar (Wiktionary: "French: cent m (of dollar)"), but the plural of `cent` is `cents`, not `centimes`. `centime` is the *euro* cent (and the old franc). See corrections. |
| USD | es | one `centavo`, many `centavos`, other `centavos` | confirmed | https://dle.rae.es/centavo | RAE: `centavo` = "moneda que vale la centésima parte de la unidad monetaria". |
| USD | it | one `centesimo`, many `centesimi`, other `centesimi` | confirmed | https://en.wiktionary.org/wiki/cent | Wiktionary translates "cent" (subunit) into Italian as `centesimo`. |
| USD | nl | one `cent`, other `cent` | confirmed | https://en.wiktionary.org/wiki/cent | Dutch `cent` (m). |
| USD | id | one `sen`, other `sen` | confirmed | https://en.wiktionary.org/wiki/sen | Indonesian `sen` < Dutch `cent`; "unit of Indonesian currency worth 1/100 rupiah". |
| USD | ms | one `sen`, other `sen` | confirmed | https://en.wiktionary.org/wiki/cent | Wiktionary: "Malay: sen". |
| USD | zh | one `分`, other `分` | confirmed | https://en.wiktionary.org/wiki/cent | Mandarin renders "cent" as 分 (fēn). Note: in money contexts 美分 is the usual disambiguated form. |
| USD | ja | one `セント`, other `セント` | confirmed | https://en.wiktionary.org/wiki/cent | Japanese `セント` (sento). |
| USD | th | one `เซ็นต์`, other `เซ็นต์` | confirmed | https://en.wiktionary.org/wiki/cent | Thai `เซ็นต์` (sen). |
| USD | ta | one `சென்ட்`, other `சென்ட்` | doubtful | https://en.glosbe.com/en/ta/Cent | `சென்ட்` appears only in Glosbe (a translation aggregator); the Tamil Virtual University dictionary entry for "cent" (via ta.wiktionary) gives `சதம்`, not `சென்ட்`. See corrections. |
| EUR | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/Language_and_the_euro | EUR = 100 cents. |
| EUR | de | one `Cent`, other `Cent` | confirmed | https://en.wikipedia.org/wiki/Language_and_the_euro | German `Cent`, plural `Cent` after a numeral. |
| EUR | fr | one `centime`, many `centimes`, other `centimes` | confirmed | https://en.wikipedia.org/wiki/Language_and_the_euro | "In France, the word centime is far more common than cent and is recommended by the Académie française." |
| EUR | es | one `céntimo`, many `céntimos`, other `céntimos` | confirmed | https://en.wikipedia.org/wiki/Language_and_the_euro | Spanish `céntimo`. |
| EUR | it | one `centesimo`, many `centesimi`, other `centesimi` | confirmed | https://en.wikipedia.org/wiki/Language_and_the_euro | Italian `centesimo`. |
| EUR | nl | one `cent`, other `cent` | confirmed | https://en.wikipedia.org/wiki/Language_and_the_euro | Dutch `cent`, normally uninflected. |
| GBP | en | one `penny`, other `pence` | confirmed | https://en.wikipedia.org/wiki/Pound_sterling | "each pound has been divided into 100 pence (singular is 'penny')". |
| JPY | (none) | `null` | confirmed | https://en.wikipedia.org/wiki/Japanese_yen | Correct to leave unset: the yen has no subunit in use (the pre-war `sen`/`rin` are long abolished; ISO 4217 gives 0 digits). |
| CNY | zh | one `分`, other `分` | confirmed | https://en.wikipedia.org/wiki/Renminbi | 1 yuan = 10 jiao (角) = 100 fen (分); fen coins rarely used. |
| CNY | en | one `fen`, other `fen` | confirmed | https://en.wikipedia.org/wiki/Renminbi | English transliteration `fen`. |
| TWD | zh | one `分`, other `分` | confirmed | https://en.wikipedia.org/wiki/New_Taiwan_dollar | 1 dollar = 10 jiao (角) = 100 fen (分); neither used in practice. |
| TWD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/New_Taiwan_dollar | The article's terminology table lists English "cent" for the 1/100 unit. |
| HKD | zh | one `分`, other `分` | confirmed | https://en.wikipedia.org/wiki/Hong_Kong_dollar | 1/100 = 仙 ("sin", "xiān", or "fen"); 分 is an accepted spelling. |
| HKD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/Hong_Kong_dollar | "Each dollar is divided into 100 cents (or fen)." |
| SGD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/Singapore_dollar | Each dollar = 100 cents. |
| SGD | zh | one `分`, other `分` | confirmed | https://en.wikipedia.org/wiki/Singapore_dollar | Chinese `分` (fēn). |
| SGD | ms | one `sen`, other `sen` | confirmed | https://en.wikipedia.org/wiki/Singapore_dollar | Malay `sen`. |
| SGD | ta | one `சென்ட்`, other `சென்ட்` | doubtful | https://en.wikipedia.org/wiki/Singapore_dollar | Wikipedia gives the Tamil term for the SGD cent as `காசு` (kācu), not the transliteration `சென்ட்`. No MAS Tamil source found either way. See corrections. |
| MYR | en | one `sen`, other `sen` | confirmed | https://en.wikipedia.org/wiki/Malaysian_ringgit | Since 1975 `ringgit` and `sen` are the only official names, in English as well; the article says it is "divided into 100 cents (Malay: sen)" but the official English subunit name is `sen`. |
| MYR | ms | one `sen`, other `sen` | confirmed | https://en.wikipedia.org/wiki/Malaysian_ringgit | Malay `sen`. |
| IDR | id | one `sen`, other `sen` | confirmed | https://en.wikipedia.org/wiki/Indonesian_rupiah | "One rupiah is legally divided into 100 sen", though only whole-rupiah denominations are issued. |
| IDR | en | one `sen`, other `sen` | confirmed | https://en.wikipedia.org/wiki/Indonesian_rupiah | Indonesian infobox and prose use `sen` in English. |
| INR | en | one `paisa`, other `paise` | confirmed | https://en.wikipedia.org/wiki/Indian_rupee | "subdivided into 100 paise (singular: paisa)". |
| INR | ta | one `பைசா`, other `பைசா` | confirmed | https://ta.wikipedia.org/wiki/%E0%AE%AA%E0%AF%88%E0%AE%9A%E0%AE%BE | Tamil Wikipedia: `பைசா` is 1/100 of the rupee (no singular/plural distinction in Tamil). |
| THB | th | one `สตางค์`, other `สตางค์` | confirmed | https://en.wikipedia.org/wiki/Thai_baht | "divided into 100 satang (สตางค์)". |
| THB | en | one `satang`, other `satang` | confirmed | https://en.wikipedia.org/wiki/Thai_baht | English transliteration `satang`. |
| KRW | (none) | `null` | confirmed | https://en.wikipedia.org/wiki/South_Korean_won | Correct to leave unset: the won is "technically divided into 100 jeon" but jeon is not used in transactions (ISO 4217 gives 0 digits). |
| VND | (none) | `null` | confirmed | https://en.wikipedia.org/wiki/Vietnamese_%C4%91%E1%BB%93ng | Correct to leave unset: the historical subunits `hào` (1/10) and `xu` (1/100) are obsolete (ISO 4217 gives 0 digits). |
| AUD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/Australian_dollar | "Each dollar is subdivided into 100 cents." |
| CAD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/Canadian_dollar | Each dollar = 100 cents. |
| CAD | fr | one `cent`, many `cents`, other `cents` | confirmed | https://en.wikipedia.org/wiki/Canadian_dollar | French `cent`/`cents` is the subunit; the article lists `sou`/`sous` only as a French nickname. Note `cinq cents` is ambiguous with "500" outside money context. |
| NZD | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/New_Zealand_dollar | "each divided into 100 cents". |
| CHF | de | one `Rappen`, other `Rappen` | confirmed | https://en.wikipedia.org/wiki/Swiss_franc | SNB subunit name: Rappen (Rp.). |
| CHF | fr | one `centime`, many `centimes`, other `centimes` | confirmed | https://en.wikipedia.org/wiki/Swiss_franc | Subunit name: centime (c.). |
| CHF | it | one `centesimo`, many `centesimi`, other `centesimi` | confirmed | https://en.wikipedia.org/wiki/Swiss_franc | Subunit name: centesimo (ct.). |
| CHF | en | one `centime`, other `centimes` | confirmed | https://en.wikipedia.org/wiki/Coins_of_the_Swiss_franc | "The name of the subunit is centime in French and internationally", per the Federal Chancellery style guide. |
| ZAR | en | one `cent`, other `cents` | confirmed | https://en.wikipedia.org/wiki/South_African_rand | "subdivided into 100 cents". |
| PHP | en | one `centavo`, other `centavos` | confirmed | https://en.wikipedia.org/wiki/Philippine_peso | "subdivided into 100 sentimo, also called centavos"; `centavo` is the English term. |
| SEK | sv | one `öre`, other `öre` | confirmed | https://en.wikipedia.org/wiki/Swedish_krona | 1 krona = 100 öre (coins discontinued 2010, but öre is the subunit). |
| SEK | en | one `öre`, other `öre` | confirmed | https://en.wikipedia.org/wiki/Swedish_krona | Same word used in English. |
| NOK | nb | one `øre`, other `øre` | confirmed | https://en.wikipedia.org/wiki/Norwegian_krone | 1 krone = 100 øre. |
| NOK | en | one `øre`, other `øre` | confirmed | https://en.wikipedia.org/wiki/Norwegian_krone | Same word used in English. |
| DKK | da | one `øre`, other `øre` | confirmed | https://en.wikipedia.org/wiki/Danish_krone | 1 krone = 100 øre (singular and plural). |
| DKK | en | one `øre`, other `øre` | confirmed | https://en.wikipedia.org/wiki/Danish_krone | Same word used in English. |

## Proposed corrections

Status: all three applied to `data/subunits.json` on 2026-09-21. The two Tamil
entries remain uncertain; they use the better-sourced native form rather than the
transliteration.

1. **`USD.fr` — wrong plural.** Draft: `{ one: "cent", many: "centimes", other: "centimes" }`.
   Change the plural forms to `cents`:
   `{ one: "cent", other: "cents" }`.
   Why: the French word for a dollar cent is `cent` (Wiktionary lists "French: cent m (of dollar)"), and
   its plural is `cents`. `centime` is the *euro* cent (and the old franc cent), not the dollar cent.
   Source: https://en.wiktionary.org/wiki/cent, https://en.wikipedia.org/wiki/Language_and_the_euro.

2. **`SGD.ta` — doubtful spelling.** Draft `சென்ட்`. The Singapore dollar's Tamil term for the cent is
   given as `காசு` (kācu) by Wikipedia; `சென்ட்` is a transliteration of English "cent".
   Recommend `காசு` if a native Tamil term is wanted, otherwise leave `சென்ட்` but treat as unverified.
   Source: https://en.wikipedia.org/wiki/Singapore_dollar. (No MAS Tamil page found, so this is a
   recommendation, not a certainty.)

3. **`USD.ta` — doubtful spelling.** Draft `சென்ட்`. The Tamil Virtual University dictionary entry for
   "cent" gives the native word `சதம்`; `சென்ட்` is only attested by Glosbe (a translation aggregator)
   and is the common transliteration. Recommend `சதம்` for the native term, or keep `சென்ட்` with the
   caveat that no authoritative lexical source was found.
   Sources: https://ta.wiktionary.org/wiki/cent, https://en.glosbe.com/en/ta/Cent.

No other entry needs to change. All remaining claims about both the subunit and the localized spelling
checked out against the sources above.

## Coverage notes (not errors)

These are subunits that exist but are absent from the file; the present entries are not wrong, just
incomplete. Flagging only, since the task was to verify claims:

- **CNY / TWD**: the 1/10 subunit `角` / `jiao` is missing (1/100 `分` / `fen` is present).
- **USD**: the 1/10 `dime` and the 1/1000 `mill` are missing.
- **HKD**: the 1/10 `毫`/`háo` is missing; the 1/100 is written `仙` in Cantonese usage.
- **PHP**: the Filipino name `sentimo` is missing (`centavo` is present).
- **CHF**: the Romansh `rap` is missing.
- **SGD**: the Tamil form is the only doubtful one; `en`, `zh`, `ms` are fine.

## Japanese and Thai split readings (2026-09-26)

`ja` and `th` changed from `split: false` to `split: true` in `data/overrides.json`,
so a fraction now reads as major + subunit (e.g. 123米ドル45セント) instead of the
decimal number reading. That requires a settled subunit word per currency. The
`th` words were already present and confirmed; the `ja` words below were added.
Japanese has no grammatical plural, so `one` and `other` are equal except for GBP,
where the dictionary records both forms. CLDR's `ja` plural rule has only the
`other` category, so the runtime currently emits `ペンス` for every count, including
1 (the `ペニー` value is recorded for completeness and for a future plural strategy).

| currency | language | value | verdict | source URL | note |
| --- | --- | --- | --- | --- | --- |
| USD | ja | one `セント`, other `セント` | confirmed | https://ja.wikipedia.org/wiki/アメリカ合衆国ドル | "補助通貨は、セント（記号は、¢またはc）で、1ドル = 100セント". The existing entry was correct; this adds a Japanese-language source. Also https://ja.wikipedia.org/wiki/セント_(通貨). |
| EUR | ja | one `セント`, other `セント` | confirmed | https://ja.wikipedia.org/wiki/ユーロ | "補助単位はセントで、1ユーロは100セントに相当する。またユーロの補助単位としてのセントを特に別の通貨の補助単位としてのセントと区別するときにはユーロセントと呼び". `セント` is the unit; `ユーロセント` is the disambiguated variant. |
| GBP | ja | one `ペニー`, other `ペンス` | confirmed | https://ja.wikipedia.org/wiki/スターリング・ポンド | "補助単位はペニー (penny/複数形: ペンス = pence) で、1971年より1ポンドは100ペンスである". Singular `ペニー`, plural `ペンス`. |
| HKD | ja | one `セント`, other `セント` | confirmed | https://ja.wikipedia.org/wiki/香港ドル | "補助通貨単位はセント（Cent・略符号は￠）・ミル（mil）で、1ドル=100セント=1000ミル". |
| SGD | ja | one `セント`, other `セント` | confirmed | https://ja.wikipedia.org/wiki/シンガポールドル | "補助単位はドルの100分の1のシンガポール・セント(単位記号 S￠)". |
| THB | th | one `สตางค์`, other `สตางค์` | confirmed | https://en.wikipedia.org/wiki/Thai_baht | Already present: "divided into 100 satang (สตางค์)". The Thai part is read as บาท + สตางค์, not with จุด ("point"); see https://elon.io/grammar/thai/numbers/currency. |
| CNY | ja | (none) | no source | https://ja.wikipedia.org/wiki/人民元 | Deliberately omitted. The yuan's 1/100 unit is `分` (`フェン`), not `セント`, and Japanese usage is not settled enough to assert a money reading. `ja-JP` + `CNY` therefore falls back to `decimal-name`; the fallback is pinned by a test. |

## Sources

- https://en.wikipedia.org/wiki/Language_and_the_euro
- https://en.wikipedia.org/wiki/United_States_dollar
- https://en.wikipedia.org/wiki/Pound_sterling
- https://en.wikipedia.org/wiki/Japanese_yen
- https://en.wikipedia.org/wiki/Renminbi
- https://en.wikipedia.org/wiki/New_Taiwan_dollar
- https://en.wikipedia.org/wiki/Hong_Kong_dollar
- https://en.wikipedia.org/wiki/Singapore_dollar
- https://en.wikipedia.org/wiki/Malaysian_ringgit
- https://en.wikipedia.org/wiki/Indonesian_rupiah
- https://en.wikipedia.org/wiki/Indian_rupee
- https://en.wikipedia.org/wiki/Thai_baht
- https://en.wikipedia.org/wiki/South_Korean_won
- https://en.wikipedia.org/wiki/Vietnamese_%C4%91%E1%BB%93ng
- https://en.wikipedia.org/wiki/Australian_dollar
- https://en.wikipedia.org/wiki/Canadian_dollar
- https://en.wikipedia.org/wiki/New_Zealand_dollar
- https://en.wikipedia.org/wiki/Swiss_franc
- https://en.wikipedia.org/wiki/Coins_of_the_Swiss_franc
- https://en.wikipedia.org/wiki/South_African_rand
- https://en.wikipedia.org/wiki/Philippine_peso
- https://en.wikipedia.org/wiki/Swedish_krona
- https://en.wikipedia.org/wiki/Norwegian_krone
- https://en.wikipedia.org/wiki/Danish_krone
- https://en.wiktionary.org/wiki/cent
- https://en.wiktionary.org/wiki/sen
- https://ta.wiktionary.org/wiki/cent
- https://ta.wikipedia.org/wiki/%E0%AE%AA%E0%AF%88%E0%AE%9A%E0%AE%BE
- https://en.glosbe.com/en/ta/Cent
- https://www.duden.de/rechtschreibung/Cent
- https://dle.rae.es/centavo
- https://ja.wikipedia.org/wiki/アメリカ合衆国ドル
- https://ja.wikipedia.org/wiki/ユーロ
- https://ja.wikipedia.org/wiki/スターリング・ポンド
- https://ja.wikipedia.org/wiki/香港ドル
- https://ja.wikipedia.org/wiki/シンガポールドル
- https://ja.wikipedia.org/wiki/セント_(通貨)
- https://ja.wikipedia.org/wiki/人民元
- https://elon.io/grammar/thai/numbers/currency
