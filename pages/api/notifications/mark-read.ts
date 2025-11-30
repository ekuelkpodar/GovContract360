import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { withErrorHandling } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { ids } = req.body as { ids: number[] };
    if (!ids?.length) return res.status(400).json({ error: 'No notifications selected' });

    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: user.id },
      data: { isRead: true }
    });

    return res.status(200).json({ success: true });
  });
}
