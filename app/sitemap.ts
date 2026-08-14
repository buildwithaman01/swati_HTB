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

  return [...routes, ...programs];
}
