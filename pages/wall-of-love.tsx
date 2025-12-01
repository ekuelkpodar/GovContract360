import { Layout } from '../components/Layout';
import { TestimonialCard } from '../components/TestimonialCard';

const testimonials = [
  { name: 'Priya B.', role: 'VP Capture', company: 'VectorGov', quote: 'We shaved days off our capture cycles.' },
  {
    name: 'Caleb R.',
    role: 'Founder',
    company: 'Horizon Analytics',
    quote: 'The AI summaries are the fastest way to understand a new RFP.'
  },
  {
    name: 'Lauren K.',
    role: 'Proposal Manager',
    company: 'Summit Partners',
    quote: 'Proposal drafts give my writers a confident starting point.'
  },
  {
    name: 'Isaac T.',
    role: 'COO',
    company: 'Apex Solutions',
    quote: 'Alerts surface the contracts that matter instead of inbox noise.'
  },
  {
    name: 'Daria N.',
    role: 'Director, BD',
    company: 'Northwind Systems',
    quote: 'Saved searches with AI rewrites increased quality fits in our funnel.'
  },
  {
    name: 'Mohamed A.',
    role: 'Capture Lead',
    company: 'Atlas Gov',
    quote: 'Compliance radar flags issues before red team ever sees it.'
  }
];

const highlights = [
  { label: 'Time saved per week', value: '18 hrs', detail: 'Triaging and summarizing RFPs' },
  { label: 'Opportunities triaged', value: '9,400+', detail: 'Across federal agencies' },
  { label: 'Teams onboarded', value: '120+', detail: 'Capture, BD, proposals' }
];

const proofPoints = [
  'AI briefings with win themes, risks, and compliance checkpoints',
  'Saved searches with quiet hours and digest summaries',
  'Proposal drafts aligned to your style guide and past performance',
  'Pipeline visibility with deadlines, owners, and notes in one place'
];

export default function WallOfLove() {
  return (
    <Layout>
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-10 h-48 w-48 rounded-full bg-brand-50 blur-3xl" />
          <div className="absolute right-10 top-32 h-36 w-36 rounded-full bg-brand-100 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-16 space-y-12">
          <header className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Wall of Love</p>
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
              What capture and proposal teams say about GovContract360
            </h1>
            <p className="text-lg text-slate-600">
              Real teams using AI assistance to accelerate contract pursuit, reduce inbox noise, and move faster to
              submission.
            </p>
          </header>

          <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 md:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.label} className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-600">{h.label}</div>
                <div className="text-3xl font-bold text-brand-700">{h.value}</div>
                <div className="text-xs text-slate-500">{h.detail}</div>
              </div>
            ))}
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </section>

          <section className="grid gap-6 rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg ring-1 ring-slate-800 md:grid-cols-[2fr,1fr]">
            <div>
              <h2 className="text-2xl font-semibold">Why teams stay</h2>
              <p className="mt-2 text-sm text-slate-200">
                AI-first workflows reduce triage time and keep proposals compliant without adding chaos.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-100">
                {proofPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-300" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-4 text-slate-900 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold">Join them</h3>
              <p className="mt-2 text-sm text-slate-600">
                See how AI briefings, alerts, and proposal assists fit your team’s capture flow.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
                <a href="/search" className="rounded-lg bg-brand-600 px-4 py-2 text-center text-white shadow hover:bg-brand-700">
                  Try search
                </a>
                <a
                  href="mailto:hello@govcontract360.com"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-center text-slate-900 hover:border-brand-300 hover:text-brand-700"
                >
                  Book a demo
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
