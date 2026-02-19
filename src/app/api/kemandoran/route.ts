import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const divisiId = searchParams.get('divisiId');

    const where: { isActive: boolean; divisiId?: string } = { isActive: true };
    if (divisiId) where.divisiId = divisiId;

    const kemandoran = await db.kemandoran.findMany({
      where,
      orderBy: { kode: 'asc' },
      include: {
        divisi: true,
        _count: { select: { tasks: true } }
      }
    });

    return NextResponse.json({ success: true, data: kemandoran });
  } catch (error) {
    console.error('Get kemandoran error:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data kemandoran' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { kode, nama, divisiId, deskripsi } = body;

    if (!kode || !nama || !divisiId) {
      return NextResponse.json({ success: false, error: 'Kode, nama, dan divisi harus diisi' }, { status: 400 });
    }

    const kemandoran = await db.kemandoran.create({
      data: { kode, nama, divisiId, deskripsi }
    });

    return NextResponse.json({ success: true, data: kemandoran });
  } catch (error) {
    console.error('Create kemandoran error:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat kemandoran' }, { status: 500 });
  }
}
