export default function Schema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Swati Home Tuition Bureau",
    "image": "https://swatihometuition.in/images/logo1.png",
    "@id": "https://swatihometuition.in",
    "url": "https://swatihometuition.in",
    "telephone": "+919229738307",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Block A, Area B, 3rd Floor, Banke Bihari Kunj, Mithapur",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "postalCode": "800001",
      "addressCountry": "IN"
    },
    "hasMap": "https://share.google/tarSWReEvLi7cim5V",
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
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61593236635791",
      "https://www.instagram.com/swatihtb"
    ]
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Swati Home Tuition Bureau",
    "url": "https://swatihometuition.in",
    "logo": "https://swatihometuition.in/images/logo1.png",
    "description": "Patna's leading home tuition bureau providing verified educators and a strict girls safety protocol.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Patna",
      "addressRegion": "Bihar",
      "addressCountry": "IN"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgSchema) }}
      />
    </>
  );
}
