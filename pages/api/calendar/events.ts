import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const organizationId = Number(req.query.organizationId || 1);
  if (req.method === 'GET') {
    const events = await prisma.calendarEventStub.findMany({ where: { organizationId }, orderBy: { start: 'asc' } });
    return res.status(200).json({ events });
  }

  if (req.method === 'POST') {
    const { title, start, end, source = 'MANUAL' } = req.body;
    const event = await prisma.calendarEventStub.create({
      data: { organizationId, title, start: new Date(start), end: new Date(end), source }
    });
    return res.status(200).json({ event });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
