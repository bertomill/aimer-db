import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

interface StatsResponse {
  totalDeals: number;
  totalDealValue: number;
  totalCompanies: number;
  mostActiveBuyer: { name: string; deal_count: string } | null;
}

export async function GET() {
  try {
    const stats: StatsResponse = {
      totalDeals: 0,
      totalDealValue: 0,
      totalCompanies: 0,
      mostActiveBuyer: null
    };
    
    // Total deals
    const dealsCount = await pool.query('SELECT COUNT(*) FROM deals');
    stats.totalDeals = parseInt(dealsCount.rows[0].count);
    
    // Total deal value
    const dealValue = await pool.query('SELECT SUM(deal_value) as total FROM deals');
    stats.totalDealValue = dealValue.rows[0].total || 0;
    
    // Companies count
    const companiesCount = await pool.query('SELECT COUNT(*) FROM companies');
    stats.totalCompanies = parseInt(companiesCount.rows[0].count);
    
    // Most active buyer
    const activeBuyer = await pool.query(`
      SELECT c.name, COUNT(*) as deal_count
      FROM deals d
      JOIN companies c ON d.buyer_id = c.id
      GROUP BY c.name
      ORDER BY deal_count DESC
      LIMIT 1
    `);
    stats.mostActiveBuyer = activeBuyer.rows[0] || null;
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}