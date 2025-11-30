import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { createToken, setAuthCookie, verifyPassword } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken({ userId: user.id, email: user.email, role: user.role, organizationId: user.organizationId });
    setAuthCookie(res, token);

    return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to login' });
  }
}
