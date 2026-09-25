import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi'];
const MAX_BYTES = 15 * 1024 * 1024;

export async function uploadToCloudinary(dataUri: string, folder = 'dermashop') {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'auto',
    allowed_formats: ALLOWED,
    max_bytes: MAX_BYTES,
  });
  return { url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image' };
}