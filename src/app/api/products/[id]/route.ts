import { connectDB } from '@/lib/mongodb';
import { ProductCategory } from '@/models/ProductCategory';
import { errorResponse, successResponse } from '@/lib/api-helpers';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;

    if (!slug || typeof slug !== 'string') {
      return errorResponse('Category slug is required', 400);
    }

    await connectDB();

    const category = await ProductCategory.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return errorResponse('Failed to fetch category', 500);
  }
}
