import { prisma } from '../prisma';

export interface EmailMessage {
  id: number;
  from: string;
  to: string[];
  subject: string;
  preview: string;
  receivedAt: Date;
  threadId?: string;
}

export async function listRecentRfpEmails(organizationId: number): Promise<EmailMessage[]> {
  const messages = await prisma.emailStub.findMany({ where: { organizationId }, orderBy: { receivedAt: 'desc' }, take: 20 });
  return messages.map((m) => ({
    id: m.id,
    from: m.from,
    to: ['rfp@placeholder.example'],
    subject: m.subject,
    preview: m.body.substring(0, 160),
    receivedAt: m.receivedAt
  }));
}

export async function getEmailBody(messageId: number) {
  const message = await prisma.emailStub.findUnique({ where: { id: messageId } });
  return message?.body || '';
}
