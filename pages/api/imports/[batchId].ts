import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const batchId = Number(req.query.batchId);
  if (Number.isNaN(batchId)) return res.status(400).json({ error: 'Batch id required' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const batch = await prisma.importBatch.findUnique({
      where: { id: batchId },
      include: { errors: true }
    });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.status(200).json({ batch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load import batch' });
  }
}
