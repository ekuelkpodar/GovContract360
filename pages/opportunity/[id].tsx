import { GetServerSideProps } from 'next';
import { Layout } from '../../components/Layout';
import { prisma } from '../../lib/prisma';
import type { Opportunity } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  opportunity: Opportunity | null;
}

export default function OpportunityDetail({ opportunity }: Props) {
  const [summary, setSummary] = useState<string>('AI summary will appear here.');
  const [fitScore, setFitScore] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  if (!opportunity) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-slate-600">Opportunity not found.</p>
        </div>
      </Layout>
    );
  }

  const refreshSummary = async () => {
    const res = await fetch('/api/ai/summarize-opportunity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: opportunity.rawText, metadata: { title: opportunity.title, agency: opportunity.agency } })
    });
    const body = await res.json();
    setSummary(body.summary);
  };

  const evaluateBid = async () => {
    const res = await fetch('/api/ai/bid-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: opportunity?.id })
    });
    const body = await res.json();
    setFitScore(body.fitScore);
    setRiskScore(body.riskScore);
    setRecommendation(body.recommendation);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{opportunity.title}</h1>
                  <p className="text-sm text-slate-600">
                    {opportunity.agency} • {opportunity.department}
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {opportunity.noticeType}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700 md:grid-cols-3">
                <div>Set-aside: {opportunity.setAside || 'N/A'}</div>
                <div>NAICS: {opportunity.naicsCodes.join(', ')}</div>
                <div>Value: ${opportunity.estimatedValueMin?.toLocaleString()} - ${
                  opportunity.estimatedValueMax?.toLocaleString()
                }</div>
                <div>Response deadline: {new Date(opportunity.responseDeadline).toLocaleDateString()}</div>
                <div>Posted: {new Date(opportunity.postedDate).toLocaleDateString()}</div>
                <div>Status: {opportunity.status}</div>
              </div>
              <div className="mt-4 flex space-x-3 text-sm">
                <Link href={opportunity.url} className="text-brand-700" target="_blank">
                  View on official site
                </Link>
                <button className="text-slate-600">Save opportunity</button>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">AI Summary</h2>
                <button
                  onClick={refreshSummary}
                  className="rounded border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  Refresh summary
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">{summary}</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Bid / No-Bid Assistant</h3>
                <button className="rounded bg-brand-600 px-3 py-1 text-xs font-semibold text-white" onClick={evaluateBid}>
                  Evaluate
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded border bg-brand-50 px-3 py-2">Fit score: {fitScore ?? '—'}</div>
                <div className="rounded border bg-amber-50 px-3 py-2">Risk score: {riskScore ?? '—'}</div>
              </div>
              {recommendation && (
                <div className="mt-3 space-y-2 rounded border px-3 py-2 text-sm">
                  <p className="font-semibold text-slate-900">{recommendation.recommendation}</p>
                  <p className="text-slate-700 whitespace-pre-line">{recommendation.reasoning}</p>
                </div>
              )}
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Details</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{opportunity.description}</p>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-lg border bg-white p-4 text-sm shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900">Quick actions</h4>
              <div className="mt-2 space-y-2">
                <button className="w-full rounded bg-brand-600 px-3 py-2 text-white">Generate Proposal Draft</button>
                <button className="w-full rounded border px-3 py-2">Update status</button>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-4 text-sm shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900">Metadata</h4>
              <p className="text-slate-600">Place of performance: {opportunity.placeOfPerformance}</p>
              <p className="text-slate-600">PSC codes: {opportunity.pscCodes.join(', ')}</p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  let opportunity: Opportunity | null = null;
  try {
    opportunity = await prisma.opportunity.findUnique({ where: { id } });
  } catch (err) {
    opportunity = null;
  }
  return { props: { opportunity: JSON.parse(JSON.stringify(opportunity)) } };
};
