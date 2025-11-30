import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { withErrorHandling } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    const user = await getCurrentUser(req);
    if (!user?.organizationId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const {
      companyName,
      website,
      size,
      primaryNaics,
      primaryPsc,
      capabilities,
      keywords,
      preferredAgencies,
      preferredSetAsides,
      preferredNoticeTypes,
      typicalValueMin,
      typicalValueMax,
      baseLocation,
      maxDistanceMiles
    } = req.body;

    const profile = await prisma.companyProfile.upsert({
      where: { organizationId: user.organizationId },
      update: {
        companyName,
        website,
        size,
        primaryNaics,
        primaryPsc,
        capabilities,
        keywords,
        preferredAgencies,
        preferredSetAsides,
        preferredNoticeTypes,
        typicalValueMin,
        typicalValueMax,
        baseLocation,
        maxDistanceMiles
      },
      create: {
        organizationId: user.organizationId,
        userId: user.id,
        companyName,
        website,
        size,
        primaryNaics,
        primaryPsc,
        capabilities,
        keywords,
        preferredAgencies,
        preferredSetAsides,
        preferredNoticeTypes,
        typicalValueMin,
        typicalValueMax,
        baseLocation,
        maxDistanceMiles
      }
    });

    await prisma.user.update({ where: { id: user.id }, data: { onboardingCompleted: true } });

    return res.status(200).json({ profile });
  });
}
