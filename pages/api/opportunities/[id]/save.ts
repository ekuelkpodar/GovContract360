import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { decodeTokenFromReq } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const id = req.query.id as string;
  const user = decodeTokenFromReq(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const saved = await prisma.savedOpportunity.upsert({
      where: {
        userId_opportunityId: {
          userId: user.userId,
          opportunityId: id
        }
      },
      update: {},
      create: { userId: user.userId, opportunityId: id, status: 'Evaluating' }
    });

    return res.status(200).json({ data: saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save opportunity' });
  }
}
