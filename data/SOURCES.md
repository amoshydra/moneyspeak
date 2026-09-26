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

## Native subunit words for the fallback languages (2026-09-26)

`ko hi bn vi fil yue te ml kn mr gu pa ne ur km lo my` had no
words and read the international name (`... 45 cents`, `... 45 poysha`). This
pass adds a word wherever the language's own Wikipedia gives one for the
currency that uses the kind. Method: read the target-language article for the
currency (via the `langlinks` of the English article) and take the infobox
`subunit_name_N` / `plural_subunit_N`, or the prose where it shows the number
form. Every word below is attested on the cited page; nothing is machine
translated and no bare search result is used. Where a source gives only one
number form, that form fills both `one` and `other` (the same convention the
existing `ta` entry uses); where the source gives a distinct plural, it is used
and noted.

### Korean (ko) — CLDR: other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | one `센트` | added | https://ko.wikipedia.org/wiki/미국_달러 | "1달러는 100센트(기호:¢)이다"; no number distinction, so one form. |
| eurocent | one `센트` | added | https://ko.wikipedia.org/wiki/유로 | "유로는 100센트로 나뉜다". |
| penny | one `페니`, other `펜스` | added | https://ko.wikipedia.org/wiki/파운드_스털링 | Infobox `subunit_name_1 = 페니`, `plural_subunit_1 = 펜스`; the source distinguishes, recorded though ko selects only `other`. |
| fen | one `펀` | added | https://ko.wikipedia.org/wiki/런민비 | Infobox `보조단위_이름_2 = 펀 (分)`. |

### Hindi (hi) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | `सेंट` | added | https://hi.wikipedia.org/wiki/अमेरिकी_डॉलर | "एक डॉलर में सौ सेंट होते हैं". |
| eurocent | `सेंट` | added | https://hi.wikipedia.org/wiki/यूरो | Infobox `subunit_name_1 = यूरो सेंट`; the unit word is `सेंट`, `यूरो` is the disambiguator. |
| paisa | one `पैसा`, other `पैसे` | added | https://hi.wikipedia.org/wiki/भारतीय_रुपया | "१०० पैसा में विभाजित"; the plural `६४ पैसे` appears in the history section. |
| poysha | one `पैसा`, other `पैसे` | added | https://hi.wikipedia.org/wiki/बांग्लादेशी_टका | "৳1 को 100 पोइशा (पैसा) में विभाजित"; infobox `subunit_name_1 = पैसा`. |
| satang | `सतांग` | added | https://hi.wikipedia.org/wiki/थाई_बाथ | Infobox `subunit_name_1 = सतांग`. |
| sen | `सेन` | added | https://hi.wikipedia.org/wiki/मलेशियाई_रिंग्गित | Infobox `subunit_name_1 = सेन`. |
| fen | `फ़ेन` | added | https://hi.wikipedia.org/wiki/रॅन्मिन्बी | Infobox `subunit_name_3 = फ़ेन (分)`. |

### Bengali (bn) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | `সেন্ট` | added | https://bn.wikipedia.org/wiki/মার্কিন_ডলার | Infobox `subunit_name_2 = সেন্ট (Cent)`. |
| eurocent | `সেন্ট` | added | https://bn.wikipedia.org/wiki/ইউরো | Infobox `subunit_name_1 = সেন্ট (c)`. |
| penny | `পেনি` | added | https://bn.wikipedia.org/wiki/পাউন্ড_স্টার্লিং | Infobox `subunit_name_1 = পেনি (penny)`. |
| paisa | `পয়সা` | added | https://bn.wikipedia.org/wiki/ভারতীয়_রুপি | "১, ১০০ পয়সায় বিভক্ত"; infobox `subunit_name_1 = পয়সা`. |
| poysha | `পয়সা` | added | https://bn.wikipedia.org/wiki/বাংলাদেশী_টাকা | "টাকার ভগ্নাংশ হল পয়সা"; infobox `subunit_name_1 = পয়সা`. Bengali does not inflect after a numeral, so one form. |
| satang | `সাতাং` | added | https://bn.wikipedia.org/wiki/থাই_বাত | Infobox `subunit_name_1 = সাতাং`. |

### Filipino (fil) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| sentimo | `sentimo` | added | https://tl.wikipedia.org/wiki/Piso_ng_Pilipinas | Infobox `subunit_name_1 = Sentimo o centavo`; "baryang isang-sentimo", "limang-sentimo". Filipino does not inflect the noun after a numeral. |

