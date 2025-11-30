import { useEffect, useState } from 'react';
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

  const { data } = useSWR<{ data: Opportunity[]; total: number; facets?: any }>(
    `/api/opportunities/search?q=${encodeURIComponent(query)}&agency=${filters.agency}&department=${filters.department}&naics=${filters.naics}&setAside=${filters.setAside}&noticeType=${filters.noticeType}&valueMin=${filters.valueMin}&valueMax=${filters.valueMax}&onlyActive=${filters.onlyActive}`,
    fetcher
  );
  const { data: savedViews } = useSWR('/api/saved-views', fetcher);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [frequency, setFrequency] = useState('WEEKLY');
  const [activeView, setActiveView] = useState<number | null>(null);

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
    await fetch('/api/saved-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: savedSearchName, config: { query, filters } })
    });
    setShowSaveModal(false);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-[280px,1fr]">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="space-y-4">
            <SearchBar query={query} onQueryChange={setQuery} onSubmit={onSearch} useAI={useAI} onToggleAI={setUseAI} />
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={filter.action}
                  className="rounded-full border px-3 py-1 font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
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
            </div>
            <div className="space-y-3">
              {savedViews?.views?.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold">Saved views:</span>
                  {savedViews.views.map((view: any) => (
                    <button
                      key={view.id}
                      onClick={() => {
                        setActiveView(view.id);
                        setQuery(view.config.query || '');
                        setFilters({ ...filters, ...(view.config.filters || {}) });
                      }}
                      className={`rounded border px-2 py-1 ${activeView === view.id ? 'border-indigo-500 text-indigo-600' : ''}`}
                    >
                      {view.name}
                    </button>
                  ))}
                </div>
              )}
              {!data && <p className="text-sm text-slate-600">Loading results...</p>}
              {data && data.data.length === 0 && (
                <p className="text-sm text-slate-600">No opportunities found. Try adjusting filters.</p>
              )}
              {data?.facets && (
                <div className="grid gap-2 rounded border border-slate-200 bg-white p-3 text-xs text-slate-700 md:grid-cols-3">
                  <div>
                    <p className="font-semibold">Agencies</p>
                    {data.facets.agencies.map(([name, count]: any) => (
                      <div key={name} className="flex justify-between">
                        <span>{name}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold">Set-asides</p>
                    {data.facets.setAsides.map(([name, count]: any) => (
                      <div key={name} className="flex justify-between">
                        <span>{name}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold">Notice types</p>
                    {data.facets.noticeTypes.map(([name, count]: any) => (
                      <div key={name} className="flex justify-between">
                        <span>{name}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data?.data.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
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
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-2 text-sm">
                <button className="rounded border px-3 py-2" onClick={() => setShowSaveModal(false)}>
                  Cancel
                </button>
                <button className="rounded bg-brand-600 px-3 py-2 font-semibold text-white" onClick={saveSearch}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
