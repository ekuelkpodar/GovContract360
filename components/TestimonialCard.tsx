interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  quote: string;
}

export function TestimonialCard({ name, role, company, quote }: TestimonialProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-700">“{quote}”</p>
      <div className="mt-4 text-xs font-semibold text-slate-600">
        {name} • {role}, {company}
      </div>
    </div>
  );
}
