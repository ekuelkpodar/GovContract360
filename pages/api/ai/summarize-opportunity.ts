import type { NextApiRequest, NextApiResponse } from 'next';
import { summarizeOpportunity } from '../../../lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { rawText, metadata = {} } = req.body;
  if (!rawText) return res.status(400).json({ error: 'rawText is required' });

  try {
    const summary = await summarizeOpportunity(rawText, metadata);
    return res.status(200).json({ summary });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to summarize opportunity' });
  }
}
