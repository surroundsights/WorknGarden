window.SITE_CONFIG = {
  brand: "WorknGarden",
  domain: "https://workngarden.de",
  amazonTrackingId: "Gainlytic-21",
  amazonDomain: "https://www.amazon.de",
  operator: {
    company: "SurroundSights Development",
    owner: "Sebastian Kolb",
    street: "Aspichstr. 15",
    postalCity: "77886 Lauf",
    email: "surroundsights360@gmail.com"
  },
  disclosure: "Als Amazon-Partner verdiene ich an qualifizierten Verkäufen."
};

window.createAffiliateLink = function createAffiliateLink(asin) {
  if (!asin) return null;
  return `${window.SITE_CONFIG.amazonDomain}/dp/${encodeURIComponent(asin)}/ref=nosim?tag=${encodeURIComponent(window.SITE_CONFIG.amazonTrackingId)}`;
};

window.createAmazonSearchLink = function createAmazonSearchLink(query) {
  return `${window.SITE_CONFIG.amazonDomain}/s?k=${encodeURIComponent(query || "Garten")}&tag=${encodeURIComponent(window.SITE_CONFIG.amazonTrackingId)}`;
};
