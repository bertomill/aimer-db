const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all deals with company names
app.get('/api/deals', async (req, res) => {
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
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deal details with advisors
app.get('/api/deals/:id', async (req, res) => {
  try {
    const dealResult = await pool.query(`
      SELECT 
        d.*,
        b.name as buyer_name,
        t.name as target_name
      FROM deals d
      LEFT JOIN companies b ON d.buyer_id = b.id
      LEFT JOIN companies t ON d.target_id = t.id
      WHERE d.id = $1
    `, [req.params.id]);
    
    const advisorsResult = await pool.query(`
      SELECT 
        a.name,
        a.type,
        da.role
      FROM deal_advisors da
      JOIN advisors a ON da.advisor_id = a.id
      WHERE da.deal_id = $1
    `, [req.params.id]);
    
    res.json({
      deal: dealResult.rows[0],
      advisors: advisorsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {};
    
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
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});