import type { NextApiRequest, NextApiResponse } from 'next';
import { listRecentRfpEmails, getEmailBody } from '../../../lib/integrations/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const organizationId = Number(req.query.organizationId || 1);
  if (req.method === 'GET') {
    const emails = await listRecentRfpEmails(organizationId);
    return res.status(200).json({ emails });
  }

  if (req.method === 'POST') {
    const { messageId } = req.body;
    const body = await getEmailBody(messageId);
    return res.status(200).json({ body });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
