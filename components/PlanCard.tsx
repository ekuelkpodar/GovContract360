interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
}

export function PlanCard({ name, price, description, features, cta }: PlanCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
      <p className="mt-1 text-3xl font-bold text-brand-700">{price}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {features.map((feature) => (
          <li key={feature} className="flex items-start space-x-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700">
        {cta}
      </button>
    </div>
  );
}
