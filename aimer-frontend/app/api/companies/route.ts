// Import required modules
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * GET /api/companies
 * Fetches all companies from the database, ordered by name
 * @returns {Promise<NextResponse>} JSON response containing the list of companies or an error message
 */
export async function GET() {
  try {
    // Query the database to get all companies, ordered alphabetically by name
    const result = await pool.query('SELECT * FROM companies ORDER BY name');
    
    // Return the companies as a JSON response
    return NextResponse.json(result.rows);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching companies:', error);
    
    // Return a 500 error response if something goes wrong
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}