import { connectDB } from '@/lib/mongodb';
import { ProductCategory } from '@/models/ProductCategory';
import { errorResponse, successResponse } from '@/lib/api-helpers';

export async function GET() {
  try {
    await connectDB();

    const categories = await ProductCategory.find({ isActive: true })
      .sort({ name: 1 })
      .select('name slug coverImage images')
      .lean();

    return successResponse(categories, 200);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}
