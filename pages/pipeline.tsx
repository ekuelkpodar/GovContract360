import { Layout } from '../components/Layout';

const columns = ['Evaluating', 'Pursuing', 'Submitted', 'Won', 'Lost'];

export default function Pipeline() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Pipeline</h1>
        <p className="text-slate-600">Kanban view of your capture pipeline. Drag-and-drop can be wired later.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {columns.map((column) => (
            <div key={column} className="rounded-lg border bg-white p-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">{column}</h3>
              <div className="mt-2 space-y-2 text-sm text-slate-700">
                {[1, 2].map((card) => (
                  <div key={card} className="rounded border px-3 py-2">
                    <div className="font-semibold">Opportunity {card}</div>
                    <div className="text-xs text-slate-500">Agency • Deadline soon</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
