import { Layout } from '../components/Layout';
import { useMemo, useState } from 'react';
import { OpportunityCard } from '../components/OpportunityCard';
import { mockOpportunities } from '../data/mockOpportunities';

export default function Tools() {
  const [naicsQuery, setNaicsQuery] = useState('');
  const [simpleQuery, setSimpleQuery] = useState('');
  const [naicsSuggestions, setNaicsSuggestions] = useState<string[]>([]);
  const [pscSuggestions, setPscSuggestions] = useState<string[]>([]);
  const [agencyFilter, setAgencyFilter] = useState('');
  const [noticeFilter, setNoticeFilter] = useState('');

  const filtered = useMemo(() => {
    return mockOpportunities.filter((opp) => {
      const matchesTitle = opp.title.toLowerCase().includes(simpleQuery.toLowerCase());
      const matchesAgency = agencyFilter ? opp.agency === agencyFilter : true;
      const matchesNotice = noticeFilter ? opp.noticeType === noticeFilter : true;
      return matchesTitle && matchesAgency && matchesNotice;
    });
  }, [simpleQuery, agencyFilter, noticeFilter]);

  const runNaicsLookup = () => {
    if (!naicsQuery.trim()) {
      setNaicsSuggestions([]);
      setPscSuggestions([]);
      return;
    }
    // Mock suggestion logic — replace with API lookup later.
    const lower = naicsQuery.toLowerCase();
    const baseCodes = ['541512', '541513', '541519', '541611', '517311'];
    const filteredCodes = baseCodes.filter((code) => code.includes(lower) || lower.includes(code));
    setNaicsSuggestions(filteredCodes.length ? filteredCodes : baseCodes.slice(0, 3));
    const basePsc = ['D399', 'R408', 'R499', 'D301', 'D318'];
    setPscSuggestions(basePsc.slice(0, 3));
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        <div className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Free GovCon tools</h1>
          <p className="text-slate-600">Lightweight utilities to get value right away.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">NAICS code finder</h2>
            <p className="text-sm text-slate-600">Search keywords to see suggested NAICS and PSC codes.</p>
            <input
              className="mt-3 w-full rounded border px-3 py-2"
              placeholder="cybersecurity, logistics, cloud"
              value={naicsQuery}
              onChange={(e) => setNaicsQuery(e.target.value)}
            />
            <button
              className="mt-3 w-full rounded bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              onClick={runNaicsLookup}
            >
              Suggest codes
            </button>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {naicsSuggestions.length > 0 && (
                <div className="rounded border px-3 py-2">
                  <div className="text-xs font-semibold text-slate-500">NAICS suggestions</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {naicsSuggestions.map((code) => (
                      <span key={code} className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pscSuggestions.length > 0 && (
                <div className="rounded border px-3 py-2">
                  <div className="text-xs font-semibold text-slate-500">PSC suggestions</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {pscSuggestions.map((code) => (
                      <span key={code} className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Quick contract search</h2>
            <p className="text-sm text-slate-600">Try a lightweight search without creating an account.</p>
            <input
              className="mt-3 w-full rounded border px-3 py-2"
              placeholder="cloud migration"
              value={simpleQuery}
              onChange={(e) => setSimpleQuery(e.target.value)}
            />
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <select
                className="rounded border px-3 py-2 text-sm"
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
              >
                <option value="">All agencies</option>
                <option value="Department of Defense">Department of Defense</option>
                <option value="General Services Administration">GSA</option>
                <option value="Department of Homeland Security">DHS</option>
              </select>
              <select
                className="rounded border px-3 py-2 text-sm"
                value={noticeFilter}
                onChange={(e) => setNoticeFilter(e.target.value)}
              >
                <option value="">All notice types</option>
                <option value="Solicitation">Solicitation</option>
                <option value="Sources Sought">Sources Sought</option>
                <option value="RFI">RFI</option>
              </select>
            </div>
            <div className="mt-3 space-y-3">
              {filtered.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-slate-600">No mock opportunities match. Adjust keywords or filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
