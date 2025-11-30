import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { mockOpportunities } from '../../../data/mockOpportunities';
import { parseQuery } from '../../../lib/search/queryParser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { q = '', agency, department, naics, setAside, noticeType, valueMin, valueMax, onlyActive, page = 1, pageSize = 20 } =
    req.query;

  try {
    const parsed = parseQuery(String(q));
    const conditions: any = {
      where: {
        AND: [
          parsed.text ? { title: { contains: parsed.text, mode: 'insensitive' } } : {},
          agency ? { agency: { contains: String(agency), mode: 'insensitive' } } : {},
          department ? { department: { contains: String(department), mode: 'insensitive' } } : {},
          naics ? { naicsCodes: { has: String(naics) } } : {},
          setAside ? { setAside: { contains: String(setAside), mode: 'insensitive' } } : {},
          noticeType ? { noticeType: { equals: String(noticeType) } } : {},
          valueMin ? { estimatedValueMin: { gte: Number(valueMin) } } : {},
          valueMax ? { estimatedValueMax: { lte: Number(valueMax) } } : {},
          onlyActive === 'true' ? { status: 'Open' } : {},
          parsed.filters.agency ? { agency: { contains: parsed.filters.agency, mode: 'insensitive' } } : {},
          parsed.filters.naics ? { naicsCodes: { has: String(parsed.filters.naics) } } : {},
          parsed.filters.value?.['>'] ? { estimatedValueMax: { gte: Number(parsed.filters.value['>']) } } : {},
          parsed.filters.value?.['<'] ? { estimatedValueMin: { lte: Number(parsed.filters.value['<']) } } : {},
          parsed.filters.deadline?.['<'] ? { responseDeadline: { lte: new Date(parsed.filters.deadline['<']) } } : {},
        ]
      },
      orderBy: { postedDate: 'desc' },
      take: Number(pageSize),
      skip: (Number(page) - 1) * Number(pageSize)
    };

    let results = [];
    let total = 0;
    try {
      [results, total] = await Promise.all([
        prisma.opportunity.findMany(conditions),
        prisma.opportunity.count({ where: conditions.where })
      ]);
    } catch (err) {
      const filtered = mockOpportunities.filter((opp) => opp.title.toLowerCase().includes(String(q).toLowerCase()));
      results = filtered.slice(0, Number(pageSize));
      total = filtered.length;
    }

    const facets = {
      agencies: Object.entries(
        results.reduce((acc: Record<string, number>, opp: any) => {
          acc[opp.agency] = (acc[opp.agency] || 0) + 1;
          return acc;
        }, {})
      ),
      setAsides: Object.entries(
        results.reduce((acc: Record<string, number>, opp: any) => {
          if (!opp.setAside) return acc;
          acc[opp.setAside] = (acc[opp.setAside] || 0) + 1;
          return acc;
        }, {})
      ),
      noticeTypes: Object.entries(
        results.reduce((acc: Record<string, number>, opp: any) => {
          acc[opp.noticeType] = (acc[opp.noticeType] || 0) + 1;
          return acc;
        }, {})
      )
    };

    return res.status(200).json({ data: results, total, page: Number(page), pageSize: Number(pageSize), facets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to search opportunities' });
  }
}
