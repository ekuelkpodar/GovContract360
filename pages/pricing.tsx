import { Layout } from '../components/Layout';
import { PlanCard } from '../components/PlanCard';

export default function Pricing() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">Pricing</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Simple plans that scale with your pipeline</h1>
          <p className="mt-3 text-lg text-slate-600">Choose a plan that fits your capture team. Upgrade anytime.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <PlanCard
            name="Starter"
            price="$59/mo"
            description="Great for solo consultants evaluating a handful of deals."
            features={['Natural language search', 'AI summaries (50/mo)', 'Saved searches & alerts', 'Email support']}
            cta="Start trial"
          />
          <PlanCard
            name="Professional"
            price="$199/mo"
            description="For capture teams who want automation and collaboration."
            features={[
              'Everything in Starter',
              'AI summaries (unlimited)',
              'Proposal generator',
              'Pipeline and Kanban',
              'Team workspaces'
            ]}
            cta="Get started"
          />
          <PlanCard
            name="Enterprise"
            price="Custom"
            description="Security-first deployments with SSO, custom integrations, and SLAs."
            features={['SOC2-ready controls', 'Dedicated CSM', 'Private model hosting', 'Onboarding & training']}
            cta="Book a demo"
          />
        </div>
        <div className="mt-12 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Feature comparison</h2>
          <div className="mt-4 grid grid-cols-4 text-sm font-semibold text-slate-600">
            <div></div>
            <div>Starter</div>
            <div>Professional</div>
            <div>Enterprise</div>
          </div>
          {[
            'AI search and rewrite',
            'AI summaries',
            'Proposal generator',
            'Pipeline & collaboration',
            'Alerts',
            'SSO & security add-ons'
          ].map((row) => (
            <div key={row} className="grid grid-cols-4 border-t py-2 text-sm text-slate-700">
              <div>{row}</div>
              <div className="text-center">✅</div>
              <div className="text-center">✅</div>
              <div className="text-center">{row === 'SSO & security add-ons' ? '✅' : '✅'}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
