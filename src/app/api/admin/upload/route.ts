import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { adminRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = req.ip ?? '127.0.0.1';
  const { success } = await adminRateLimit.limit(ip);
  if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const { dataUri } = await req.json();
    if (!dataUri || typeof dataUri !== 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const result = await uploadToCloudinary(dataUri);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}