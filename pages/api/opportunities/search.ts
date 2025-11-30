import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { mockOpportunities } from '../../../data/mockOpportunities';
import { parseQuery } from '../../../lib/search/queryParser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { q = '', agency, department, naics, setAside, noticeType, valueMin, valueMax, onlyActive, page = 1, pageSize = 20 } =
    req.query;
  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSizeNumber = Math.max(1, Math.min(100, Number(pageSize) || 20));

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
      take: pageSizeNumber,
      skip: (pageNumber - 1) * pageSizeNumber
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
      results = filtered.slice((pageNumber - 1) * pageSizeNumber, pageNumber * pageSizeNumber);
      total = filtered.length;
    }

    // Facets should reflect the full result set, not just the current page. Fall back to current page counts if grouping fails.
    let facets = { agencies: [] as any[], setAsides: [] as any[], noticeTypes: [] as any[] };
    try {
      const [agencyBuckets, setAsideBuckets, noticeBuckets] = await Promise.all([
        prisma.opportunity.groupBy({ by: ['agency'], where: conditions.where, _count: { _all: true } }),
        prisma.opportunity.groupBy({ by: ['setAside'], where: conditions.where, _count: { _all: true } }),
        prisma.opportunity.groupBy({ by: ['noticeType'], where: conditions.where, _count: { _all: true } })
      ]);
      facets = {
        agencies: agencyBuckets.map((bucket) => [bucket.agency, bucket._count._all]),
        setAsides: setAsideBuckets
          .filter((bucket) => bucket.setAside)
          .map((bucket) => [bucket.setAside, bucket._count._all]),
        noticeTypes: noticeBuckets.map((bucket) => [bucket.noticeType, bucket._count._all])
      };
    } catch (facetError) {
      console.warn('Facet grouping fallback due to prisma error', facetError);
      facets = {
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
    }

    return res.status(200).json({ data: results, total, page: pageNumber, pageSize: pageSizeNumber, facets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to search opportunities' });
  }
}
