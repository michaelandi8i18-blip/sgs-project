import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    // Check if already seeded
    const existingAdmin = await db.user.findUnique({ where: { username: 'admin' } });
    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database sudah di-seed',
        data: { admin: existingAdmin }
      });
    }

    // Create default admin
    const hashedPassword = await hashPassword('admin123');
    const admin = await db.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        nama: 'Administrator',
        role: 'admin',
        email: 'admin@sgs.com',
      }
    });

    // Create sample user
    const userPassword = await hashPassword('user123');
    const sampleUser = await db.user.create({
      data: {
        username: 'krani1',
        password: userPassword,
        nama: 'Krani Divisi 1',
        role: 'user',
        email: 'krani1@sgs.com',
      }
    });

    // Create divisi
    const divisi1 = await db.divisi.create({
      data: { kode: '1', nama: 'Divisi 1', deskripsi: 'Divisi Pertama' }
    });
    const divisi2 = await db.divisi.create({
      data: { kode: '2', nama: 'Divisi 2', deskripsi: 'Divisi Kedua' }
    });
    const divisi3 = await db.divisi.create({
      data: { kode: '3', nama: 'Divisi 3', deskripsi: 'Divisi Ketiga' }
    });

    // Create kemandoran
    await db.kemandoran.createMany({
      data: [
        { kode: 'A', nama: 'Kemandoran A', divisiId: divisi1.id },
        { kode: 'B', nama: 'Kemandoran B', divisiId: divisi2.id },
        { kode: 'C', nama: 'Kemandoran C', divisiId: divisi3.id },
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Database berhasil di-seed',
      data: {
        admin: { ...admin, password: '[HIDDEN]' },
        sampleUser: { ...sampleUser, password: '[HIDDEN]' },
        divisi: [divisi1, divisi2, divisi3]
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Gagal seed database' }, { status: 500 });
  }
}
