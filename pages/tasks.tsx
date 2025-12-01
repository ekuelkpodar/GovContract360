import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';

interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TaskInput>({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'due' | 'priority' | 'status'>('due');

  const loadTasks = async () => {
    setLoading(true);
    const res = await fetch('/api/tasks');
    const body = await res.json();
    setTasks(body.tasks || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async () => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });
    loadTasks();
  };

  const updateTask = async (id: number, status: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadTasks();
  };

  const stats = useMemo(() => {
    const totals = { OPEN: 0, IN_PROGRESS: 0, DONE: 0 };
    tasks.forEach((t) => {
      totals[t.status as keyof typeof totals] = (totals[t.status as keyof typeof totals] || 0) + 1;
    });
    return totals;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let items = [...tasks];
    if (statusFilter !== 'ALL') {
      items = items.filter((t) => t.status === statusFilter);
    }
    if (search) {
      const needle = search.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(needle) ||
          (t.description || '').toLowerCase().includes(needle) ||
          (t.priority || '').toLowerCase().includes(needle)
      );
    }
    if (sort === 'due') {
      items.sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime());
    } else if (sort === 'priority') {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      items.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
    } else if (sort === 'status') {
      const order = { OPEN: 0, IN_PROGRESS: 1, DONE: 2 };
      items.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));
    }
    return items;
  }, [tasks, statusFilter, search, sort]);

  const dueBadge = (dueDate?: string) => {
    if (!dueDate) return { label: 'No date', tone: 'bg-slate-100 text-slate-700' };
    const diffDays = (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return { label: 'Overdue', tone: 'bg-rose-100 text-rose-700' };
    if (diffDays <= 3) return { label: 'Due soon', tone: 'bg-amber-100 text-amber-700' };
    return { label: 'Scheduled', tone: 'bg-emerald-100 text-emerald-700' };
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Execution</p>
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
            <p className="text-xs text-slate-500">Track capture actions, proposal work, and deadlines in one place.</p>
          </div>
          <button
            onClick={loadTasks}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
          >
            Refresh
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-xs font-semibold uppercase text-slate-500">Open</div>
            <div className="text-2xl font-bold text-slate-900">{stats.OPEN}</div>
            <p className="text-xs text-slate-500">Need triage or assignment</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-xs font-semibold uppercase text-slate-500">In progress</div>
            <div className="text-2xl font-bold text-slate-900">{stats.IN_PROGRESS}</div>
            <p className="text-xs text-slate-500">Actively being worked</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-xs font-semibold uppercase text-slate-500">Done</div>
            <div className="text-2xl font-bold text-slate-900">{stats.DONE}</div>
            <p className="text-xs text-slate-500">Closed out</p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded border px-3 py-2"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="rounded border px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="rounded border px-3 py-2"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <select
              className="rounded border px-3 py-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <button onClick={createTask} className="rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            Add task
          </button>
        </div>

        <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Team tasks</h2>
              <p className="text-xs text-slate-500">Filter, sort, and fast-update task status.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {(['ALL', 'OPEN', 'IN_PROGRESS', 'DONE'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-3 py-1 font-semibold ${
                    statusFilter === status
                      ? 'bg-brand-600 text-white shadow'
                      : 'border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
              <input
                className="rounded border px-3 py-1 text-sm"
                placeholder="Search title, desc, priority"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded border px-2 py-1 text-sm text-slate-700"
              >
                <option value="due">Due date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
          {loading && <p className="text-sm text-slate-600">Loading...</p>}
          <div className="mt-3 space-y-2">
            {filteredTasks.map((task) => {
              const badge = dueBadge(task.dueDate);
              return (
                <div key={task.id} className="flex flex-col gap-2 rounded border px-3 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{task.description || 'No description'}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-full px-2 py-1 font-semibold ${badge.tone}`}>{badge.label}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                        Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 font-semibold ${
                          task.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'LOW'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.priority} priority
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{task.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button className="rounded border px-2 py-1" onClick={() => updateTask(task.id, 'OPEN')}>
                      Open
                    </button>
                    <button className="rounded border px-2 py-1" onClick={() => updateTask(task.id, 'IN_PROGRESS')}>
                      In progress
                    </button>
                    <button className="rounded border px-2 py-1" onClick={() => updateTask(task.id, 'DONE')}>
                      Done
                    </button>
                  </div>
                </div>
              );
            })}
            {!loading && filteredTasks.length === 0 && (
              <p className="text-sm text-slate-600">No tasks match these filters.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
