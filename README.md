# WorknGarden.de

Statische, responsive Affiliate-Website für Gartenprodukte. Entwickelt für GitHub Pages ohne Framework und ohne Build-Schritt.

## Enthalten

- Startseite mit Kategorien, redaktioneller Auswahl, Neuheiten, FAQ und Kaufberatung
- zentrale Produktdatenbank `assets/js/products.js`
- zentrale Amazon Tracking-ID `assets/js/config.js`
- `createAffiliateLink(asin)` für direkte Amazon-Produktlinks
- Fallback `createAmazonSearchLink(query)` für Produkte ohne verifizierte ASIN
- Suche, Filter, Sortierung und Vergleich von bis zu 4 Produkten
- dynamische Produktdetailseite `product.html?id=...`
- statische Kategorie-Landingpages für SEO
- Ratgeber-Landingpages, Sitemap, robots.txt, OpenGraph und Schema.org
- Impressum, Datenschutz-Template und Affiliate-Transparenz
- GitHub Actions Workflow für GitHub Pages

## Datenprinzip

WorknGarden speichert keine erfundenen Preise, Sterne, Review-Zahlen oder Bestseller-Ränge. Wenn Live-Daten nicht zuverlässig automatisiert aktualisiert werden können, bleiben diese Felder leer. Redaktionelle Tags sind ausdrücklich keine offiziellen Tests.

Produktbilder sind in dieser Version absichtlich neutrale Eigenillustrationen. Sobald eine zulässige Bildquelle oder die Amazon Product Advertising API eingebunden wird, kann im jeweiligen Produktobjekt `image` ergänzt und die Renderlogik erweitert werden.

## Amazon-Affiliate

Tracking-ID: `Gainlytic-21`

Konfiguration in `assets/js/config.js`:

```js
amazonTrackingId: "Gainlytic-21"
```

Direkter ASIN-Link:

```js
createAffiliateLink("B0BNLMJ7LQ")
```

Alle Amazon-Buttons tragen `rel="sponsored nofollow noopener"`.

## Neues Produkt hinzufügen

In `assets/js/products.js` ein Objekt ergänzen. Wichtige Felder:

```js
{
  id: "eindeutiger-slug",
  asin: null,
  amazonQuery: "Marke Modell",
  name: "Produktname",
  brand: "Marke",
  category: "Bewässerung",
  subcategory: "Viereckregner",
  description: "Kurzbeschreibung",
  features: [],
  pros: [],
  cons: [],
  target: "Zielgruppe",
  variants: [],
  specs: {},
  rating: null,
  reviewCount: null,
  bestseller: null,
  priceCategory: "Mittelklasse",
  editorialTags: [],
  sourceUrl: "https://...",
  sourceLabel: "Hersteller Produktseite",
  verifiedOn: "YYYY-MM-DD",
  image: ""
}
```

## GitHub Pages

1. Neues öffentliches Repository erstellen, z. B. `WorknGarden`.
2. Den Inhalt dieses Ordners in den Repository-Root hochladen.
3. Unter **Settings → Pages** bei **Source** `GitHub Actions` auswählen.
4. Push auf `main` löst `.github/workflows/pages.yml` aus.
5. Unter **Settings → Pages → Custom domain** `workngarden.de` hinterlegen.
6. HTTPS aktivieren, sobald GitHub es anbietet.

### DNS für workngarden.de

Apex-Domain `@` auf die GitHub-Pages-IP-Adressen setzen:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Optional/empfohlen für `www`: CNAME `www` → `surroundsights.github.io`

DNS-Änderungen können Zeit benötigen. GitHub empfiehlt außerdem, die eigene Domain zu verifizieren.

## Rechtliches

Die rechtlichen Seiten sind technisch strukturierte Vorlagen und keine Rechtsberatung. Vor Veröffentlichung sollten sie an die tatsächlich eingesetzten Dienste, Unternehmensangaben und steuer-/gewerberechtlichen Rahmenbedingungen angepasst und geprüft werden.
