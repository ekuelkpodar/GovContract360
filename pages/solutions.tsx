import { Layout } from '../components/Layout';

const solutions = [
  {
    title: 'Contract search intelligence',
    description: 'Natural language search, AI rewrite, and structured filters to surface the right deals.',
    icon: '🔎'
  },
  {
    title: 'AI summaries',
    description: 'Instantly summarize scope, eligibility, dates, and evaluation criteria with refreshable AI calls.',
    icon: '⚡'
  },
  {
    title: 'Proposal generator',
    description: 'Generate outlines and draft content tailored to each opportunity.',
    icon: '📝'
  },
  {
    title: 'Saved searches & alerts',
    description: 'Automated monitoring of your segments with daily or weekly notifications.',
    icon: '🔔'
  },
  {
    title: 'Pipeline & collaboration',
    description: 'Kanban pipeline with statuses, notes, priorities, and team visibility.',
    icon: '🤝'
  }
];

export default function Solutions() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">Solutions</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Purpose-built for modern GovCon teams</h1>
          <p className="mt-4 text-lg text-slate-600">
            GovContract360 unifies discovery, capture, and proposal workflows into one cohesive platform with AI at the core.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {solutions.map((solution) => (
            <div key={solution.title} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="text-2xl">{solution.icon}</div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{solution.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{solution.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-6 rounded-xl bg-white p-8 shadow-sm md:grid-cols-3">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">AI search & rewrite</h4>
            <p className="mt-2 text-sm text-slate-600">
              Convert open-ended questions into optimized keywords, NAICS/PSC tags, and structured filters to mirror SAM.gov.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Decision-ready summaries</h4>
            <p className="mt-2 text-sm text-slate-600">
              Scope, eligibility, key dates, and evaluation criteria summarized for capture leads and executives.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Proposal starter</h4>
            <p className="mt-2 text-sm text-slate-600">
              Generate outlines and editable sections that keep writers focused on compliance and win themes.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
