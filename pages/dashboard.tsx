import useSWR from 'swr';
import Link from 'next/link';
import { Layout } from '../components/Layout';
import type { Opportunity } from '@prisma/client';
import { useMemo } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: opportunities } = useSWR<{ data: Opportunity[] }>(`/api/opportunities/search?pageSize=5`, fetcher);
  const { data: tasks } = useSWR<{ tasks: any[] }>(`/api/tasks`, fetcher);
  const { data: notifications } = useSWR<{ notifications: any[] }>(`/api/notifications`, fetcher);

  const recommended = opportunities?.data || [];
  const upcomingTasks = tasks?.tasks?.slice(0, 5) || [];
  const unreadCount = useMemo(() => notifications?.notifications?.filter((n: any) => !n.isRead).length || 0, [
    notifications
  ]);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-600">Home</p>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/search" className="rounded bg-brand-600 px-3 py-2 text-white shadow">
              Start a search
            </Link>
            <Link href="/tasks" className="rounded border px-3 py-2">
              Tasks
            </Link>
            <Link href="/alerts" className="rounded border px-3 py-2">
              Alerts
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Notifications</p>
            <p className="text-3xl font-semibold text-slate-900">{unreadCount}</p>
            <p className="text-sm text-slate-600">Unread alerts from searches and team activity</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Pipeline</p>
            <p className="text-3xl font-semibold text-slate-900">Multi-stage</p>
            <p className="text-sm text-slate-600">Review saved opportunities and update status in the pipeline view.</p>
            <Link href="/pipeline" className="text-brand-700 text-sm font-semibold">View pipeline</Link>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Proposal workspace</p>
            <p className="text-3xl font-semibold text-slate-900">Templates</p>
            <p className="text-sm text-slate-600">Reuse drafts, export Markdown/PDF, and collaborate.</p>
            <Link href="/proposals/1" className="text-brand-700 text-sm font-semibold">Open workspace</Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recommended for you</h2>
              <Link href="/search" className="text-sm text-brand-700">
                View all
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {recommended.length === 0 && <p className="text-sm text-slate-600">No recommendations yet.</p>}
              {recommended.map((opp) => (
                <div key={opp.id} className="rounded border p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{opp.title}</p>
                      <p className="text-xs text-slate-500">
                        {opp.agency} • deadline {new Date(opp.responseDeadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/opportunity/${opp.id}`} className="text-sm text-brand-700">
                      View
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 line-clamp-2">{opp.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Upcoming tasks</h3>
              <div className="mt-2 space-y-2 text-sm text-slate-700">
                {upcomingTasks.length === 0 && <p className="text-slate-600">No tasks assigned.</p>}
                {upcomingTasks.map((task: any) => (
                  <div key={task.id} className="rounded border px-2 py-2">
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Activity</h3>
              <p className="text-sm text-slate-600">Saved opportunities, updated statuses, and new proposal drafts will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
