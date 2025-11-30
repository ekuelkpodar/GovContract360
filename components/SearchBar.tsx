interface SearchBarProps {
  query: string;
  useAI: boolean;
  onQueryChange: (val: string) => void;
  onSubmit: () => void;
  onToggleAI: (val: boolean) => void;
}

export function SearchBar({ query, onQueryChange, onSubmit, useAI, onToggleAI }: SearchBarProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search federal opportunities in plain English"
          className="w-full flex-1 rounded border px-4 py-3 text-base shadow-sm focus:border-brand-500 focus:outline-none"
        />
        <button
          onClick={onSubmit}
          className="w-full rounded bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700 md:w-auto"
        >
          Search
        </button>
      </div>
      <label className="mt-3 flex items-center space-x-2 text-xs text-slate-600">
        <input type="checkbox" checked={useAI} onChange={(e) => onToggleAI(e.target.checked)} />
        <span>Use AI rewrite to refine the query</span>
      </label>
    </div>
  );
}
