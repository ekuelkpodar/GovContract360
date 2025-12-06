import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { mockOpportunities } from '../../../data/mockOpportunities';

type QueryParams = {
  q: string;
  agency?: string;
  department?: string;
  naics?: string;
  setAside?: string;
  noticeType?: string;
  valueMin?: number;
  valueMax?: number;
  onlyActive?: boolean;
};

function toStringParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function toNumberParam(value: string | string[] | undefined): number | undefined {
  const strValue = toStringParam(value).trim();
  const parsed = strValue ? Number(strValue) : undefined;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeQuery(req: NextApiRequest): QueryParams {
  const { q, agency, department, naics, setAside, noticeType, valueMin, valueMax, onlyActive } = req.query;
  return {
    q: toStringParam(q),
    agency: toStringParam(agency) || undefined,
    department: toStringParam(department) || undefined,
    naics: toStringParam(naics) || undefined,
    setAside: toStringParam(setAside) || undefined,
    noticeType: toStringParam(noticeType) || undefined,
    valueMin: toNumberParam(valueMin),
    valueMax: toNumberParam(valueMax),
    onlyActive: toStringParam(onlyActive) === 'true'
  };
}

function matchesFilters(opportunity: any, filters: QueryParams): boolean {
  const term = filters.q?.toLowerCase();
  if (term) {
    const text = `${opportunity.title} ${opportunity.description || ''}`.toLowerCase();
    if (!text.includes(term)) return false;
  }

  if (filters.agency && !opportunity.agency?.toLowerCase().includes(filters.agency.toLowerCase())) return false;
  if (filters.department && !opportunity.department?.toLowerCase().includes(filters.department.toLowerCase())) return false;
  if (filters.naics && !opportunity.naicsCodes?.includes(filters.naics)) return false;
  if (filters.setAside && !opportunity.setAside?.toLowerCase().includes(filters.setAside.toLowerCase())) return false;
  if (filters.noticeType && opportunity.noticeType !== filters.noticeType) return false;
  if (filters.valueMin !== undefined && (opportunity.estimatedValueMin ?? 0) < filters.valueMin) return false;
  if (filters.valueMax !== undefined && (opportunity.estimatedValueMax ?? 0) > filters.valueMax) return false;
  if (filters.onlyActive && opportunity.status !== 'Open') return false;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const filters = normalizeQuery(req);

  try {
    const conditions: any = {
      where: {
        AND: [
          filters.q
            ? {
                OR: [
                  { title: { contains: filters.q, mode: 'insensitive' } },
                  { description: { contains: filters.q, mode: 'insensitive' } }
                ]
              }
            : {},
          filters.agency ? { agency: { contains: filters.agency, mode: 'insensitive' } } : {},
          filters.department ? { department: { contains: filters.department, mode: 'insensitive' } } : {},
          filters.naics ? { naicsCodes: { has: filters.naics } } : {},
          filters.setAside ? { setAside: { contains: filters.setAside, mode: 'insensitive' } } : {},
          filters.noticeType ? { noticeType: { equals: filters.noticeType } } : {},
          filters.valueMin !== undefined ? { estimatedValueMin: { gte: filters.valueMin } } : {},
          filters.valueMax !== undefined ? { estimatedValueMax: { lte: filters.valueMax } } : {},
          filters.onlyActive ? { status: 'Open' } : {}
        ]
      },
      orderBy: { postedDate: 'desc' },
      take: 30
    };

    let results = [];
    try {
      results = await prisma.opportunity.findMany(conditions);
    } catch (err) {
      results = mockOpportunities.filter((opp) => matchesFilters(opp, filters));
    }

    return res.status(200).json({ data: results, total: results.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to search opportunities' });
  }
}
