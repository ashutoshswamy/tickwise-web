import { items } from "@/lib/faq";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";

// Structured data for the home page: the organisation, the site, the extension and the FAQ.
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon` },
      { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: SITE_NAME, description: SITE_DESC, publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: "en" },
      {
        "@type": "SoftwareApplication", name: `${SITE_NAME} for VS Code`, applicationCategory: "DeveloperApplication", operatingSystem: "Windows, macOS, Linux",
        description: "VS Code extension that shows sponsor lines in place of Claude Code spinner words and pays developers per impression.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": `${SITE_URL}/#org` },
      },
      { "@type": "FAQPage", mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  };
  // "<" is escaped so no text in the data can close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
