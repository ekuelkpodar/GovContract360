import useSWR from 'swr';
import { Layout } from '../components/Layout';
import type { Opportunity } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Saved() {
  const { data } = useSWR<{ data: (Opportunity & { savedId: number; status: string; priority: string })[] }>(
    '/api/saved-searches',
    fetcher
  );
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Saved opportunities</h1>
        <p className="text-slate-600">Quickly review bookmarked opportunities and update their status.</p>
        <div className="mt-6 space-y-4">
          {data?.data?.map((opportunity) => (
            <div key={opportunity.id} className="rounded border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-brand-700">{opportunity.title}</div>
                  <p className="text-sm text-slate-600">{opportunity.agency}</p>
                </div>
                <select className="rounded border px-3 py-1 text-sm">
                  {["Evaluating", "Pursuing", "Submitted", "Won", "Lost"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Deadline: {new Date(opportunity.responseDeadline).toLocaleDateString()} • Priority: {opportunity.priority}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
