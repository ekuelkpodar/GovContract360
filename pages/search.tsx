import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar, FilterState } from '../components/FilterSidebar';
import { OpportunityCard } from '../components/OpportunityCard';
import { Opportunity } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState((router.query.q as string) || '');
  const [useAI, setUseAI] = useState(false);
  const [sort, setSort] = useState<'relevance' | 'deadline' | 'value' | 'newest'>('relevance');
  const [filters, setFilters] = useState<FilterState>({
    agency: (router.query.agency as string) || '',
    department: (router.query.department as string) || '',
    naics: (router.query.naics as string) || '',
    setAside: (router.query.setAside as string) || '',
    noticeType: (router.query.noticeType as string) || '',
    valueMin: (router.query.valueMin as string) || '',
    valueMax: (router.query.valueMax as string) || '',
    onlyActive: (router.query.onlyActive as string) === 'true'
  });

  const { data } = useSWR<{ data: Opportunity[]; total: number }>(
    `/api/opportunities/search?q=${encodeURIComponent(query)}&agency=${filters.agency}&department=${filters.department}&naics=${filters.naics}&setAside=${filters.setAside}&noticeType=${filters.noticeType}&valueMin=${filters.valueMin}&valueMax=${filters.valueMax}&onlyActive=${filters.onlyActive}`,
    fetcher
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [frequency, setFrequency] = useState('WEEKLY');

  const totalResults = data?.total ?? data?.data?.length ?? 0;
  const recentCount =
    data?.data?.filter((opp) => {
      const posted = new Date(opp.postedDate);
      const diffDays = (Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length ?? 0;
  const closingSoon = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data]
      .filter((opp) => new Date(opp.responseDeadline).getTime() > Date.now())
      .sort((a, b) => new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime())
      .slice(0, 3);
  }, [data?.data]);

  const sortedResults = useMemo(() => {
    if (!data?.data) return [];
    const items = [...data.data];
    if (sort === 'deadline') {
      return items.sort((a, b) => new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime());
    }
    if (sort === 'value') {
      return items.sort(
        (a, b) => (b.estimatedValueMax ?? b.estimatedValueMin ?? 0) - (a.estimatedValueMax ?? a.estimatedValueMin ?? 0)
      );
    }
    if (sort === 'newest') {
      return items.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items;
  }, [data?.data, sort]);

  useEffect(() => {
    const params = new URLSearchParams({
      q: query,
      agency: filters.agency,
      department: filters.department,
      naics: filters.naics,
      setAside: filters.setAside,
      noticeType: filters.noticeType,
      valueMin: filters.valueMin,
      valueMax: filters.valueMax,
      onlyActive: String(filters.onlyActive)
    });
    router.replace({ pathname: '/search', query: params.toString() }, undefined, { shallow: true });
  }, [query, filters, router]);

  const onSearch = async () => {
    if (useAI && query) {
      const res = await fetch('/api/ai/rewrite-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const body = await res.json();
      if (body.query) setQuery(body.query);
    }
  };

  const quickFilters = [
    { label: 'My agencies', action: () => setFilters((f) => ({ ...f, agency: 'Department of Defense' })) },
    { label: 'My set-asides', action: () => setFilters((f) => ({ ...f, setAside: 'Small Business' })) },
    { label: 'High value', action: () => setFilters((f) => ({ ...f, valueMin: '1000000' })) },
    { label: 'Closing soon', action: () => setFilters((f) => ({ ...f, noticeType: 'Solicitation' })) },
    { label: 'New this week', action: () => setFilters((f) => ({ ...f, onlyActive: true })) }
  ];

  const saveSearch = async () => {
    await fetch('/api/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: savedSearchName, query, filters, frequency })
    });
    setShowSaveModal(false);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Opportunity search</p>
              <h1 className="text-2xl font-bold text-slate-900">Find and qualify the right federal contracts</h1>
              <p className="text-sm text-slate-600">
                AI-assisted filters, saveable views, and instant insights so capture teams can prioritize quickly.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-800">AI rewrite {useAI ? 'On' : 'Off'}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Sort: {sort}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Results: {totalResults}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[280px,1fr]">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="space-y-4">
            <SearchBar query={query} onQueryChange={setQuery} onSubmit={onSearch} useAI={useAI} onToggleAI={setUseAI} />

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="text-xs font-semibold text-slate-500">Total matches</div>
                <div className="text-2xl font-bold text-slate-900">{totalResults}</div>
                <p className="text-xs text-slate-500">Based on your current filters and AI rewrite preference.</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="text-xs font-semibold text-slate-500">Posted last 7 days</div>
                <div className="text-2xl font-bold text-brand-700">{recentCount}</div>
                <p className="text-xs text-slate-500">Fresh opportunities you have not viewed yet.</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="text-xs font-semibold text-slate-500">Closing soon</div>
                <div className="text-2xl font-bold text-amber-600">{closingSoon.length}</div>
                <p className="text-xs text-slate-500">Prioritize near-term deadlines.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={filter.action}
                  className="rounded-full border px-3 py-1 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
                >
                  {filter.label}
                </button>
              ))}
              <button
                onClick={() => setShowSaveModal(true)}
                className="rounded-full border border-brand-200 px-3 py-1 font-semibold text-brand-700"
              >
                Save search
              </button>
              <button className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700">
                Export CSV
              </button>
              <button className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700">
                Create alert
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3 text-xs shadow-sm ring-1 ring-slate-100 md:flex-row">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters)
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <span key={key} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      {key}: {String(value)}
                      <button
                        className="text-slate-500 hover:text-brand-700"
                        onClick={() => setFilters((f) => ({ ...f, [key]: key === 'onlyActive' ? false : '' }))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                {Object.values(filters).every((v) => !v) && <span className="text-slate-500">No filters applied.</span>}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="rounded border px-2 py-1 text-slate-700"
                >
                  <option value="relevance">Relevance</option>
                  <option value="deadline">Closing soonest</option>
                  <option value="value">Highest value</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-3">
                {!data && <p className="text-sm text-slate-600">Loading results...</p>}
                {data && sortedResults.length === 0 && (
                  <p className="text-sm text-slate-600">No opportunities found. Try adjusting filters.</p>
                )}
                {sortedResults.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Closing soon</h3>
                    <span className="text-xs text-slate-500">Top 3 deadlines</span>
                  </div>
                  <div className="mt-3 space-y-3 text-xs">
                    {closingSoon.length === 0 && <p className="text-slate-600">No upcoming deadlines.</p>}
                    {closingSoon.map((opp) => (
                      <div key={opp.id} className="rounded-lg border border-slate-100 p-3">
                        <div className="text-sm font-semibold text-slate-900">{opp.title}</div>
                        <div className="text-slate-500">{new Date(opp.responseDeadline).toLocaleDateString()}</div>
                        <div className="text-slate-600">
                          {opp.agency} {opp.department ? `• ${opp.department}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 text-white shadow-sm ring-1 ring-slate-800">
                  <h3 className="text-sm font-semibold">AI Assist</h3>
                  <p className="mt-1 text-xs text-slate-200">
                    Let AI refine your query, suggest synonyms, and pull related NAICS/PSC codes.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-100">
                    <li>• Rewrite queries to expand coverage</li>
                    <li>• Flag compliance keywords in descriptions</li>
                    <li>• Propose partners based on similar awards</li>
                  </ul>
                  <button
                    onClick={() => setUseAI(true)}
                    className="mt-3 w-full rounded-md bg-white px-3 py-2 text-center text-xs font-semibold text-slate-900 hover:-translate-y-0.5"
                  >
                    Enable AI rewrite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSaveModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900">Save this search</h3>
              <div className="mt-3 space-y-3 text-sm">
                <input
                  className="w-full rounded border px-3 py-2"
                  placeholder="Name"
                  value={savedSearchName}
                  onChange={(e) => setSavedSearchName(e.target.value)}
                />
                <select
                  className="w-full rounded border px-3 py-2"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="DAILY">Daily digest</option>
                  <option value="WEEKLY">Weekly summary</option>
                  <option value="MANUAL">Manual only</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-2 text-sm">
                <button className="rounded border px-3 py-2" onClick={() => setShowSaveModal(false)}>
                  Cancel
                </button>
                <button className="rounded bg-brand-600 px-3 py-2 font-semibold text-white" onClick={saveSearch}>
                  Save & alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
