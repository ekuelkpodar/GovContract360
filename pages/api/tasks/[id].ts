import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { withErrorHandling } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    const user = await getCurrentUser(req);
    if (!user?.organizationId) return res.status(401).json({ error: 'Unauthorized' });
    const id = Number(req.query.id);

    if (req.method === 'PATCH') {
      const { status, title, description, dueDate, priority, assigneeUserId } = req.body;
      const task = await prisma.task.update({
        where: { id },
        data: { status, title, description, dueDate, priority, assigneeUserId }
      });
      return res.status(200).json({ task });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  });
}
