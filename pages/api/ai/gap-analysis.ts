import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { analyzeCapabilityGaps } from '../../../lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { opportunityId, companyProfileSummary } = req.body;
  try {
    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    const gaps = await analyzeCapabilityGaps(opportunity, companyProfileSummary || '');
    res.status(200).json({ gaps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to run gap analysis' });
  }
}
