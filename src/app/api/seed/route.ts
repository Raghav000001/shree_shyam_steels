import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { uploadImage } from '@/lib/cloudinary';
import { errorResponse, successResponse, requireAdmin } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

const IMAGE_MAP: Record<string, string[]> = {
  'service_material_1778761584582.png': [
    'Shafts',
    'Bush Pin',
    'Long Pin',
  ],
};

export async function POST(request: Request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();

    const existing = await Product.countDocuments();
    if (existing > 0) {
      await Product.deleteMany({});
    }

    const imagesDir = path.join(process.cwd(), 'public/images');
    const allProducts: { title: string; src: string }[] = [];

    for (const [filename, titles] of Object.entries(IMAGE_MAP)) {
      const filePath = path.join(imagesDir, filename);

      if (!fs.existsSync(filePath)) {
        console.warn(`Image not found: ${filename}, skipping...`);
        continue;
      }

      const buffer = fs.readFileSync(filePath);
      const cloudinaryUrl = await uploadImage(buffer);

      for (const title of titles) {
        allProducts.push({ title, src: cloudinaryUrl });
      }
    }

    const created = await Product.insertMany(allProducts);

    return successResponse(
      {
        message: `Seeded ${created.length} products`,
        products: created.map((p) => ({ _id: p._id, title: p.title })),
      },
      200
    );
  } catch (error) {
    console.error('Seed error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Seed failed',
      500
    );
  }
}
