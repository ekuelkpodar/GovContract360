import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { recommendBidDecision } from '../../../lib/ai';
import { computeFitScore, computeRiskScore } from '../../../lib/scoring';
import { withErrorHandling } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { opportunityId, context } = req.body;
    if (!opportunityId) return res.status(400).json({ error: 'Missing opportunityId' });

    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const profile = await prisma.companyProfile.findFirst({ where: { organizationId: user.organizationId || undefined } });
    const fitScore = computeFitScore(opportunity, profile);
    const riskScore = computeRiskScore(opportunity, profile);
    const summary = profile
      ? `${profile.companyName} focusing on ${profile.primaryNaics || 'varied'} with keywords ${profile.keywords.join(', ')}`
      : 'Generic federal contractor';

    const recommendation = await recommendBidDecision({
      opportunity,
      companyProfileSummary: summary,
      riskScore,
      fitScore,
      context
    });

    await prisma.savedOpportunity.upsert({
      where: { userId_opportunityId: { userId: user.id, opportunityId: opportunity.id } },
      update: { fitScore, riskScore, lastEvaluatedAt: new Date(), organizationId: user.organizationId || undefined },
      create: {
        userId: user.id,
        organizationId: user.organizationId || 1,
        opportunityId: opportunity.id,
        status: 'Evaluating',
        fitScore,
        riskScore,
        lastEvaluatedAt: new Date()
      }
    });

    return res.status(200).json({ recommendation, fitScore, riskScore });
  });
}
