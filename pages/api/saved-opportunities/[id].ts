import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { decodeTokenFromReq } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const savedId = Number(req.query.id);
  const user = decodeTokenFromReq(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { status, notes, priority } = req.body;
    const updated = await prisma.savedOpportunity.update({
      where: { id: savedId },
      data: { status, notes, priority }
    });
    return res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update saved opportunity' });
  }
}
