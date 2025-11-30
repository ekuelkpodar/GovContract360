import { useEffect, useState } from 'react';
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

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Execution</p>
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
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

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Team tasks</h2>
          {loading && <p className="text-sm text-slate-600">Loading...</p>}
          <div className="mt-3 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded border px-3 py-2">
                <div>
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500">
                    Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'} • Priority {task.priority}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
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
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
