import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';

const steps = ['Company Profile', 'Capabilities', 'Preferences'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({
    companyName: '',
    website: '',
    size: '',
    primaryNaics: '',
    primaryPsc: '',
    capabilities: { services: '' },
    keywords: '',
    preferredAgencies: '',
    preferredSetAsides: '',
    preferredNoticeTypes: '',
    typicalValueMin: '',
    typicalValueMax: '',
    baseLocation: '',
    maxDistanceMiles: ''
  });

  const update = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const submit = async () => {
    const payload = {
      ...form,
      keywords: form.keywords ? form.keywords.split(',').map((v: string) => v.trim()) : [],
      preferredAgencies: form.preferredAgencies ? form.preferredAgencies.split(',').map((v: string) => v.trim()) : [],
      preferredSetAsides: form.preferredSetAsides ? form.preferredSetAsides.split(',').map((v: string) => v.trim()) : [],
      preferredNoticeTypes: form.preferredNoticeTypes
        ? form.preferredNoticeTypes.split(',').map((v: string) => v.trim())
        : []
    };
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    router.push('/dashboard');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <p className="text-sm text-slate-600">Step {step + 1} of {steps.length}</p>
        <h1 className="text-2xl font-bold text-slate-900">Let’s personalize your feed</h1>
        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Company name
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Website
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Primary NAICS
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={form.primaryNaics}
                    onChange={(e) => update('primaryNaics', e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Primary PSC
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={form.primaryPsc}
                    onChange={(e) => update('primaryPsc', e.target.value)}
                  />
                </label>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Capabilities & services
                <textarea
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.capabilities.services}
                  onChange={(e) => update('capabilities', { services: e.target.value })}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Keywords
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder="cybersecurity, logistics, cloud"
                  value={form.keywords}
                  onChange={(e) => update('keywords', e.target.value)}
                />
              </label>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Preferred agencies
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.preferredAgencies}
                  onChange={(e) => update('preferredAgencies', e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Preferred set-asides
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.preferredSetAsides}
                  onChange={(e) => update('preferredSetAsides', e.target.value)}
                />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Typical min value
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={form.typicalValueMin}
                    onChange={(e) => update('typicalValueMin', e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Typical max value
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={form.typicalValueMax}
                    onChange={(e) => update('typicalValueMax', e.target.value)}
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Base location
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.baseLocation}
                  onChange={(e) => update('baseLocation', e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Max distance (miles)
                <input
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={form.maxDistanceMiles}
                  onChange={(e) => update('maxDistanceMiles', e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded border px-3 py-2 text-sm"
            disabled={step === 0}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Next
            </button>
          ) : (
            <button onClick={submit} className="rounded bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
              Save profile
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
