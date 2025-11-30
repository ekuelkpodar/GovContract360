import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { withErrorHandling } from '../../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return withErrorHandling(req, res, async () => {
    const user = await getCurrentUser(req);
    if (!user?.organizationId) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const tasks = await prisma.task.findMany({
        where: { organizationId: user.organizationId },
        orderBy: { dueDate: 'asc' }
      });
      return res.status(200).json({ tasks });
    }

    if (req.method === 'POST') {
      const { title, description, opportunityId, dueDate, priority, assigneeUserId } = req.body;
      if (!title) return res.status(400).json({ error: 'Missing title' });
      const task = await prisma.task.create({
        data: {
          title,
          description,
          opportunityId,
          dueDate,
          priority,
          organizationId: user.organizationId,
          assigneeUserId
        }
      });
      return res.status(201).json({ task });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  });
}
