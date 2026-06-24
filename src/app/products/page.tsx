import type { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import { ProductCategory } from '@/models/ProductCategory';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

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
  return <ProductsClient categories={categories} />;
}
