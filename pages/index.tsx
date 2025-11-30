import { Layout } from '../components/Layout';
import Link from 'next/link';
import { TestimonialCard } from '../components/TestimonialCard';

export default function Home() {
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

  const features = [
    {
      title: 'AI-powered search',
      description: 'Ask in plain English and we normalize it into powerful SAM.gov filters.'
    },
    {
      title: 'Instant AI summaries',
      description: 'Digest dense RFPs with concise, structured takeaways for your team.'
    },
    { title: 'Saved searches & alerts', description: 'Stay ahead of new releases with smart notifications.' },
    {
      title: 'Proposal assistant',
      description: 'Generate outlines, sections, and compliance checklists in one click.'
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center">
          <div className="rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
            AI-powered government contract search & proposal assistant
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Find, qualify, and pursue federal contracts faster.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            GovContract360 combines real-time contract intelligence with AI-driven summaries and proposal generation so your
            team can focus on winning.
          </p>
          <div className="mt-8 flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0">
            <Link
              href="/search"
              className="rounded-lg bg-brand-600 px-6 py-3 text-white shadow hover:bg-brand-700"
            >
              Start searching
            </Link>
            <a
              href="mailto:hello@govcontract360.com"
              className="rounded-lg border border-brand-200 px-6 py-3 text-brand-700 hover:border-brand-400"
            >
              Book a demo
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 rounded-xl bg-white p-8 shadow-sm md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg bg-slate-50 p-4 text-left">
                <h3 className="text-lg font-semibold text-slate-800">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="rounded-lg border bg-white p-4 text-sm text-slate-700">
                <div className="text-xs font-semibold text-brand-600">Step {step}</div>
                <p className="mt-2">
                  {step === 1 && 'Search in natural language with AI rewrite to expand keywords.'}
                  {step === 2 && 'Filter by agency, NAICS, set-aside, and value to target the right fits.'}
                  {step === 3 && 'Review AI summaries, attachments, and key dates at a glance.'}
                  {step === 4 && 'Generate proposal drafts and track pipeline status with your team.'}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900">Trusted by modern GovCon teams</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-white p-6 text-center text-slate-500 md:grid-cols-6">
            {['Apex', 'Northwind', 'Skyline', 'CivicLabs', 'Atlas', 'Vector'].map((logo) => (
              <div key={logo} className="rounded bg-slate-50 px-3 py-4 text-sm font-semibold">
                {logo}
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900">What our customers say</h2>
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
