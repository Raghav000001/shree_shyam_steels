import type { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import { ProductCategory } from '@/models/ProductCategory';
import ProductsClient from './ProductsClient';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const PRODUCTS_DIR = path.join(process.cwd(), 'public/products');

/** Read public/products/ and group image files by category slug prefix. */
function getLocalProductImages(): Record<string, string[]> {
  const images: Record<string, string[]> = {};
  try {
    const files = fs
      .readdirSync(PRODUCTS_DIR)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
    for (const file of files) {
      const match = file.match(/^(.*?)(\d+)\.\w+$/);
      if (!match) continue;
      const prefix = match[1];
      const slug = prefix.replace(/_/g, '-').toLowerCase();
      if (!images[slug]) images[slug] = [];
      images[slug].push(`/products/${file}`);
    }
  } catch {
    /* directory may not exist */
  }
  return images;
}

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  images: string[];
}

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Explore our range of precision-engineered components — Bush Pin, Long Pin, and Shaft. High-quality CNC turned parts by Shree Shyam Precision.',
  openGraph: {
    title: 'Products | Shree Shyam Precision',
    description:
      'Precision CNC turned components — Bush Pin, Long Pin, Shaft and more from Shree Shyam Precision.',
  },
};

async function getCategories(): Promise<CategoryData[]> {
  try {
    await connectDB();
    const categories = await ProductCategory.find({ isActive: true })
      .sort({ name: 1 })
      .select('name slug coverImage images')
      .lean();
    return categories.map((c) => ({
      _id: (c._id as { toString(): string }).toString(),
      name: c.name,
      slug: c.slug,
      coverImage: c.coverImage,
      images: c.images,
    }));
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const categories = await getCategories();
  const localImages = getLocalProductImages();
  return <ProductsClient categories={categories} localImages={localImages} />;
}
