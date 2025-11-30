import { prisma } from '../prisma';

export async function getPipelineSummary(organizationId: number) {
  const grouped = await prisma.savedOpportunity.groupBy({
    by: ['status'],
    where: { organizationId },
    _count: { _all: true },
    _avg: { estimatedValueMax: true }
  });
  return grouped;
}

export async function getPipelineTrend(organizationId: number, rangeMonths = 6) {
  const since = new Date();
  since.setMonth(since.getMonth() - rangeMonths);
  const data = await prisma.opportunityStatusEvent.findMany({
    where: { savedOpportunity: { organizationId }, changedAt: { gte: since } },
    orderBy: { changedAt: 'asc' }
  });
  return data;
}
