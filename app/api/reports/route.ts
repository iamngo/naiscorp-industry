import { NextResponse } from 'next/server';
import { mockReportHighlights, mockBuyerLeads, mockInvestorDeals, mockSuppliers } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      highlights: mockReportHighlights,
      buyerLeadCount: mockBuyerLeads.length,
      investorPipelineCount: mockInvestorDeals.length,
      strategicSuppliers: mockSuppliers.filter((supplier) => supplier.isStrategicPartner).length,
      generatedAt: new Date().toISOString(),
    },
  });
}

