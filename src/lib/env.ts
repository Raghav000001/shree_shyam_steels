/**
 * Environment variable validation.
 * Throws at startup if required variables are missing — fails fast.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Please set it in your .env.local or Vercel environment variables.`
    );
  }
  return value.trim();
}

function optionalEnv(name: string, defaultValue: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : defaultValue;
}

export const ENV = {
  SMTP_HOST: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
  SMTP_USER: optionalEnv('SMTP_USER', ''),
  SMTP_PASS: optionalEnv('SMTP_PASS', ''),
  CONTACT_EMAIL: optionalEnv('CONTACT_EMAIL', 'md@shreeshyamprecision'),

  MONGODB_URI: requireEnv('MONGODB_URI'),

  CLOUDINARY_CLOUD_NAME: requireEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: requireEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: requireEnv('CLOUDINARY_API_SECRET'),

  ADMIN_API_KEY: optionalEnv('ADMIN_API_KEY', ''),

  SITE_URL: optionalEnv('SITE_URL', 'https://shreeshyamprecision.com'),
} as const;
