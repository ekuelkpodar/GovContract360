import { NextApiRequest, NextApiResponse } from 'next';

export function logError(message: string, meta?: Record<string, unknown>) {
  console.error(`[GovContract360] ${message}`, meta || {});
}

export async function withErrorHandling(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: () => Promise<void>
) {
  try {
    await handler();
  } catch (err: any) {
    logError('API error', { route: req.url, error: err?.message, body: req.body });
    res.status(500).json({ error: { message: 'Unexpected server error' } });
  }
}
