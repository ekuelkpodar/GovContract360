import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const organizationId = Number(req.query.organizationId || 1);
  if (req.method === 'GET') {
    const views = await prisma.savedView.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ views });
  }
  if (req.method === 'POST') {
    const { name, config, userId = 1 } = req.body;
    const view = await prisma.savedView.create({ data: { name, config, userId, organizationId } });
    return res.status(200).json({ view });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
