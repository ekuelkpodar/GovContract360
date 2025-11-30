import useSWR from 'swr';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function InboxPage() {
  const { data } = useSWR('/api/inbox?organizationId=1', fetcher);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-2xl font-semibold">Inbox (RFP Leads)</h1>
        <p className="text-sm text-slate-600">Stubbed email integration to surface RFP messages.</p>
        <div className="space-y-3">
          {data?.emails?.map((email: any) => (
            <div key={email.id} className="rounded border border-slate-200 bg-white p-3 shadow-sm">
              <p className="font-semibold">{email.subject}</p>
              <p className="text-xs text-slate-600">From: {email.from}</p>
              <p className="text-sm text-slate-700">{email.preview}</p>
              <button className="mt-2 text-sm text-indigo-600">Create Opportunity from Email</button>
            </div>
          )) || <p className="text-sm text-slate-600">No messages yet.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
