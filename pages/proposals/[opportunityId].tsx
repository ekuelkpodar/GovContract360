import { FormEvent, useState } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import type { Opportunity } from '@prisma/client';
import { Layout } from '../../components/Layout';

interface Props {
  opportunity: Opportunity | null;
}

export default function ProposalPage({ opportunity }: Props) {
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [sections, setSections] = useState<{ heading: string; content: string }[]>([]);

  if (!opportunity) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-6 py-12">Opportunity not found.</div>
      </Layout>
    );
  }

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/ai/generate-proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: opportunity.id, userNotes: `${companyName}\n${notes}` })
    });
    const body = await res.json();
    setSections(body.sections || []);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Generate proposal: {opportunity.title}</h1>
          <p className="text-sm text-slate-600">Agency: {opportunity.agency}</p>
          <form onSubmit={generate} className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Company name</label>
              <input
                className="w-full rounded border px-3 py-2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <label className="block text-sm font-semibold text-slate-700">Unique value proposition</label>
              <textarea
                className="w-full rounded border px-3 py-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
              />
              <button type="submit" className="rounded bg-brand-600 px-4 py-2 text-white">
                Generate draft
              </button>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Draft sections</h3>
              {sections.length === 0 && <p className="text-sm text-slate-600">No draft yet.</p>}
              {sections.map((section) => (
                <div key={section.heading} className="rounded border p-3">
                  <div className="text-sm font-semibold">{section.heading}</div>
                  <textarea
                    className="mt-2 w-full rounded border px-3 py-2 text-sm"
                    value={section.content}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s) => (s.heading === section.heading ? { ...s, content: e.target.value } : s))
                      )
                    }
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const opportunityId = params?.opportunityId as string;
  let opportunity: Opportunity | null = null;
  try {
    opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  } catch (err) {
    opportunity = null;
  }
  return { props: { opportunity: JSON.parse(JSON.stringify(opportunity)) } };
};
