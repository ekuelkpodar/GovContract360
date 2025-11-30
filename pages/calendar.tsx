import useSWR from 'swr';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CalendarPage() {
  const { data } = useSWR('/api/calendar/events', fetcher);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-2xl font-semibold">Calendar (Deadlines)</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {data?.events?.map((event: any) => (
            <div key={event.id} className="rounded border border-slate-200 bg-white p-3 shadow-sm">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-slate-600">{new Date(event.start).toLocaleDateString()}</p>
            </div>
          )) || <p className="text-sm text-slate-600">No events scheduled.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
