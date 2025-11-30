import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { mockOpportunities } from '../../../../data/mockOpportunities';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let opportunity = null;
    try {
      opportunity = await prisma.opportunity.findUnique({ where: { id } });
    } catch (err) {
      opportunity = mockOpportunities.find((item) => item.id === id) || null;
    }

    if (!opportunity) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ data: opportunity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
}
