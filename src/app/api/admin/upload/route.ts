import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminRateLimit } from '@/lib/rate-limit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : (req.headers.get('x-real-ip') ?? '127.0.0.1');

  const { success } = await adminRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { dataUri } = await req.json();
    if (!dataUri || typeof dataUri !== 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse the data URI (e.g. data:image/png;base64,iVBORw0KGgo...)
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid data URI format' }, { status: 400 });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine file extension from MIME type
    const extension = contentType.split('/')[1]?.replace('+xml', '') || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const filePath = `products/${fileName}`;

    // Upload directly to the Supabase product-media bucket
    const { error: uploadError } = await supabase.storage
      .from('product-media')
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Retrieve the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-media')
      .getPublicUrl(filePath);

    // Return the URL matching Cloudinary's expected response structure
    return NextResponse.json({
      url: publicUrlData.publicUrl,
      secure_url: publicUrlData.publicUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}