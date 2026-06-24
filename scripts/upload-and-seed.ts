/**
 * Uploads product images to Cloudinary, then seeds ProductCategory collection.
 *
 * Run: npx tsx scripts/upload-and-seed.ts
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

/* ── Load .env manually ────────────────────────────── */

const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const {
  MONGODB_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = env;

if (!MONGODB_URI) throw new Error('MONGODB_URI is required in .env');
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary credentials are required in .env');
}

/* ── Configure Cloudinary ──────────────────────────── */

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/* ── Product images on disk ────────────────────────── */

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

    const slug = entry.name
      .replace(/_/g, '-')
      .toLowerCase();
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

/* ── Upload a single image ─────────────────────────── */

async function uploadImage(filePath: string): Promise<string | null> {
  try {
    return await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'shree_shyam_precision/products' },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('Upload returned no result'));
        }
      );
      fs.createReadStream(filePath).pipe(uploadStream);
    });
  } catch {
    return null;
  }
}

/** Convert filesystem path under public/products/ to browser URL */
function localUrl(filePath: string): string {
  const PRODUCTS_DIR = path.join(process.cwd(), 'public/products');
  const rel = path.relative(PRODUCTS_DIR, filePath);
  return '/products/' + rel.split(path.sep).join('/');
}

/* ── Mongoose Model ────────────────────────────────── */

const ProductCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    coverImage: { type: String, required: true },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductCategory =
  mongoose.models.ProductCategory ||
  mongoose.model('ProductCategory', ProductCategorySchema);

/* ── Main ──────────────────────────────────────────── */

async function main() {
  const categories = discoverCategories();

  console.log(`Found ${categories.length} categories on disk:`);
  for (const cat of categories) {
    console.log(`  ${cat.name} (${cat.slug}) — ${cat.imagePaths.length} images`);
  }

  /* Upload each category's images to Cloudinary (fall back to local paths) */
  const cloudinaryUrls: Record<string, string[]> = {};

  for (const cat of categories) {
    console.log(`\nUploading ${cat.name} images...`);
    const urls: string[] = [];

    for (let i = 0; i < cat.imagePaths.length; i++) {
      const filePath = cat.imagePaths[i];
      const fileName = path.basename(filePath);
      process.stdout.write(`  [${i + 1}/${cat.imagePaths.length}] ${fileName}... `);

      const url = await uploadImage(filePath);
      if (url) {
        urls.push(url);
        console.log(`✓ Cloudinary`);
      } else {
        const fallback = localUrl(filePath);
        urls.push(fallback);
        console.log(`→ local ${fallback}`);
      }
    }

    cloudinaryUrls[cat.slug] = urls;
  }

  /* Connect to MongoDB */
  console.log(`\nConnecting to MongoDB...`);
  await mongoose.connect(MONGODB_URI);

  /* Seed categories */
  for (const cat of categories) {
    const urls = cloudinaryUrls[cat.slug];
    if (!urls || urls.length === 0) {
      console.warn(`Skipping ${cat.name}: no images found`);
      continue;
    }

    const doc = {
      name: cat.name,
      slug: cat.slug,
      coverImage: urls[0],
      images: urls.slice(1),
      isActive: true,
    };

    await ProductCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: doc },
      { upsert: true }
    );

    console.log(`Seeded ${cat.name}: cover=${urls[0]}, ${urls.length - 1} additional images`);
  }

  const count = await ProductCategory.countDocuments();
  console.log(`\nDone! ${count} categories in MongoDB.`);
  console.log(`\n--- Cloudinary URLs ---`);
  for (const cat of categories) {
    const urls = cloudinaryUrls[cat.slug];
    if (urls) {
      console.log(`\n${cat.name}:`);
      console.log(`  coverImage: '${urls[0]}'`);
      for (let i = 1; i < urls.length; i++) {
        console.log(`  image ${i}: '${urls[i]}'`);
      }
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
