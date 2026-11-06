import { CANONICAL_LINKS } from "@/lib/constants";

export default function Schema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    "name": "Swati Home Tuition Bureau",
    "alternateName": "Swati HTB Patna",
    "image": "https://swatihometuition.in/images/logo1.png",
    "@id": "https://swatihometuition.in/#organization",
    "url": "https://swatihometuition.in",
    "telephone": CANONICAL_LINKS.phone,
    "email": "contact@swatihometuition.in",
    "priceRange": "₹2,500 - ₹12,000/month",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Block A, Area B, 3rd Floor, Banke Bihari Kunj, Mithapur",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "postalCode": "800001",
      "addressCountry": "IN"
    },
    "hasMap": CANONICAL_LINKS.gbp,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.611,
      "longitude": 85.144
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    "areaServed": [
      { "@type": "City", "name": "Patna" },
      { "@type": "AdministrativeArea", "name": "Boring Road, Patna" },
      { "@type": "AdministrativeArea", "name": "Kankarbagh, Patna" },
      { "@type": "AdministrativeArea", "name": "Patliputra Colony, Patna" },
      { "@type": "AdministrativeArea", "name": "Bailey Road, Patna" },
      { "@type": "AdministrativeArea", "name": "Rajendra Nagar, Patna" },
      { "@type": "AdministrativeArea", "name": "Ashiana Nagar, Patna" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": CANONICAL_LINKS.phone,
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["Hindi", "English"]
    },
    "sameAs": [
      CANONICAL_LINKS.facebook,
      CANONICAL_LINKS.instagram
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Home Tuition and Private Tutoring in Patna",
    "serviceType": "Home Tutoring",
    "provider": {
      "@id": "https://swatihometuition.in/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "Patna"
    },
    "description": "Verified home tutors for Class 1 to 12 (CBSE, ICSE, Bihar Board), IIT-JEE, and NEET in Patna with strict female student safety protocols.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "2500",
      "highPrice": "12000"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
