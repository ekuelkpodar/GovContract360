import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function ImportOpportunitiesPage() {
  const [csv, setCsv] = useState('title,description,agency,responseDeadline,postedDate\nExample,Example desc,DoD,2025-01-01,2024-05-01');
  const [batchId, setBatchId] = useState<number | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const previewRows = () => {
    const [header, ...rows] = csv.trim().split('\n');
    const headers = header.split(',');
    const mapped = rows.slice(0, 5).map((r) => {
      const values = r.split(',');
      return Object.fromEntries(headers.map((h, idx) => [h, values[idx]]));
    });
    setPreview(mapped);
  };

  const runImport = async () => {
    const response = await fetch('/api/imports/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv })
    });
    const data = await response.json();
    if (response.ok) {
      setBatchId(data.batch.id);
      setMessage('Import requested. Review results below.');
    } else {
      setMessage(data.error || 'Import failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Import Opportunities from CSV</h1>
          <p className="text-sm text-slate-600">Map required columns (title, description, agency, responseDeadline, postedDate).</p>
        </div>
        <textarea
          className="w-full rounded border border-slate-200 p-3 text-sm"
          rows={8}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
        />
        <div className="flex gap-3">
          <button onClick={previewRows} className="rounded bg-slate-200 px-3 py-2 text-sm">Preview</button>
          <button onClick={runImport} className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">Start Import</button>
        </div>
        {message && <p className="text-sm text-slate-700">{message}</p>}
        {preview.length > 0 && (
          <div className="rounded border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="mb-2 font-semibold">Preview (first 5 rows)</h3>
            <pre className="text-xs text-slate-700">{JSON.stringify(preview, null, 2)}</pre>
          </div>
        )}
        {batchId && <a className="text-indigo-600" href={`/imports/${batchId}`}>View batch details</a>}
      </div>
    </DashboardLayout>
  );
}
