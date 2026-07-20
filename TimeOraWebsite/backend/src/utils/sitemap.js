import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const generateSitemapXml = async (hostUrl = 'https://tickora.vercel.app') => {
  try {
    const products = await Product.find({}).select('slug updatedAt');
    const categories = await Category.find({}).select('slug updatedAt');

    const staticUrls = [
      '',
      '/shop',
      '/about',
      '/contact',
      '/faq',
      '/shipping-policy',
      '/return-policy',
      '/privacy-policy',
      '/terms-conditions'
    ];

    const staticXml = staticUrls.map(url => `
      <url>
        <loc>${hostUrl}${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url === '' ? '1.0' : '0.8'}</priority>
      </url>
    `).join('');

    const productXml = products.map(p => `
      <url>
        <loc>${hostUrl}/products/${p.slug}</loc>
        <lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('');

    const categoryXml = categories.map(c => `
      <url>
        <loc>${hostUrl}/shop?category=${c.slug}</loc>
        <lastmod>${new Date(c.updatedAt).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
      </url>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticXml}
      ${productXml}
      ${categoryXml}
    </urlset>
    `;
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    throw error;
  }
};
