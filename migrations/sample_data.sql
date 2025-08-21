-- Sample data for AI M&A Intelligence Platform

-- Insert sample companies
INSERT INTO companies (name, industry, founding_year, headquarters, employee_count, funding_stage) VALUES
('OpenAI', 'Artificial Intelligence', 2015, 'San Francisco, CA', 500, 'Series C'),
('Anthropic', 'Artificial Intelligence', 2021, 'San Francisco, CA', 200, 'Series B'),
('DeepMind', 'Artificial Intelligence', 2010, 'London, UK', 1000, 'Acquired'),
('Microsoft', 'Technology', 1975, 'Redmond, WA', 220000, 'Public'),
('Google', 'Technology', 1998, 'Mountain View, CA', 180000, 'Public'),
('DataRobot', 'Machine Learning', 2012, 'Boston, MA', 2000, 'Series G'),
('H2O.ai', 'Machine Learning', 2012, 'Mountain View, CA', 500, 'Series D');

-- Insert sample deals
INSERT INTO deals (buyer_id, target_id, announced_date, deal_value, deal_type, deal_status, ai_focus_area, strategic_rationale) VALUES
(4, 1, '2023-01-01', 10000000000.00, 'acquisition', 'pending', 'Large Language Models', 'Strategic investment in generative AI capabilities'),
(5, 3, '2014-01-26', 500000000.00, 'acquisition', 'completed', 'Deep Learning', 'Acquire world-class AI research team and technology');

-- Insert sample advisors
INSERT INTO advisors (name, type) VALUES
('Goldman Sachs', 'investment_bank'),
('Morgan Stanley', 'investment_bank'),
('Wilson Sonsini', 'law_firm'),
('Cooley LLP', 'law_firm');

-- Insert sample deal advisor relationships
INSERT INTO deal_advisors (deal_id, advisor_id, role) VALUES
(1, 1, 'buyer_advisor'),
(1, 3, 'buyer_advisor'),
(2, 2, 'buyer_advisor'),
(2, 4, 'seller_advisor');