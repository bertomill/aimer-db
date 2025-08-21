export interface Company {
  id: number;
  name: string;
  industry: string;
  founding_year: number;
  headquarters: string;
  website?: string;
  description?: string;
  employee_count: number;
  funding_stage: string;
  total_funding_raised?: number;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: number;
  buyer_id: number;
  target_id: number;
  buyer_name: string;
  target_name: string;
  announced_date: string;
  closed_date?: string;
  deal_value: number;
  deal_type: string;
  deal_status: string;
  ai_focus_area: string;
  strategic_rationale?: string;
  revenue_multiple?: number;
  ebitda_multiple?: number;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  totalDeals: number;
  totalDealValue: number;
  totalCompanies: number;
  mostActiveBuyer: {
    name: string;
    deal_count: number;
  } | null;
}