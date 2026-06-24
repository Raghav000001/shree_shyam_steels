import { connectDB } from '@/lib/mongodb';
import { ProductCategory } from '@/models/ProductCategory';
import { uploadImage } from '@/lib/cloudinary';
import { successResponse } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

const PRODUCTS_DIR = path.join(process.cwd(), 'public/products');

interface CategoryDef {
  name: string;
  slug: string;
  imagePaths: string[];
}

function discoverCategories(): CategoryDef[] {
  const entries = fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true });
  const categories: CategoryDef[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dirPath = path.join(PRODUCTS_DIR, entry.name);
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
    if (files.length === 0) continue;

    const slug = entry.name.replace(/_/g, '-').toLowerCase();
    const name = entry.name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    categories.push({
      name: name === 'Longpin' ? 'Long Pin' : name,
      slug: slug === 'longpin' ? 'long-pin' : slug,
      imagePaths: files.map((f) => path.join(dirPath, f)),
    });
  }

  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Convert a filesystem image path under public/products/ to a browser URL.
 * E.g. /absolute/path/public/products/bush_pin/one.jpeg → /products/bush_pin/one.jpeg
 */
function localUrl(filePath: string): string {
  const rel = path.relative(PRODUCTS_DIR, filePath);
  return '/products/' + rel.split(path.sep).join('/');
}

export async function POST() {
  const categories = discoverCategories();
  const seeded: { name: string; slug: string; urls: string[]; cloudinary: boolean }[] = [];

  await connectDB();

  let usedCloudinary = false;

  for (const cat of categories) {
    const urls: string[] = [];
    let catUsedCloudinary = false;

    for (const filePath of cat.imagePaths) {
      const buffer = fs.readFileSync(filePath);
      let url: string | null = null;
      try {
        url = await uploadImage(buffer);
        catUsedCloudinary = true;
      } catch {
        /* Cloudinary unavailable — fall back to local serving path */
        url = localUrl(filePath);
      }
      urls.push(url);
    }

    if (catUsedCloudinary) usedCloudinary = true;

    await ProductCategory.findOneAndUpdate(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          slug: cat.slug,
          coverImage: urls[0],
          images: urls.slice(1),
          isActive: true,
        },
      },
      { upsert: true }
    );

    seeded.push({ name: cat.name, slug: cat.slug, urls, cloudinary: catUsedCloudinary });
  }

  const count = await ProductCategory.countDocuments();

  return successResponse({
    message: `Seeded ${seeded.length} categories (${count} total in DB)`,
    seeded,
    note: usedCloudinary
      ? 'Some or all images on Cloudinary'
      : 'Using local paths (Cloudinary upload unavailable). Images in /public/products/ are being served directly.',
  });
}
