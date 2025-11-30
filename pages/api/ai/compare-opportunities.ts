import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { compareOpportunities } from '../../../lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { opportunityIds = [], profileSummary = '' } = req.body;
  try {
    const opportunities = await prisma.opportunity.findMany({ where: { id: { in: opportunityIds } }, take: 5 });
    const analysis = await compareOpportunities(opportunities, profileSummary);
    res.status(200).json({ analysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to compare opportunities' });
  }
}