### Vietnamese (vi) — CLDR: other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | one `xu` | added | https://vi.wikipedia.org/wiki/Đô_la_Mỹ | Infobox `subunit_name_2 = một xu` (1/100 đô la). No number distinction. |

### Cantonese (yue) — CLDR: other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | one `仙` | added | https://zh-yue.wikipedia.org/wiki/港元 | "十分一毫就係「仙」"; 1/100 of a dollar. |
| fen | one `分` | added | https://zh-yue.wikipedia.org/wiki/人民幣 | "硬幣面額有5毫、2毫、1毫、5分、2分、1分". |

### Telugu (te) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | one `సెంట్`, other `సెంట్లు` | added | https://te.wikipedia.org/wiki/అమెరికన్_డాలర్ | Infobox `subunit_name_2 = సెంట్`; prose "1 సెంట్లు", "25 సెంట్లు". |
| paisa | one `పైసా`, other `పైసలు` | added | https://te.wikipedia.org/wiki/భారతీయ_రూపాయి | Infobox `subunit_name_1 = పైసా`; "25 పైసలు, 50 పైసలు". |
| fen | `ఫెన్` | added | https://te.wikipedia.org/wiki/రెన్మిన్బి | Infobox `subunit_name_2 = ఫెన్ (分)`; only the base form is attested. |
| sentimo | `సెంటిమో` | added | https://te.wikipedia.org/wiki/ఫిలిప్పీన్_పెసో | Infobox `subunit_name_1 = సెంటిమో`; only the base form is attested. |

### Malayalam (ml) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | one `സെന്റ്`, other `സെന്റുകൾ` | added | https://ml.wikipedia.org/wiki/യുണൈറ്റഡ്_സ്റ്റേറ്റ്സ്_ഡോളർ | "100 സെന്റുകളായി വിഭജിച്ചിരിക്കുന്നു". |
| paisa | `പൈസ` | added | https://ml.wikipedia.org/wiki/പൈസ | "100 പൈസ = ഒരു രൂപ"; invariant after a numeral. |
| sen | `സെൻ` | added | https://ml.wikipedia.org/wiki/റിങ്കിറ്റ് | Infobox `subunit_name_1 = സെൻ`. |

### Kannada (kn) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| paisa | `ಪೈಸೆ` | added | https://kn.wikipedia.org/wiki/ಭಾರತದ_ರೂಪಾಯಿ | Infobox `subunit_name_1 = ಪೈಸೆ`; invariant after a numeral. |

### Marathi (mr) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | `सेंट` | added | https://mr.wikipedia.org/wiki/अमेरिकन_डॉलर | Infobox `विभाजन = १०० सेंट`. |
| eurocent | `सेंट` | added | https://mr.wikipedia.org/wiki/युरो | Infobox `विभाजन = १०० सेंट`. |
| paisa | one `पैसा`, other `पैसे` | added | https://mr.wikipedia.org/wiki/भारतीय_रुपया | "शंभर पैशांमध्ये (एकवचन: पैसा, अनेकवचन: पैसे)". |

### Gujarati (gu) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| paisa | one `પૈસો`, other `પૈસા` | added | https://gu.wikipedia.org/wiki/ભારતીય_રૂપિયો, https://gujarativishwakosh.org/પૈસો/ | Wikipedia: "૧૦૦ પૈસામાં વિભાજીત"; Gujarati Vishwakosh: "3 પાઈ = 1 પૈસો, 4 પૈસા = 1 આનો" (singular `પૈસો`). |

