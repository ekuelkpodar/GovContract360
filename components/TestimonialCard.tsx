interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  quote: string;
}

export function TestimonialCard({ name, role, company, quote }: TestimonialProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm text-slate-700">“{quote}”</p>
      <div className="mt-4 text-xs font-semibold text-slate-600">
        {name} • {role}, {company}
      </div>
    </div>
  );
}
