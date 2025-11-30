import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { withErrorHandling } from '../../../lib/logger';
import { computeFitScore, computeRiskScore } from '../../../lib/scoring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const searches = await prisma.savedSearch.findMany({
      where: { alerts: { some: { isActive: true } } },
      include: { alerts: true, user: { include: { organization: true } } }
    });

    const results = [] as { savedSearchId: number; matchesCount: number }[];

    for (const search of searches) {
      const opportunities = await prisma.opportunity.findMany({
        where: {
          title: { contains: search.query, mode: 'insensitive' }
        },
        take: 5
      });
      const profile = await prisma.companyProfile.findFirst({ where: { organizationId: search.organizationId } });
      opportunities.forEach((opp) => {
        const fitScore = computeFitScore(opp, profile || undefined);
        const riskScore = computeRiskScore(opp, profile || undefined);
        return prisma.savedOpportunity.upsert({
          where: { userId_opportunityId: { userId: search.userId, opportunityId: opp.id } },
          update: { fitScore, riskScore, organizationId: search.organizationId },
          create: {
            userId: search.userId,
            organizationId: search.organizationId,
            opportunityId: opp.id,
            status: 'Evaluating',
            fitScore,
            riskScore
          }
        });
      });

      await prisma.alertRunLog.create({
        data: {
          savedSearchId: search.id,
          organizationId: search.organizationId,
          matchesCount: opportunities.length
        }
      });
      results.push({ savedSearchId: search.id, matchesCount: opportunities.length });

      await prisma.savedSearch.update({ where: { id: search.id }, data: { lastRunAt: new Date() } });
    }

    return res.status(200).json({ runs: results });
  });
}
