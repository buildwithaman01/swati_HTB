import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/admin/*',
          '/portal',
          '/portal/',
          '/portal/*',
          '/teacher/dashboard',
          '/teacher/dashboard/',
          '/teacher/dashboard/*',
          '/private/',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Google-Extended',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot',
          'Bingbot',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/portal/',
          '/teacher/dashboard/',
        ],
      },
    ],
    sitemap: 'https://swatihometuition.in/sitemap.xml',
  };
}
