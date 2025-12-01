import { Layout } from '../components/Layout';
import Link from 'next/link';
import { TestimonialCard } from '../components/TestimonialCard';

export default function Home() {
  const heroSignals = [
    { label: 'Daily opportunities parsed', value: '9,400+', tone: 'text-brand-600' },
    { label: 'Teams onboarded', value: '120+', tone: 'text-emerald-600' },
    { label: 'Average time saved', value: '18 hrs/wk', tone: 'text-slate-900' }
  ];

  const features = [
    {
      title: 'Opportunity intelligence',
      description: 'Layer NAICS, PSC, set-aside, and geography filters on top of AI keyword expansion.'
    },
    {
      title: 'AI briefings',
      description: 'Instant summaries with win themes, risks, and compliance checkpoints for every notice.'
    },
    { title: 'Auto-alerts & digests', description: 'Smart alerts tuned to your capture plan, not a noisy inbox.' },
    {
      title: 'Proposal workspace',
      description: 'Draft sections, red-team with comments, and export in your brand in minutes.'
    }
  ];

  const workflow = [
    { title: 'Search smarter', copy: 'Ask in plain language; we normalize to SAM.gov and FPDS with AI keyword boosts.' },
    {
      title: 'Qualify in one view',
      copy: 'See value ranges, small business flags, POP, partners, and risk signals side-by-side.'
    },
    { title: 'Decide & assign', copy: 'Route to capture, set owners and due dates, and subscribe stakeholders.' },
    { title: 'Propose with AI', copy: 'Generate outlines, draft sections, and check compliance before submission.' }
  ];

  const testimonials = [
    {
      name: 'Ariana M.',
      role: 'VP, Growth',
      company: 'Atlas Gov',
      quote: 'GovContract360 helped us prioritize the winnable deals and focus our writers.'
    },
    {
      name: 'Marcus H.',
      role: 'CEO',
      company: 'CivicTech Labs',
      quote: 'The AI summaries dramatically reduced time spent triaging daily feeds.'
    },
    {
      name: 'Jennifer P.',
      role: 'Capture Lead',
      company: 'Northwind',
      quote: 'Saved searches with alerts keep our inbox clean and actionable.'
    }
  ];

  return (
    <Layout>
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-12 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-100 blur-3xl" />
          <div className="absolute right-10 top-32 h-40 w-40 rounded-full bg-brand-50 blur-2xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-10 pt-16 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <span>AI GovCon intelligence + proposal workspace</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Find, qualify, and win federal contracts with precision.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                GovContract360 unifies opportunity search, AI briefings, alerts, and proposal drafting so capture, BD, and
                delivery teams stay in lockstep from day one.
              </p>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Start searching
              </Link>
              <a
                href="mailto:hello@govcontract360.com"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
              >
                Book a demo
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              {heroSignals.map((signal) => (
                <div key={signal.label} className="border-l border-slate-100 pl-3 first:border-0 first:pl-0">
                  <div className={`text-lg font-semibold ${signal.tone}`}>{signal.value}</div>
                  <div className="text-xs text-slate-500">{signal.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 translate-x-8 translate-y-6 rounded-3xl bg-gradient-to-tr from-brand-50 to-slate-100 blur-xl" />
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-brand-900/5 ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">Live view</div>
                  <div className="text-sm text-slate-500">Opportunity triage & pipeline</div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Synced</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {['AI summary', 'Decision drivers', 'Tasks', 'Proposal outline'].map((row, idx) => (
                  <div key={row} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{row}</div>
                      <p className="text-xs text-slate-500">
                        {idx === 0 && 'Win themes, risks, partners, compliance flags.'}
                        {idx === 1 && 'Value, POP, set-aside, incumbent signals.'}
                        {idx === 2 && 'Assign to capture, BD, or proposal with due dates.'}
                        {idx === 3 && 'Draft sections aligned to RFP structure with AI assists.'}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">AI</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid gap-6 rounded-2xl bg-white/90 p-8 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col space-y-2 rounded-xl bg-slate-50/70 p-4">
                <div className="h-9 w-9 rounded-lg bg-brand-50 text-center text-lg font-semibold text-brand-700">✦</div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="rounded-2xl bg-slate-900 px-8 py-10 text-white shadow-xl">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">Workflow</p>
                <h2 className="text-3xl font-semibold">A clear path from discovery to proposal</h2>
                <p className="max-w-2xl text-sm text-slate-200">
                  Replace fragmented tools with a single flow for capture, BD, and proposal teams. Every step is tracked,
                  assigned, and backed by AI to keep you ahead of deadlines.
                </p>
              </div>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                See use cases
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {workflow.map((step, idx) => (
                <div key={step.title} className="rounded-xl bg-slate-800 p-4 ring-1 ring-white/5">
                  <div className="text-xs font-semibold text-brand-200">Step {idx + 1}</div>
                  <div className="mt-2 text-base font-semibold">{step.title}</div>
                  <p className="mt-2 text-sm text-slate-200">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid gap-6 rounded-2xl bg-white p-8 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">AI assistance</p>
              <h2 className="text-3xl font-semibold text-slate-900">Briefings, alerts, and proposal drafts on autopilot</h2>
              <p className="text-sm text-slate-600">
                GovContract360 keeps your team informed with curated digests, highlights compliance requirements, and
                drafts proposal sections that reflect your past wins and style guides.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { title: 'Morning digest', copy: 'Daily AI recap with only the fits that matter.' },
                  { title: 'Compliance radar', copy: 'Automatic section-by-section checks before submission.' },
                  { title: 'Win themes', copy: 'Suggested differentiators pulled from your past performance.' },
                  { title: 'Smart alerts', copy: 'Noisy feeds suppressed; critical updates escalated.' }
                ].map((item) => (
                  <div key={item.title} className="rounded-lg bg-slate-50 p-3">
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <p className="text-xs text-slate-600">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900/90 p-6 text-white shadow-inner shadow-slate-900/30 ring-1 ring-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-100">Security & governance</p>
              <h3 className="mt-3 text-2xl font-semibold">Built for compliance-first teams</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-100">
                <li>• SOC2-aligned controls and access logging</li>
                <li>• Role-based permissions for capture, proposal, and delivery</li>
                <li>• Data residency options for regulated environments</li>
                <li>• No training on your data; private LLM routing with auditability</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-900">
                <span className="rounded-full bg-white px-3 py-1">Single Sign-On</span>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-900">Field-level masking</span>
                <span className="rounded-full bg-white px-3 py-1">Private deployments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <h2 className="text-3xl font-semibold text-slate-900">Trusted by modern GovCon teams</h2>
          <p className="mt-2 text-sm text-slate-600">From small business set-aside specialists to enterprise capture orgs.</p>
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-white p-6 text-center text-slate-500 shadow ring-1 ring-slate-100 md:grid-cols-6">
            {['Apex', 'Northwind', 'Skyline', 'CivicLabs', 'Atlas', 'Vector'].map((logo) => (
              <div key={logo} className="rounded bg-slate-50 px-3 py-4 text-sm font-semibold">
                {logo}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Customer results</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">What our customers say</h2>
              <p className="text-sm text-slate-600">Stories from teams moving faster with AI-first workflows.</p>
            </div>
            <Link
              href="/wall-of-love"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
            >
              View more
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
