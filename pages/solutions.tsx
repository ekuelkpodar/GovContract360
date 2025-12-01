import { Layout } from '../components/Layout';

const solutions = [
  {
    title: 'Opportunity intelligence',
    description: 'Plain-language search with AI rewrite, NAICS/PSC mapping, and scored fit signals.',
    icon: '🔎',
    outcomes: ['Keyword expansion', 'Set-aside detection', 'Auto-tagging to pipelines']
  },
  {
    title: 'AI summaries & briefings',
    description: 'Executive-ready recaps of scope, risks, eligibility, and evaluation factors.',
    icon: '⚡',
    outcomes: ['Win themes & risks', 'Compliance checkpoints', 'Key dates & POP']
  },
  {
    title: 'Proposal workspace',
    description: 'Generate outlines, draft sections, red-team, and export in your brand.',
    icon: '📝',
    outcomes: ['Auto outlines', 'Style-guide aware drafts', 'Comment & redline']
  },
  {
    title: 'Alerts & digests',
    description: 'Saved searches with smart alerts, daily/weekly digests, and quiet hours.',
    icon: '🔔',
    outcomes: ['Priority scoring', 'Noise suppression', 'Inbox-ready summaries']
  },
  {
    title: 'Pipeline & tasks',
    description: 'Kanban, tasks, and due-date guardrails to keep capture on track.',
    icon: '🤝',
    outcomes: ['Stage SLAs', 'Owner visibility', 'Due soon heatmaps']
  },
  {
    title: 'Data governance',
    description: 'Role-based controls, audit logs, and private LLM routing for compliance-first teams.',
    icon: '🛡️',
    outcomes: ['SSO/SAML', 'Field masking', 'Audit & export']
  }
];

const industryPlays = [
  {
    name: 'Small business set-aside teams',
    detail: 'Focus on 8(a), HUBZone, WOSB, SDVOSB with auto-detected eligibility and tailored alerts.'
  },
  {
    name: 'Mid-market capture orgs',
    detail: 'Portfolio-level coverage across agencies, value bands, and teaming recommendations.'
  },
  {
    name: 'Prime contractors',
    detail: 'Incumbent tracking, recompete watchlists, and partner intelligence from award history.'
  },
  {
    name: 'Consultancies & proposal shops',
    detail: 'Reusable templates, client-specific style guides, and multi-tenant governance.'
  }
];

const metrics = [
  { label: 'Avg. time saved/week', value: '18 hrs', tone: 'text-brand-700' },
  { label: 'Opportunities triaged', value: '9,400+', tone: 'text-emerald-700' },
  { label: 'Teams onboarded', value: '120+', tone: 'text-slate-900' }
];

export default function Solutions() {
  return (
    <Layout>
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-16 top-16 h-40 w-40 rounded-full bg-brand-50 blur-3xl" />
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-brand-100 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-16 space-y-12">
          <header className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Solutions</p>
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Purpose-built for modern GovCon teams</h1>
            <p className="text-lg text-slate-600">
              GovContract360 unifies discovery, capture, and proposal workflows with AI briefings, guardrails, and
              collaboration to move from search to submission faster.
            </p>
          </header>

          <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-600">{metric.label}</div>
                <div className={`text-3xl font-bold ${metric.tone}`}>{metric.value}</div>
              </div>
            ))}
          </div>

          <section className="grid gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-2xl">{solution.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900">{solution.title}</h3>
                <p className="text-sm text-slate-600">{solution.description}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                  {solution.outcomes.map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-6 rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg ring-1 ring-slate-800 md:grid-cols-3">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">Plays</p>
              <h2 className="mt-2 text-3xl font-semibold">Tailored solutions by segment</h2>
              <p className="mt-2 text-sm text-slate-200">
                Whether you are a small business set-aside team or an enterprise prime, pick the play that matches how you
                operate.
              </p>
            </div>
            <div className="md:col-span-2 grid gap-4">
              {industryPlays.map((play) => (
                <div key={play.name} className="rounded-xl bg-slate-800 p-4 ring-1 ring-white/5">
                  <div className="text-sm font-semibold">{play.name}</div>
                  <p className="text-xs text-slate-200">{play.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-100 md:grid-cols-3">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">AI search & rewrite</h4>
              <p className="mt-2 text-sm text-slate-600">
                Convert open-ended questions into optimized keywords, NAICS/PSC tags, and structured filters mirroring SAM.gov.
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
          </section>

          <section className="grid gap-4 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Governance & security</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• SSO/SAML, RBAC, and field-level masking</li>
                <li>• Audit logs and exportable activity reports</li>
                <li>• Private LLM routing; no training on your data</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Collaboration flows</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Assign tasks and owners across capture, BD, proposal</li>
                <li>• Shared notes, redlines, and version history</li>
                <li>• Alerts, digests, and due-date guardrails</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
