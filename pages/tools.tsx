import { Layout } from '../components/Layout';
import { useState } from 'react';
import { OpportunityCard } from '../components/OpportunityCard';
import { mockOpportunities } from '../data/mockOpportunities';

export default function Tools() {
  const [naicsQuery, setNaicsQuery] = useState('');
  const [simpleQuery, setSimpleQuery] = useState('');
  const filtered = mockOpportunities.filter((opp) =>
    opp.title.toLowerCase().includes(simpleQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Free GovCon tools</h1>
          <p className="text-slate-600">Lightweight utilities to get value right away.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">NAICS code finder</h2>
            <p className="text-sm text-slate-600">Search keywords to see suggested NAICS codes.</p>
            <input
              className="mt-3 w-full rounded border px-3 py-2"
              placeholder="cybersecurity, logistics, cloud"
              value={naicsQuery}
              onChange={(e) => setNaicsQuery(e.target.value)}
            />
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {naicsQuery && (
                <div className="rounded border px-3 py-2">
                  Suggested codes for "{naicsQuery}": 541512, 541513, 541519
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quick contract search</h2>
            <p className="text-sm text-slate-600">Try a lightweight search without creating an account.</p>
            <input
              className="mt-3 w-full rounded border px-3 py-2"
              placeholder="cloud migration"
              value={simpleQuery}
              onChange={(e) => setSimpleQuery(e.target.value)}
            />
            <div className="mt-3 space-y-3">
              {filtered.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
