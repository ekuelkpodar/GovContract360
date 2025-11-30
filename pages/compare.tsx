import { useState } from 'react';
import useSWR from 'swr';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ComparePage() {
  const { data } = useSWR('/api/opportunities/search', fetcher);
  const [selected, setSelected] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState('');

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 5)));
  };

  const runAnalysis = async () => {
    const response = await fetch('/api/ai/compare-opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityIds: selected, profileSummary: 'Demo profile preferences' })
    });
    const result = await response.json();
    setAnalysis(result.analysis);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Compare Opportunities</h1>
          <button onClick={runAnalysis} className="rounded bg-indigo-600 px-3 py-2 text-sm text-white" disabled={selected.length < 2}>
            AI Comparison
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {data?.data?.slice(0, 6)?.map((opp: any) => (
            <label key={opp.id} className="flex cursor-pointer items-start gap-3 rounded border border-slate-200 bg-white p-3">
              <input type="checkbox" checked={selected.includes(opp.id)} onChange={() => toggle(opp.id)} />
              <div>
                <p className="font-semibold">{opp.title}</p>
                <p className="text-xs text-slate-600">{opp.agency}</p>
                <p className="text-xs text-slate-600">Deadline: {new Date(opp.responseDeadline).toLocaleDateString()}</p>
              </div>
            </label>
          ))}
        </div>
        {analysis && (
          <div className="rounded border border-indigo-100 bg-indigo-50 p-4 text-sm text-slate-800">
            <h3 className="mb-2 font-semibold">AI Comparison Insights</h3>
            <p>{analysis}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
