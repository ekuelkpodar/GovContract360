import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { mockOpportunities } from '../../../data/mockOpportunities';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { q = '', agency, department, naics, setAside, noticeType, valueMin, valueMax, onlyActive } = req.query;

  try {
    const conditions: any = {
      where: {
        AND: [
          q ? { title: { contains: String(q), mode: 'insensitive' } } : {},
          agency ? { agency: { contains: String(agency), mode: 'insensitive' } } : {},
          department ? { department: { contains: String(department), mode: 'insensitive' } } : {},
          naics ? { naicsCodes: { has: String(naics) } } : {},
          setAside ? { setAside: { contains: String(setAside), mode: 'insensitive' } } : {},
          noticeType ? { noticeType: { equals: String(noticeType) } } : {},
          valueMin ? { estimatedValueMin: { gte: Number(valueMin) } } : {},
          valueMax ? { estimatedValueMax: { lte: Number(valueMax) } } : {},
          onlyActive === 'true' ? { status: 'Open' } : {}
        ]
      },
      orderBy: { postedDate: 'desc' },
      take: 30
    };

    let results = [];
    try {
      results = await prisma.opportunity.findMany(conditions);
    } catch (err) {
      results = mockOpportunities.filter((opp) => opp.title.toLowerCase().includes(String(q).toLowerCase()));
    }

    return res.status(200).json({ data: results, total: results.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to search opportunities' });
  }
}
