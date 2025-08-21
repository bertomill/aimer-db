'use client';

import { useState, useEffect } from 'react';
import { Company, Deal, Stats } from '@/types';

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<'deals' | 'companies'>('deals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, dealsRes, companiesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/deals'),
        fetch('/api/companies')
      ]);

      const [statsData, dealsData, companiesData] = await Promise.all([
        statsRes.ok ? statsRes.json() : null,
        dealsRes.ok ? dealsRes.json() : [],
        companiesRes.ok ? companiesRes.json() : []
      ]);

      setStats(statsData);
      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDeals([]);
      setCompanies([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (!value) return 'Undisclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🤖 AI M&A Intelligence Platform
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-gray-600 text-sm mb-2">Total Deals</div>
            <div className="text-3xl font-bold text-gray-800">
              {stats?.totalDeals || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-gray-600 text-sm mb-2">Total Deal Value</div>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(stats?.totalDealValue || 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-gray-600 text-sm mb-2">Companies Tracked</div>
            <div className="text-3xl font-bold text-gray-800">
              {stats?.totalCompanies || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-gray-600 text-sm mb-2">Most Active Buyer</div>
            <div className="text-3xl font-bold text-gray-800">
              {stats?.mostActiveBuyer?.name || 'N/A'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'deals'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Deals
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'companies'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Companies
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'deals' ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent M&A Deals</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold">Date</th>
                      <th className="text-left py-4 px-4 font-semibold">Buyer</th>
                      <th className="text-left py-4 px-4 font-semibold">Target</th>
                      <th className="text-left py-4 px-4 font-semibold">Deal Value</th>
                      <th className="text-left py-4 px-4 font-semibold">Type</th>
                      <th className="text-left py-4 px-4 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 font-semibold">AI Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((deal) => (
                      <tr key={deal.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">{formatDate(deal.announced_date)}</td>
                        <td className="py-4 px-4 font-semibold">{deal.buyer_name}</td>
                        <td className="py-4 px-4">{deal.target_name}</td>
                        <td className="py-4 px-4 font-semibold text-green-600">
                          {formatCurrency(deal.deal_value)}
                        </td>
                        <td className="py-4 px-4">{deal.deal_type || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              deal.deal_status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {deal.deal_status}
                          </span>
                        </td>
                        <td className="py-4 px-4">{deal.ai_focus_area || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6">AI Companies</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold">Company</th>
                      <th className="text-left py-4 px-4 font-semibold">Industry</th>
                      <th className="text-left py-4 px-4 font-semibold">Founded</th>
                      <th className="text-left py-4 px-4 font-semibold">Headquarters</th>
                      <th className="text-left py-4 px-4 font-semibold">Employees</th>
                      <th className="text-left py-4 px-4 font-semibold">Funding Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4 font-semibold">{company.name}</td>
                        <td className="py-4 px-4">{company.industry || 'N/A'}</td>
                        <td className="py-4 px-4">{company.founding_year || 'N/A'}</td>
                        <td className="py-4 px-4">{company.headquarters || 'N/A'}</td>
                        <td className="py-4 px-4">{company.employee_count || 'N/A'}</td>
                        <td className="py-4 px-4">{company.funding_stage || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
