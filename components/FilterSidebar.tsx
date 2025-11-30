import { Dispatch, SetStateAction } from 'react';

export interface FilterState {
  agency: string;
  department: string;
  naics: string;
  setAside: string;
  noticeType: string;
  valueMin: string;
  valueMax: string;
  onlyActive: boolean;
}

export function FilterSidebar({ filters, setFilters }: { filters: FilterState; setFilters: Dispatch<SetStateAction<FilterState>> }) {
  const update = (key: keyof FilterState, value: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-xs text-slate-500">Agency</label>
          <input
            value={filters.agency}
            onChange={(e) => update('agency', e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="e.g., Department of Defense"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Department</label>
          <input
            value={filters.department}
            onChange={(e) => update('department', e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Army, Air Force"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">NAICS</label>
          <input
            value={filters.naics}
            onChange={(e) => update('naics', e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="541512"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Set-aside</label>
          <select
            value={filters.setAside}
            onChange={(e) => update('setAside', e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Any</option>
            <option value="Small Business">Small Business</option>
            <option value="WOSB">WOSB</option>
            <option value="SDVOSB">SDVOSB</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500">Notice type</label>
          <select
            value={filters.noticeType}
            onChange={(e) => update('noticeType', e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Any</option>
            <option value="Solicitation">Solicitation</option>
            <option value="Sources Sought">Sources Sought</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-slate-500">Value min</label>
            <input
              value={filters.valueMin}
              onChange={(e) => update('valueMin', e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="100000"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Value max</label>
            <input
              value={filters.valueMax}
              onChange={(e) => update('valueMax', e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="1000000"
            />
          </div>
        </div>
        <label className="flex items-center space-x-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={filters.onlyActive}
            onChange={(e) => update('onlyActive', e.target.checked)}
            className="rounded"
          />
          <span>Only active opportunities</span>
        </label>
      </div>
    </aside>
  );
}
