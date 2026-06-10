const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Villahermosa Open Solutions F.P.",
  "url": "https://villahermosaos.com",
  "email": "mailto:info@villahermosaos.com",
  "telephone": "+584126080650",
  "description":
    "Provides SaaS services including AI bots, agents, RAG systems, webpage development, deployments, and on-premise LLM installation.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress":
      "Avenida Sur 17, Edificio El Puente, Piso 2, Apto. 2, Zona La Candelaria",
    "addressLocality": "Caracas",
    "addressRegion": "Distrito Capital",
    "postalCode": "1010",
    "addressCountry": "VE",
  },
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
    />
  );
}