### Punjabi (pa) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | `ਸੈਂਟ` | added | https://pa.wikipedia.org/wiki/ਸੰਯੁਕਤ_ਰਾਜ_ਡਾਲਰ | Infobox `subunit_name_2 = ਸੈਂਟ`. |
| eurocent | `ਸੈਂਟ` | added | https://pa.wikipedia.org/wiki/ਯੂਰੋ | Infobox `subunit_name_1 = ਸੈਂਟ`. |
| penny | one `ਪੈਨੀ`, other `ਪੈਂਸ` | added | https://pa.wikipedia.org/wiki/ਪਾਊਂਡ_ਸਟਰਲਿੰਗ | Infobox `subunit_name_1 = ਪੈਨੀ`, `plural_subunit_1 = ਪੈਂਸ`. |
| paisa | one `ਪੈਸਾ`, other `ਪੈਸੇ` | added | https://pa.wikipedia.org/wiki/ਭਾਰਤੀ_ਰੁਪਈਆ | Infobox `subunit_name_1 = ਪੈਸਾ`, coins "50 ਪੈਸੇ". |
| poysha | `ਪੋਇਸ਼ਾ` | added | https://pa.wikipedia.org/wiki/ਬੰਗਲਾਦੇਸ਼ੀ_ਟਕਾ | Infobox `subunit_name_1 = ਪੋਇਸ਼ਾ`. |
| satang | `ਸਤਾਂਗ` | added | https://pa.wikipedia.org/wiki/ਥਾਈ_ਬਾਤ | Infobox `subunit_name_1 = ਸਤਾਂਗ`. |
| sen | `ਸਨ` | added | https://pa.wikipedia.org/wiki/ਮਲੇਸ਼ੀਆਈ_ਰਿਙਿਤ | Infobox `subunit_name_1 = ਸਨ`. |
| fen | `ਫਨ` | added | https://pa.wikipedia.org/wiki/ਰੇਨਮਿਨਬੀ | Infobox `subunit_name_3 = ਫਨ (分)`. |
| sentimo | `ਸੰਤੀਮੋ` | added | https://pa.wikipedia.org/wiki/ਫ਼ਿਲਪੀਨੀ_ਪੀਸੋ | Infobox `subunit_name_1 = ਸੰਤੀਮੋ`. |

### Nepali (ne) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | `सेन्ट` | added | https://ne.wikipedia.org/wiki/अमेरिकी_डलर | "एक डलरमा सय सेन्ट हुन्छ". |
| eurocent | `सेन्ट` | added | https://ne.wikipedia.org/wiki/युरो | Infobox `subunit_name_1 = सेन्ट`. |
| paisa | `पैसा` | added | https://ne.wikipedia.org/wiki/नेपाली_रुपैयाँ, https://ne.wikipedia.org/wiki/भारतीय_रुपैयाँ | "एक रुपैयाँलाई सय पैसा"; invariant after a numeral. |
| poysha | `पोयसा` | added | https://ne.wikipedia.org/wiki/टाका | Infobox `subunit_name_1 = पोयसा`. |
| sentimo | `सेन्टिमो` | added | https://ne.wikipedia.org/wiki/फिलिपिनी_पेसो | Infobox `subunit_name_1 = सेन्टिमो`. |

### Urdu (ur) — CLDR: one, other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | `سنٹ` | added | https://ur.wikipedia.org/wiki/امریکی_ڈالر | Infobox `subunit_name_2 = سنٹ` (the article's spelling). |
| eurocent | `سینٹ` | added | https://ur.wikipedia.org/wiki/یورو | "50 سینٹ"; the euro article spells it with the medial ye. |
| penny | one `پینی`, other `پینس` | added | https://ur.wikipedia.org/wiki/پاؤنڈ_اسٹرلنگ | Infobox `subunit_name_1 = پینی`, `plural_subunit_1 = پینس`. |
| paisa | one `پیسہ`, other `پیسے` | added | https://ur.wikipedia.org/wiki/پاکستانی_روپیہ | Infobox `subunit_name_1 = پیسہ`; nickname `پیسے`. |
| poysha | one `پیسہ`, other `پیسے` | added | https://ur.wikipedia.org/wiki/بنگلہ_دیشی_ٹکا | Infobox `subunit_name_1 = پیسہ`. |
| fils | `فلس` | added | https://ur.wikipedia.org/wiki/کویتی_دینار | Infobox `subunit_name_1 = فلس (کرنسی)`; same on https://ur.wikipedia.org/wiki/بحرینی_دینار. |

### Khmer (km) — CLDR: other

| kind | word | verdict | source URL | note |
| --- | --- | --- | --- | --- |
| cent | one `សេន` | added | https://km.wikipedia.org/wiki/ដុល្លារអាមេរិក | Infobox `subunit_name_2 = សេន` for the US dollar cent. |
| sen | one `សេន` | added | https://km.wikipedia.org/wiki/រៀល_(រូបិយវត្ថុ) | Infobox `subunit_name_2 = សេន (ទាំងពីរ, ការប្រើដ៏កម្រ)` for the riel; the riel is "divided into 100 sen" (https://en.wikipedia.org/wiki/Cambodian_riel). |

