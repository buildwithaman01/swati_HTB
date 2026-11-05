import { MetadataRoute } from 'next';
import { patnaAreas, slugify } from '@/lib/data/areas';
import { blogsData } from '@/lib/data/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://swatihometuition.in';

  // 1. Core static marketing & trust routes
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/find-tutor', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/book-demo', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/join', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/safety', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
  ].map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // 2. Academic Program routes
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
    priority: 0.9,
  }));

  // 3. Programmatic SEO Locality Landing Pages (90+ Patna Localities)
  const areaIndexRoute = {
    url: `${baseUrl}/areas`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  const areaRoutes = patnaAreas.map((area) => ({
    url: `${baseUrl}/areas/${slugify(area)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. In-Depth Academic Blogs & E-E-A-T Content
  const blogIndexRoute = {
    url: `${baseUrl}/blogs`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  const blogRoutes = blogsData.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.isoDate || post.date || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...programs,
    areaIndexRoute,
    ...areaRoutes,
    blogIndexRoute,
    ...blogRoutes,
  ];
}
