import useSWR from 'swr';
import { Layout } from '../components/Layout';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Alerts() {
  const { data } = useSWR('/api/saved-searches', fetcher);
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Saved searches & alerts</h1>
        <p className="text-slate-600">Monitor the searches that matter and receive alerts when new matches appear.</p>
        <div className="mt-6 space-y-4">
          {data?.data?.map((search: any) => (
            <div key={search.id} className="rounded border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-brand-700">{search.name}</div>
                  <p className="text-sm text-slate-600">{search.query}</p>
                </div>
                <label className="flex items-center space-x-2 text-xs text-slate-600">
                  <input type="checkbox" defaultChecked={search.isActive} />
                  <span>Active</span>
                </label>
              </div>
              <div className="mt-2 text-xs text-slate-500">Frequency: {search.frequency}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
