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
  }
];

export default function WallOfLove() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">Wall of Love</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">What capture teams say about GovContract360</h1>
          <p className="mt-3 text-lg text-slate-600">Real teams using AI assistance to accelerate contract pursuit.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
