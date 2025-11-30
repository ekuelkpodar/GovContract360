import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { decodeTokenFromReq } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  const user = decodeTokenFromReq(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PATCH') {
    const { name, filters, frequency, isActive } = req.body;
    try {
      const updated = await prisma.savedSearch.update({
        where: { id },
        data: { name, filters, frequency }
      });
      if (typeof isActive === 'boolean') {
        await prisma.alertSubscription.updateMany({ where: { savedSearchId: id }, data: { isActive } });
      }
      return res.status(200).json({ data: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update saved search' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
