# Subunit name verification

Verification of every entry in `data/subunits.json` against outside sources.
Checked 2026-09-21, extended 2026-09-26.

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
| CNY | ja | (none) | no source | https://ja.wikipedia.org/wiki/人民元 | Deliberately omitted. The yuan's 1/100 unit is `分` (`フェン`), not `セント`, and Japanese usage is not settled enough to assert a money reading. `ja-JP` + `CNY` therefore resolves through the kind's international name (`fen`), not a Japanese word. |

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

The stale "ko has no cent entry" comment in `test/verbalize.test.ts` was corrected
in a later pass: the test now asserts that a curated language uses its own word
(`ko-KR` `USD` -> `센트`), and that an uncurated kind uses the international name
(`ko-KR` `SEK` -> `øre`).

## Matrix subunit pass (2026-09-26)

Second fill pass over the `(language, kind)` grid. Scope was every cell still
empty, in the order the task set: `tr` `cent`/`eurocent`, then `lo`/`my` `cent`,
then the Indic `cent` cells, then the remaining per-language gaps for `paisa`,
`poysha`, `satang`, `sen`, `fen`, `sentimo`, `penny`, `fils`. The method is the
one the previous pass used: read the target-language Wikipedia article for a
currency that uses the kind and take its infobox `subunit_name_N` (or the local
parameter name) or the prose where it gives the number form. Nothing here is
machine translated, taken from a bare search result, or invented.

Filled this pass: **111 cells** (33 languages x 13 kinds = 429; **206 covered,
223 still empty**). Where a source gives only one number form, that form fills
every CLDR category the language needs. Where the source distinguishes a plural,
it is recorded; for a language whose CLDR rule has only `other`, the singular is
stored under `other`.

### Turkish (tr) — CLDR: one, other

Turkish is now in the example matrix, so its whole matrix-reachable set was
filled rather than just `cent`.

| kind | word | source URL | note |
| --- | --- | --- | --- |
| cent | `sent` | https://tr.wikipedia.org/wiki/Euro | Infobox `altbirim_adı_1 = [[Cent\|Sent]]`; the dollar article's infobox writes `Cent`, the euro article gives the Turkish spelling `Sent`. |
| eurocent | `sent` | https://tr.wikipedia.org/wiki/Euro | Same infobox, the euro's own subunit. |
| fen | `Fen` | https://tr.wikipedia.org/wiki/Renminbi | Prose "10 Jiao(角) = 100 Fen(分)". |
| paisa | `paisa` | https://tr.wikipedia.org/wiki/Hindistan_rupisi | Infobox `altbirim_adı_1 = paisa`. |
| poysha | `poişa` | https://tr.wikipedia.org/wiki/Bangladeş_takası | Prose "alt birimi ''poişa'' (পয়সা)". |
| satang | `satang` | https://tr.wikipedia.org/wiki/Tayland_bahtı | Prose "alt birimi ''satang''". |
| sen | `sen` | https://tr.wikipedia.org/wiki/Ringgit | Prose "alt birimi ''sen''". |
| sentimo | `sentimo` | https://tr.wikipedia.org/wiki/Filipinler_pesosu | Infobox `altbirim_adı_1 = Séntimo`; the accent is a transcription artifact, normalized to Turkish spelling. |
| fils | `fils` | https://tr.wikipedia.org/wiki/Kuveyt_dinarı | Infobox `altbirim_adı_1 = fils`. |

`kurus` was already present. `tr.penny` was left out: the pound article's
infobox uses the English word `penny` verbatim, with no Turkish form.

### Lao (lo) and Burmese (my) — CLDR: other

Both languages had no entry at all and read pure English. Each gets `cent`; no
other kind is named in their Wikipedia pages.

