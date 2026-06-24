import mongoose, { Schema, Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  slug: string;
  coverImage: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [200, 'Name must be under 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProductCategorySchema.index({ isActive: 1 });

export const ProductCategory =
  mongoose.models.ProductCategory ||
  mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);