### Left out deliberately

- **ko** `paisa`, `poysha`, `satang`, `sen`, `sentimo`, `fils`, `ore`,
  `franccent`: no Korean-language article found that names the subunit; the
  English international name stays.
- **hi** `sentimo`, `penny`, `fils`, `ore`, `franccent`: the Hindi pages use the
  Latin/English form (`Sentimo`, `penny`), not a Devanagari word, so no word.
- **bn** `fen`, `sen`, `sentimo`, `poysha` (already covered by `পয়সা`), `fils`,
  `ore`, `franccent`: the Bengali Renminbi page uses `fēn (分)` in Latin; no
  Bengali-language article exists for the ringgit / Philippine peso.
- **fil** `cent`, `eurocent`, `penny`, `paisa`, `satang`, `sen`, `fen`,
  `poysha`, `fils`: `sentimo` is the only Filipino word sourced (`Piso ng
  Pilipinas` defines it for the peso). The US-dollar article does not name the
  cent in Filipino, so `fil.cent` is left out rather than inferred.
- **vi** `eurocent`, `sentimo`, `penny`, `paisa`, `satang`, `sen`, `fen`,
  `fils`: the Vietnamese Euro page uses English `Cent`, and the Philippine-peso
  page labels `sentimo` as the Filipino term (`Tiếng Philippines`), not a
  Vietnamese word.
- **yue** `eurocent`, `penny`, `sentimo`, `paisa`, `satang`, `sen`, `poysha`,
  `fils`: no Cantonese-language page names these subunits.
- **te** `eurocent`, `penny`, `satang`, `sen`, `poysha`, `fils`: no Telugu page
  names them.
- **ml** `eurocent`, `fen`, `sentimo`, `penny`, `satang`, `poysha`, `fils`: no
  Malayalam page names them.
- **kn** `cent`, `eurocent`, `fen`, `sentimo`, `penny`, `satang`, `sen`,
  `poysha`, `fils`: the Kannada US-dollar page uses the English word `Cent`, and
  no Kannada page names the others.
- **mr** `penny`, `satang`, `sen`, `fen`, `sentimo`, `poysha`, `fils`: no
  Marathi page names them.
- **gu** `cent`, `eurocent`, `penny`, `satang`, `sen`, `fen`, `sentimo`,
  `poysha`, `fils`: Gujarati has no article for the dollar, euro or pound;
  only `paisa` is sourced.
- **pa** `fils`, `ore`, `franccent`: no Punjabi page names them.
- **ne** `penny`, `satang`, `sen`, `fen`, `fils`, `ore`, `franccent`: the
  Nepali Renminbi page uses `fēn (分)` in Latin; the others have no Nepali page.
- **ur** `satang`, `sen`, `fen`, `sentimo`, `ore`, `franccent`: the Urdu
  ringgit / Thai-baht / Renminbi / Philippine-peso infoboxes use the Latin
  `sen`, `satang`, `fēn`, `Sentimo`.
- **km** `paisa`, `poysha`, `satang`, `penny`, `sentimo`, `eurocent`, `fen`,
  `fils`, `ore`, `franccent`: only `cent`/`sen` are named in Khmer.
- **lo**, **my**: nothing added. The Lao kip and Myanmar kyat have no minor
  unit in ISO 4217 (exponent 0), and their Wikipedia pages give no word for any
  of the mapped kinds.

### Fallbacks after this pass

- Every *mapped* kind now has at least one language word: `fils` (`ur.fils`)
  and `poysha` (`bn`, `hi`, `pa`, `ne`, `ur`) no longer rely on the
  international name for a language that actually needs them.
- Among the target languages, `ore` and `franccent` still have no word, so
  `ko ... SEK 1.05` etc. read the international name (`øre`, `centime`). Every
  other target language falls back only for the cells listed under *Left out*,
  which keeps the international name from `data/subunit-kinds.json` (never the
  decimal reading, because the kind still resolves).

### Note (data-only constraint)

`test/verbalize.test.ts:109` still carries the comment "ko has no cent entry";
the assertion still holds (a `ko` subunit exists, the strategy is
`major-minor`), so no test change was required. The comment is now stale.
