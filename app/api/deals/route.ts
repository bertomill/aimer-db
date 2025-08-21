import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        d.*,
        b.name as buyer_name,
        t.name as target_name
      FROM deals d
      LEFT JOIN companies b ON d.buyer_id = b.id
      LEFT JOIN companies t ON d.target_id = t.id
      ORDER BY d.announced_date DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}