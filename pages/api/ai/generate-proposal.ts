import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { generateProposalSections } from '../../../lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { opportunityId, userNotes } = req.body;
  if (!opportunityId) return res.status(400).json({ error: 'opportunityId is required' });

  try {
    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const sections = await generateProposalSections(opportunity, userNotes || '');
    return res.status(200).json({ sections });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate proposal' });
  }
}
