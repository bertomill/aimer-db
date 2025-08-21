-- AI M&A Intelligence Platform Database Schema

-- Companies table (both buyers and targets)
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    founding_year INTEGER,
    headquarters VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    employee_count INTEGER,
    funding_stage VARCHAR(50),
    total_funding_raised DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals table (M&A transactions)
CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES companies(id),
    target_id INTEGER REFERENCES companies(id),
    announced_date DATE,
    closed_date DATE,
    deal_value DECIMAL(15,2),
    deal_type VARCHAR(50), -- acquisition, merger, asset_purchase
    deal_status VARCHAR(50), -- pending, completed, cancelled
    ai_focus_area VARCHAR(100), -- NLP, computer_vision, robotics, etc.
    strategic_rationale TEXT,
    revenue_multiple DECIMAL(8,2),
    ebitda_multiple DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deal advisors (investment banks, legal firms)
CREATE TABLE advisors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- investment_bank, law_firm, consulting
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deal advisor relationships
CREATE TABLE deal_advisors (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    advisor_id INTEGER REFERENCES advisors(id),
    role VARCHAR(50), -- buyer_advisor, seller_advisor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for access control
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer', -- admin, analyst, viewer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Deal patterns and analytics
CREATE TABLE deal_patterns (
    id SERIAL PRIMARY KEY,
    pattern_name VARCHAR(255) NOT NULL,
    pattern_type VARCHAR(100), -- valuation_trend, industry_consolidation, etc.
    description TEXT,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    identified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deals_analyzed INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_deals_announced_date ON deals(announced_date);
CREATE INDEX idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX idx_deals_target_id ON deals(target_id);
CREATE INDEX idx_deals_ai_focus_area ON deals(ai_focus_area);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_name ON companies(name);