import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { decodeTokenFromReq } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = decodeTokenFromReq(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { opportunityId, title, sections } = req.body;
    try {
      const draft = await prisma.proposalDraft.create({
        data: { opportunityId, title, sections: sections || [], userId: user.userId, status: 'Draft' }
      });
      return res.status(200).json({ data: draft });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create proposal draft' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