| language | kind | word | source URL | note |
| --- | --- | --- | --- | --- |
| lo | cent | `ເຊັນ` | https://lo.wikipedia.org/wiki/ໂດລາສະຫະລັດ | Coin table "1 ເຊັນ", "5 ເຊັນ", ...; "1 ເຊັນ ວ່າ ເພນນີ". |
| my | cent | `ဆင့်` | https://my.wikipedia.org/wiki/အမေရိကန်ဒေါ်လာ | "တစ်ဒေါ်လာ တွင် ဆင့် ၁၀၀ ပါရှိသည်" (a dollar has 100 cents). |

The Burmese Singapore/Hong Kong articles spell the same word `စင့်`
(https://my.wikipedia.org/wiki/စင်ကာပူဒေါ်လာ); the US-dollar spelling `ဆင့်`
was recorded because `cent` is represented by that currency.

### Gujarati (gu) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| cent | `સેંટ` | https://gu.wikipedia.org/wiki/સિંગાપુર | "સિંગાપુર ડૉલર અને સેંટ ના સિક્કા પર ...". Gujarati does not mark a plural on the loanword, so one form fills both. |

`gu` has no dedicated dollar/euro article; the Singapore country page is the
attesting source.

### Filipino (fil) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| cent | `sentimo` | https://tl.wikipedia.org/wiki/Dolyar_ng_Hongkong | "Nahahati ang dolyar sa 100 mga sentimo." Same word as the peso subunit; invariant after a numeral. |

### German (de) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| fen | `Fen` | https://de.wikipedia.org/wiki/Renminbi | "Untereinheiten ... ''Fen'' (分)". |

### French (fr) — CLDR: one, many, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| penny | one `penny`, many/other `pence` | https://fr.wikipedia.org/wiki/Livre_sterling | Infobox "100 pence (singulier : penny)". |
| fen | `fen` | https://fr.wikipedia.org/wiki/Yuan | Infobox "jiao (1/10), fen (1/100)". |
| paisa | `paisa` | https://fr.wikipedia.org/wiki/Roupie_indienne | Infobox "100 paisa". |
| poysha | one `poisha`, many/other `poishas` | https://fr.wikipedia.org/wiki/Taka | "1 taka = 100 poishas". |
| satang | one `satang`, many/other `satangs` | https://fr.wikipedia.org/wiki/Baht | "100 สตางค์ (satangs)". |
| sen | `sen` | https://fr.wikipedia.org/wiki/Ringgit | Infobox "sen". |
| sentimo | `sentimo` | https://fr.wikipedia.org/wiki/Peso_philippin | Infobox "sentimo". |
| fils | `fils` | https://fr.wikipedia.org/wiki/Dinar_koweïtien | "1 dinar = 1000 fils". |

### Spanish (es) — CLDR: one, many, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| penny | one `penique`, many/other `peniques` | https://es.wikipedia.org/wiki/Libra_esterlina | Infobox "100 peniques". |
| fen | `fen` | https://es.wikipedia.org/wiki/Renminbi | Infobox "100 fen". |
| paisa | one `paisa`, many/other `paisas` | https://es.wikipedia.org/wiki/Rupia_india | Infobox "100 paisa (plural: paisas)". |
| poysha | `poisha` | https://es.wikipedia.org/wiki/Taka_bangladesí | Infobox "100 poisha"; no plural recorded, so one form. |
| satang | `satang` | https://es.wikipedia.org/wiki/Bat_tailandés | Infobox "100 satang". |
| sen | `sen` | https://es.wikipedia.org/wiki/Ringgit | Infobox "100 sen". |
| sentimo | one `céntimo`, many/other `céntimos` | https://es.wikipedia.org/wiki/Peso_filipino | Infobox "100 céntimos"; Spanish names the Philippine centavo `céntimo`. |
| fils | `fils` | https://es.wikipedia.org/wiki/Dinar_kuwaití | Infobox "1000 fils". |

### Italian (it) — CLDR: one, many, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| penny | one `penny`, many/other `pence` | https://it.wikipedia.org/wiki/Sterlina_britannica | Infobox `frazioni = 100 pence (sing. penny)`. |
| fen | `fen` | https://it.wikipedia.org/wiki/Renminbi_cinese | Infobox `frazioni = 10 jiao ... 100 fen`. |
| paisa | `paisa` | https://it.wikipedia.org/wiki/Rupia_indiana | Infobox `frazioni = paisa (1/100)`; the Pakistani page spells the plural `paise`. |
| poysha | `poisha` | https://it.wikipedia.org/wiki/Taka_bangladese | Infobox `frazioni = poisha (1/100)`. |
| satang | `satang` | https://it.wikipedia.org/wiki/Baht_thailandese | Infobox `frazioni = satang 1/100`. |
| sen | `sen` | https://it.wikipedia.org/wiki/Ringgit_malese | Infobox `frazioni = sen (1/100)`. |
| sentimo | `sentimo` | https://it.wikipedia.org/wiki/Peso_filippino | Infobox `frazioni = 100 sentimo`. |
| fils | `fils` | https://it.wikipedia.org/wiki/Dinaro_kuwaitiano | Infobox `frazioni = fils (1/1000)`. |

### Dutch (nl) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| paisa | `paisa` | https://nl.wikipedia.org/wiki/Nepalese_roepie | "Eén roepie is honderd paisa." |
| poysha | `poisha` | https://nl.wikipedia.org/wiki/Bengalese_taka | "Eén taka is honderd poisha." |
| fils | `fils` | https://nl.wikipedia.org/wiki/Koeweitse_dinar | "Eén dinar is duizend fils." |

### Swedish (sv) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| cent | `cent` | https://sv.wikipedia.org/wiki/Singaporiansk_dollar | "1 dollar delas i 100 cent." |
| penny | one `penny`, other `pence` | https://sv.wikipedia.org/wiki/Pound_sterling | Infobox `delas i = 100 pence`; "singularform: penny". |
| fen | `fen` | https://sv.wikipedia.org/wiki/Renminbi | Infobox `delas i = 100 fen`. |
| paisa | `paisa` | https://sv.wikipedia.org/wiki/Taka | "1 Taka = 100 paisa." |
| fils | `fils` | https://sv.wikipedia.org/wiki/Kuwaitisk_dinar | "1 Dinar = 1000 fils." |

### Norwegian Bokmål (nb) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| cent | `cent` | https://nb.wikipedia.org/wiki/Singaporsk_dollar | "den deles i 100 cent." |
| satang | `satang` | https://nb.wikipedia.org/wiki/Thailandsk_baht | "1 baht = 100 satang." |

### Danish (da) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| cent | `Cent` | https://da.wikipedia.org/wiki/Amerikanske_dollar | Infobox `underenhed_navn_2 = Cent`; "opdelt i 100 ''cent''". |
| eurocent | `cent` | https://da.wikipedia.org/wiki/Euro | Infobox `underenhed_navn_1 = cent`. |
| fen | `fen` | https://da.wikipedia.org/wiki/Renminbi | "deles op i 10 ''jiao'' ... igen opdelt i 10 ''fen''". |
| penny | one `penny`, other `pence` | https://da.wikipedia.org/wiki/Britiske_pund | Infobox `underenhed_navn_1 = penny`, `pluralis_underenhed_1 = pence`. |
| fils | `fils` | https://da.wikipedia.org/wiki/Kuwaitiske_dinarer | "Der går 1000 fils på en KWD." |

### Indonesian (id) — CLDR: other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| eurocent | `sen` | https://id.wikipedia.org/wiki/Euro | Infobox `subunit_name_1 = sen`. |
| fen | `fen` | https://id.wikipedia.org/wiki/Renminbi | Infobox `subunit_name_2 = 分 (fen)`. |
| paisa | `paisa` | https://id.wikipedia.org/wiki/Rupee_India | Infobox `subunit_name_1 = Paisa`. |
| poysha | `poisha` | https://id.wikipedia.org/wiki/Taka_Bangladesh | Infobox `subunit_name_1 = Poisha`. |
| satang | `satang` | https://id.wikipedia.org/wiki/Baht | Infobox `subunit_name_1 = satang`. |
| sentimo | `sentimo` | https://id.wikipedia.org/wiki/Peso_Filipina | Infobox `subunit_name_1 = sentimo (atau centavo)`. |
| fils | `filis` | https://id.wikipedia.org/wiki/Dinar_Kuwait | Infobox `subunit_name_1 = filis (فلس)`. |

### Malay (ms) — CLDR: other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| eurocent | `sen` | https://ms.wikipedia.org/wiki/Euro | Infobox `subunit_name_1 = Sen`. |
| paisa | `paisa` | https://ms.wikipedia.org/wiki/Rupee_India | Infobox `subunit_name_1 = paisa`. |
| satang | `satang` | https://ms.wikipedia.org/wiki/Baht_Thailand | Infobox `subunit_name_1 = satang`. |
| sentimo | `sentimo` | https://ms.wikipedia.org/wiki/Peso_Filipina | Infobox `subunit_name_1 = sentimo`. |
| penny | `peni` | https://ms.wikipedia.org/wiki/Paun_sterling | Infobox local param `nama_subunit_1 = peni`. |

### Thai (th) — CLDR: other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| eurocent | `เซ็นต์` | https://th.wikipedia.org/wiki/ยูโร | Infobox `subunit_name_1 = เซ็นต์`. |
| penny | `เพนนี` | https://th.wikipedia.org/wiki/ปอนด์สเตอร์ลิง | Infobox `subunit_name_1 = เพนนี`, plural `เพนซ์`; Thai has no plural category, so `other` holds the singular. |
| fen | `เฟิน` | https://th.wikipedia.org/wiki/เหรินหมินปี้ | Infobox `subunit_name_3 = เฟิน (分)`. |
| paisa | `ไปซา` | https://th.wikipedia.org/wiki/รูปีปากีสถาน | Infobox `subunit_name_1 = ไปซา`; the Indian page spells it `ไปเซ`. |
| poysha | `ปอยชา` | https://th.wikipedia.org/wiki/ฏากา | Infobox `subunit_name_1 = ปอยชา`. |
| sen | `เซ็น` | https://th.wikipedia.org/wiki/ริงกิต | Infobox `subunit_name_1 = เซ็น`. |
| sentimo | `เซนติโม` | https://th.wikipedia.org/wiki/เปโซฟิลิปปินส์ | Infobox `subunit_name_1 = เซนติโม`. |
| fils | `ฟิลส์` | https://th.wikipedia.org/wiki/ดีนาร์คูเวต | Infobox `subunit_name_1 = ฟิลส์`. |

### Tamil (ta) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| eurocent | `சதம்` | https://ta.wikipedia.org/wiki/ஐரோ | Infobox `subunit_name_1 = சதம்`. |
| fen | `ஃபன்` | https://ta.wikipedia.org/wiki/ரென்மின்பி | Infobox `subunit_name_2 = ஃபன் (分)`. |
| satang | `சடாங்` | https://ta.wikipedia.org/wiki/தாய்லாந்தின்_பாட் | Infobox `subunit_name_1 = சடாங்`. |
| sen | `சென்` | https://ta.wikipedia.org/wiki/மலேசிய_ரிங்கிட் | Infobox `subunit_name_1 = சென்`. |
| penny | `பென்னி` | https://ta.wikipedia.org/wiki/பிரித்தானிய_பவுண்டு | Infobox `subunit_name_1 = பென்னி`. |
| fils | `பில்சு` | https://ta.wikipedia.org/wiki/குவைத்_தினார் | Infobox `subunit_name_1 = பில்சு`. |

Tamil has no grammatical plural on these loans, so one form fills both.

### Marathi (mr) — CLDR: one, other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| sen | `सेन` | https://mr.wikipedia.org/wiki/मलेशियन_रिंगिट | Infobox `विभाजन = १/१०० सेन`. |
| penny | `पेनी` | https://mr.wikipedia.org/wiki/ब्रिटिश_पाउंड | Infobox `विभाजन = १/१०० पेनी`. |
| sentimo | `सेंटिमो` | https://mr.wikipedia.org/wiki/फिलिपिन_पेसो | Infobox `विभाजन = १/१०० (सेंटिमो)`. |

### Punjabi (pa), Bengali (bn), Hindi (hi), Urdu (ur)

| language | kind | word | source URL | note |
| --- | --- | --- | --- | --- |
| pa | fils | `ਫ਼ਿਲਸ` | https://pa.wikipedia.org/wiki/ਕੁਵੈਤੀ_ਦਿਨਾਰ | Infobox `subunit_name_1 = ਫ਼ਿਲਸ`. |
| bn | fils | `ফিলস` | https://bn.wikipedia.org/wiki/কুয়েতি_দিনার | Infobox `subunit_name_1 = ফিলস`. |
| hi | fils | `फिल्स` | https://hi.wikipedia.org/wiki/कुवैती_दीनार | Infobox `subunit_name_1 = फिल्स`. |
| ur | sen | `سین` | https://ur.wikipedia.org/wiki/انڈونیشیائی_روپیہ | Infobox `subunit_name_1 = سین`. |

### Vietnamese (vi) — CLDR: other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| fen | `fen` | https://vi.wikipedia.org/wiki/Nhân_dân_tệ | Infobox `subunit_name_2 = fen (分)`. |
| paisa | `paisa` | https://vi.wikipedia.org/wiki/Rupee_Ấn_Độ | Infobox `subunit_name_1 = paisa`. |
| satang | `satang` | https://vi.wikipedia.org/wiki/Baht | Infobox `subunit_name_1 = satang`. |
| sen | `sen` | https://vi.wikipedia.org/wiki/Ringgit | Infobox `subunit_name_1 = sen`. |
| penny | `xu` | https://vi.wikipedia.org/wiki/Bảng_Anh | "Một bảng Anh gồm 100 xu (pence hoặc penny)". |

### Chinese (zh) and Cantonese (yue) — CLDR: other

| language | kind | word | source URL | note |
| --- | --- | --- | --- | --- |
| zh | eurocent | `欧分` | https://zh.wikipedia.org/wiki/欧元 | Infobox `subunit_name_1 = 欧分`. |
| zh | penny | `便士` | https://zh.wikipedia.org/wiki/英镑 | Infobox `subunit_name_1 = 便士`. |
| zh | poysha | `派沙` | https://zh.wikipedia.org/wiki/孟加拉塔卡 | Infobox `subunit_name_1 = 派沙`. |
| zh | satang | `撒丹` | https://zh.wikipedia.org/wiki/泰銖 | Infobox `subunit_name_1 = 撒丹`. |
| zh | sen | `仙` | https://zh.wikipedia.org/wiki/馬來西亞令吉 | Infobox `subunit_name_1 = 仙 (sen)`. |
| zh | sentimo | `仙塔沃` | https://zh.wikipedia.org/wiki/菲律賓披索 | Infobox `subunit_name_1 = 仙塔沃 (centavo), 菲律賓語 sentimo`. |
| yue | penny | `便士` | https://yue.wikipedia.org/wiki/英鎊 | Infobox `subunit_name_1 = 便士`. |
| yue | sen | `仙` | https://yue.wikipedia.org/wiki/令吉 | Infobox `subunit_name_1 = 仙（sen）`. |

### Japanese (ja) — CLDR: other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| paisa | `パイサ` | https://ja.wikipedia.org/wiki/インド・ルピー | Infobox `subunit_name_1 = パイサ`. |
| poysha | `ポイシャ` | https://ja.wikipedia.org/wiki/タカ_(通貨) | Infobox `subunit_name_1 = ポイシャ`. |
| satang | `サタン` | https://ja.wikipedia.org/wiki/バーツ | Infobox `subunit_name_1 = サタン`. |
| sen | `セン` | https://ja.wikipedia.org/wiki/リンギット | Infobox `subunit_name_1 = セン`. |
| sentimo | `センタボ` | https://ja.wikipedia.org/wiki/フィリピン・ペソ | The peso's subunit is `センタボ` (centavo), the Japanese word for it. |
| fils | `フィルス` | https://ja.wikipedia.org/wiki/クウェート・ディナール | Infobox `subunit_name_1 = フィルス`. |

### Korean (ko) — CLDR: other

| kind | word | source URL | note |
| --- | --- | --- | --- |
| paisa | `파이사` | https://ko.wikipedia.org/wiki/인도_루피 | Infobox `보조단위_이름_1 = 파이사`. |
| poysha | `파이사` | https://ko.wikipedia.org/wiki/방글라데시_타카 | Infobox `보조단위_이름_1 = 파이사 (poysha)`. |
| satang | `사땅` | https://ko.wikipedia.org/wiki/태국_밧 | Infobox `보조단위_이름_1 = 사땅 (satang)`. |
| sen | `센` | https://ko.wikipedia.org/wiki/말레이시아_링깃 | Infobox `보조단위_이름_1 = 센(sen)`. |
| sentimo | `센티모` | https://ko.wikipedia.org/wiki/필리핀_페소 | Infobox `보조단위_이름_1 = 센티모`. |
| fils | `필스` | https://ko.wikipedia.org/wiki/쿠웨이트_디나르 | Infobox `보조단위_이름_1 = 필스`. |

`ko.ore` was deliberately **not** added: it would replace the international
`øre` that `test/verbalize.test.ts` asserts for `ko-KR` `SEK`.

### New sources

- https://tr.wikipedia.org/wiki/Euro
- https://tr.wikipedia.org/wiki/Renminbi
- https://tr.wikipedia.org/wiki/Hindistan_rupisi
- https://tr.wikipedia.org/wiki/Bangladeş_takası
- https://tr.wikipedia.org/wiki/Tayland_bahtı
- https://tr.wikipedia.org/wiki/Ringgit
- https://tr.wikipedia.org/wiki/Filipinler_pesosu
- https://tr.wikipedia.org/wiki/Kuveyt_dinarı
- https://lo.wikipedia.org/wiki/ໂດລາສະຫະລັດ
- https://my.wikipedia.org/wiki/အမေရိကန်ဒေါ်လာ
- https://my.wikipedia.org/wiki/စင်ကာပူဒေါ်လာ
- https://gu.wikipedia.org/wiki/સિંગાપુર
- https://tl.wikipedia.org/wiki/Dolyar_ng_Hongkong
- https://de.wikipedia.org/wiki/Renminbi
- https://fr.wikipedia.org/wiki/Livre_sterling
- https://fr.wikipedia.org/wiki/Yuan
- https://fr.wikipedia.org/wiki/Roupie_indienne
- https://fr.wikipedia.org/wiki/Taka
- https://fr.wikipedia.org/wiki/Baht
- https://fr.wikipedia.org/wiki/Ringgit
- https://fr.wikipedia.org/wiki/Peso_philippin
- https://fr.wikipedia.org/wiki/Dinar_koweïtien
- https://es.wikipedia.org/wiki/Libra_esterlina
- https://es.wikipedia.org/wiki/Renminbi
- https://es.wikipedia.org/wiki/Rupia_india
- https://es.wikipedia.org/wiki/Taka_bangladesí
- https://es.wikipedia.org/wiki/Bat_tailandés
- https://es.wikipedia.org/wiki/Ringgit
- https://es.wikipedia.org/wiki/Peso_filipino
- https://es.wikipedia.org/wiki/Dinar_kuwaití
- https://it.wikipedia.org/wiki/Sterlina_britannica
- https://it.wikipedia.org/wiki/Renminbi_cinese
- https://it.wikipedia.org/wiki/Rupia_indiana
- https://it.wikipedia.org/wiki/Taka_bangladese
- https://it.wikipedia.org/wiki/Baht_thailandese
- https://it.wikipedia.org/wiki/Ringgit_malese
- https://it.wikipedia.org/wiki/Peso_filippino
- https://it.wikipedia.org/wiki/Dinaro_kuwaitiano
- https://nl.wikipedia.org/wiki/Nepalese_roepie
- https://nl.wikipedia.org/wiki/Bengalese_taka
- https://nl.wikipedia.org/wiki/Koeweitse_dinar
- https://sv.wikipedia.org/wiki/Singaporiansk_dollar
- https://sv.wikipedia.org/wiki/Pound_sterling
- https://sv.wikipedia.org/wiki/Renminbi
- https://sv.wikipedia.org/wiki/Taka
- https://sv.wikipedia.org/wiki/Kuwaitisk_dinar
- https://nb.wikipedia.org/wiki/Singaporsk_dollar
- https://nb.wikipedia.org/wiki/Thailandsk_baht
- https://da.wikipedia.org/wiki/Amerikanske_dollar
- https://da.wikipedia.org/wiki/Euro
- https://da.wikipedia.org/wiki/Renminbi
- https://da.wikipedia.org/wiki/Britiske_pund
- https://da.wikipedia.org/wiki/Kuwaitiske_dinarer
- https://id.wikipedia.org/wiki/Euro
- https://id.wikipedia.org/wiki/Renminbi
- https://id.wikipedia.org/wiki/Rupee_India
- https://id.wikipedia.org/wiki/Taka_Bangladesh
- https://id.wikipedia.org/wiki/Baht
- https://id.wikipedia.org/wiki/Peso_Filipina
- https://id.wikipedia.org/wiki/Dinar_Kuwait
- https://ms.wikipedia.org/wiki/Euro
- https://ms.wikipedia.org/wiki/Rupee_India
- https://ms.wikipedia.org/wiki/Baht_Thailand
- https://ms.wikipedia.org/wiki/Peso_Filipina
- https://ms.wikipedia.org/wiki/Paun_sterling
- https://th.wikipedia.org/wiki/ยูโร
- https://th.wikipedia.org/wiki/ปอนด์สเตอร์ลิง
- https://th.wikipedia.org/wiki/เหรินหมินปี้
- https://th.wikipedia.org/wiki/รูปีปากีสถาน
- https://th.wikipedia.org/wiki/ฏากา
- https://th.wikipedia.org/wiki/ริงกิต
- https://th.wikipedia.org/wiki/เปโซฟิลิปปินส์
- https://th.wikipedia.org/wiki/ดีนาร์คูเวต
- https://ta.wikipedia.org/wiki/ஐரோ
- https://ta.wikipedia.org/wiki/ரென்மின்பி
- https://ta.wikipedia.org/wiki/தாய்லாந்தின்_பாட்
- https://ta.wikipedia.org/wiki/மலேசிய_ரிங்கிட்
- https://ta.wikipedia.org/wiki/பிரித்தானிய_பவுண்டு
- https://ta.wikipedia.org/wiki/குவைத்_தினார்
- https://mr.wikipedia.org/wiki/मलेशियन_रिंगिट
- https://mr.wikipedia.org/wiki/ब्रिटिश_पाउंड
- https://mr.wikipedia.org/wiki/फिलिपिन_पेसो
- https://pa.wikipedia.org/wiki/ਕੁਵੈਤੀ_ਦਿਨਾਰ
- https://bn.wikipedia.org/wiki/কুয়েতি_দিনার
- https://hi.wikipedia.org/wiki/कुवैती_दीनार
- https://ur.wikipedia.org/wiki/انڈونیشیائی_روپیہ
- https://vi.wikipedia.org/wiki/Nhân_dân_tệ
- https://vi.wikipedia.org/wiki/Rupee_Ấn_Độ
- https://vi.wikipedia.org/wiki/Baht
- https://vi.wikipedia.org/wiki/Ringgit
- https://vi.wikipedia.org/wiki/Bảng_Anh
- https://zh.wikipedia.org/wiki/欧元
- https://zh.wikipedia.org/wiki/英镑
- https://zh.wikipedia.org/wiki/孟加拉塔卡
- https://zh.wikipedia.org/wiki/泰銖
- https://zh.wikipedia.org/wiki/馬來西亞令吉
- https://zh.wikipedia.org/wiki/菲律賓披索
- https://yue.wikipedia.org/wiki/英鎊
- https://yue.wikipedia.org/wiki/令吉
- https://ja.wikipedia.org/wiki/インド・ルピー
- https://ja.wikipedia.org/wiki/タカ_(通貨)
- https://ja.wikipedia.org/wiki/バーツ
- https://ja.wikipedia.org/wiki/リンギット
- https://ja.wikipedia.org/wiki/フィリピン・ペソ
- https://ja.wikipedia.org/wiki/クウェート・ディナール
- https://ko.wikipedia.org/wiki/인도_루피
- https://ko.wikipedia.org/wiki/방글라데시_타카
- https://ko.wikipedia.org/wiki/태국_밧
- https://ko.wikipedia.org/wiki/말레이시아_링깃
- https://ko.wikipedia.org/wiki/필리핀_페소
- https://ko.wikipedia.org/wiki/쿠웨이트_디나르

### Cells deliberately left out this pass

Every cell below was checked and no target-language Wikipedia article (or other
acceptable source) names the word in the language's own script. The
international-name tier covers them. This is the reason the uncovered count is
still 223; many are shared by every language of a script family.

- **`kn.cent`**: the Kannada dollar article's infobox uses the Latin `Cent`
  (`subunit_name_2 = Cent`), not a Kannada word. Only a kn.wikiquote
  quotation translation uses `ಸೆಂಟ್`, which is not an authoritative lexical
  source, so it was not used.
- **`sv.eurocent`, `nb.eurocent`, `nb.fen`, `nb.paisa`, `nb.penny`,
  `nb.poysha`, `nb.sen`, `nb.sentimo`**: the Swedish and Norwegian Bokmål
  articles carry no in-language subunit line for these kinds.
- **`en.poysha`, `en.fils`, `en.kurus`**: English's own words are the
  international names already in `subunit-kinds.json`, so an entry would add
  nothing.
- **`nl.fen`, `nl.penny`, `nl.satang`, `nl.sen`, `nl.sentimo`** and
  **`sv.satang`, `sv.sen`, `sv.sentimo`, `sv.poysha`**: the Dutch and Swedish
  articles give no in-language subunit line for these.
- **Indic script families** (`bn`, `gu`, `hi`, `kn`, `ml`, `mr`, `ne`, `pa`,
  `ta`, `te`) for `fen`, `poysha`, `satang`, `sentimo`, etc.: the local articles
  either have no page for the currency or give the subunit only in Latin
  (`fen`, `Sentimo`, `satang`). Left out rather than transliterated by hand.
- **`ja.fen`**: deliberately still omitted. The Renminbi article names the
  1/100 unit `分`, but the previous pass concluded Japanese money usage is not
  settled enough to assert a reading, and that decision is kept here.
- **`ko.ore`**: kept out so the `ko-KR` `SEK` test continues to assert the
  international `øre`.
- **Semitic/Arabic-script `fils`/`sen`** for `ur` when the page gives only the
  Latin form, and `my`/`km`/`lo` for every kind their pages do not name: no
  in-script word found.
- **`ore`, `franccent`, `kurus`** for languages other than their home locales:
  not in the priority set for this pass; the existing coverage
  (`sv`/`nb`/`da`/`en` `ore`, `de`/`fr`/`it` `franccent`, `tr` `kurus`) is
  unchanged.
