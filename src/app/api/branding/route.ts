import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const branding = await prisma.branding.findUnique({ where: { id: 'single' } });
  return NextResponse.json({ logoUrl: branding?.logoUrl ?? null });
}