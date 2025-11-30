import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { withErrorHandling } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      return res.status(200).json({ notifications });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  });
}
