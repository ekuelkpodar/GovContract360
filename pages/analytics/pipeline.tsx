import useSWR from 'swr';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PipelineAnalyticsPage() {
  const { data } = useSWR('/api/analytics/pipeline', fetcher);
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Pipeline Analytics</h1>
          <p className="text-sm text-slate-600">Win-rate, velocity, and stage distribution.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {data?.summary?.map((item: any) => (
            <div key={item.status} className="rounded border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs uppercase text-slate-500">{item.status}</p>
              <p className="text-2xl font-semibold">{item._count._all}</p>
              <p className="text-xs text-slate-500">Avg value: ${item._avg.estimatedValueMax?.toFixed?.(0) || 0}</p>
            </div>
          )) || <p className="text-sm text-slate-600">No pipeline data yet.</p>}
        </div>
        <div className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
          <p className="font-semibold">Recent status changes</p>
          <ul className="mt-2 space-y-1">
            {data?.trend?.map((evt: any) => (
              <li key={evt.id} className="text-xs text-slate-600">
                {evt.toStatus} on {new Date(evt.changedAt).toLocaleDateString()}
              </li>
            )) || <li className="text-xs text-slate-600">No recent changes</li>}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
