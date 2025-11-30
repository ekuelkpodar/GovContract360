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

  const { data } = useSWR<{ data: Opportunity[]; total: number }>(
    `/api/opportunities/search?q=${encodeURIComponent(query)}&agency=${filters.agency}&department=${filters.department}&naics=${filters.naics}&setAside=${filters.setAside}&noticeType=${filters.noticeType}&valueMin=${filters.valueMin}&valueMax=${filters.valueMax}&onlyActive=${filters.onlyActive}`,
    fetcher
  );

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

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-[280px,1fr]">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="space-y-4">
            <SearchBar query={query} onQueryChange={setQuery} onSubmit={onSearch} useAI={useAI} onToggleAI={setUseAI} />
            <div className="space-y-3">
              {!data && <p className="text-sm text-slate-600">Loading results...</p>}
              {data && data.data.length === 0 && (
                <p className="text-sm text-slate-600">No opportunities found. Try adjusting filters.</p>
              )}
              {data?.data.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
