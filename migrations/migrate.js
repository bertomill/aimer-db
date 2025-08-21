const fs = require('fs');
const path = require('path');
const { pool } = require('../db');

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schemaSql);
    console.log('✓ Schema created successfully');
    
    // Insert sample data if needed
    const sampleDataPath = path.join(__dirname, 'sample_data.sql');
    if (fs.existsSync(sampleDataPath)) {
      const sampleSql = fs.readFileSync(sampleDataPath, 'utf8');
      await pool.query(sampleSql);
      console.log('✓ Sample data inserted');
    }
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };