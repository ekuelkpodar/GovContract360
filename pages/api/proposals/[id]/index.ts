import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { decodeTokenFromReq } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  const user = decodeTokenFromReq(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const draft = await prisma.proposalDraft.findFirst({ where: { id, userId: user.userId } });
      if (!draft) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ data: draft });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load proposal' });
    }
  }

  if (req.method === 'PATCH') {
    const { title, sections, status } = req.body;
    try {
      const draft = await prisma.proposalDraft.update({
        where: { id },
        data: { title, sections, status }
      });
      return res.status(200).json({ data: draft });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update proposal' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
