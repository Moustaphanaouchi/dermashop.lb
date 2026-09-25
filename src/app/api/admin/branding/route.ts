import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { logoUrl } = await req.json();
  const branding = await prisma.branding.upsert({
    where: { id: 'single' },
    update: { logoUrl },
    create: { id: 'single', logoUrl },
  });
  return NextResponse.json(branding);
}