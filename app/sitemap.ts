import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://swatihometuition.in';

  // Static routes
  const routes = [
    '',
    '/book-demo',
    '/find-tutor',
    '/join',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Program routes
  const programs = [
    '/programs/jee-main-advanced',
    '/programs/neet-medical',
    '/programs/class-1-to-8-all-subjects',
    '/programs/class-9-10-foundation',
    '/programs/class-11-12-boards',
    '/programs/commerce-11-12',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // High priority for program pages
  }));

  // Areas
  const allAreas = [
    "AG Colony", "Agam Kuan", "Anandpuri", "Anisabad", "Ashiana Nagar", "Bailey Road", "Bazar Samiti", "Bhootnath Road", "Bihta", "Boring Canal Road", "Boring Road", "Bypass Road", "Chhajjubagh", "Danapur", "Digha", "Exhibition Road", "Frazer Road", "Gandhi Maidan", "Gardanibagh", "Gola Road", "Hanuman Nagar", "Indrapuri", "Jagdeo Path", "Kadamkuan", "Kankarbagh", "Khajpura", "Kumhrar", "Kurji", "Lohanipur", "Machhua Toli", "Mahendru", "Mithapur", "Patliputra Colony", "Patna City", "Phulwari Sharif", "Rajabazar", "Rajbanshi Nagar", "Rajendra Nagar", "Rajiv Nagar", "Ramkrishna Nagar", "Rupaspur", "Saguna More", "Sandalpur", "Shastri Nagar", "Sheikhpura", "Sipara", "Srikrishna Nagar", "Yarpur"
  ];
  
  const areaRoutes = [
    {
      url: `${baseUrl}/areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...allAreas.map((area) => ({
      url: `${baseUrl}/areas/${area.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  ];

  // Blogs
  const blogSlugs = [
    "how-to-find-best-home-tutor-in-patna",
    "jee-preparation-strategy-from-class-9",
    "importance-of-female-tutors-for-girls",
    "cbse-vs-icse-which-is-better-in-patna",
    "neet-preparation-strategy-home-tutors-patna",
    "home-tuition-vs-coaching-institutes-patna",
    "top-schools-in-patna-home-tuition-guide",
    "class-10-cbse-maths-science-blueprint-patna",
  ];

  const blogRoutes = [
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blogs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  ];

  return [...routes, ...programs, ...areaRoutes, ...blogRoutes];
}
