import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { decodeTokenFromReq } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = decodeTokenFromReq(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const searches = await prisma.savedSearch.findMany({ where: { userId: user.userId } });
      return res.status(200).json({ data: searches });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load searches' });
    }
  }

  if (req.method === 'POST') {
    const { name, query, filters, frequency } = req.body;
    try {
      const search = await prisma.savedSearch.create({
        data: {
          name,
          query,
          filters: filters || {},
          frequency: (frequency || 'DAILY').toUpperCase(),
          userId: user.userId,
          organizationId: user.organizationId || 1
        }
      });
      return res.status(200).json({ data: search });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create saved search' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
