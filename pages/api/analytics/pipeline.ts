import type { NextApiRequest, NextApiResponse } from 'next';
import { getPipelineSummary, getPipelineTrend } from '../../../lib/analytics/pipeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const organizationId = Number(req.query.organizationId || 1);
  try {
    const [summary, trend] = await Promise.all([getPipelineSummary(organizationId), getPipelineTrend(organizationId)]);
    res.status(200).json({ summary, trend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load pipeline analytics' });
  }
}
