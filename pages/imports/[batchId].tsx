import useSWR from 'swr';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ImportBatchDetail() {
  const router = useRouter();
  const { batchId } = router.query;
  const { data } = useSWR(batchId ? `/api/imports/${batchId}` : null, fetcher);
  const batch = data?.batch;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-2xl font-semibold">Import batch #{batchId}</h1>
        {batch ? (
          <div className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-700">Source: {batch.sourceLabel}</p>
            <p className="text-sm text-slate-700">Records: {batch.successfulRecords} successful / {batch.failedRecords} failed</p>
            <p className="text-sm text-slate-700">Created: {new Date(batch.createdAt).toLocaleString()}</p>
            {batch.errors?.length > 0 && (
              <div>
                <h3 className="font-semibold">Errors</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  {batch.errors.map((err: any) => (
                    <li key={err.id} className="rounded bg-red-50 p-2">
                      Row {err.rowNumber}: {err.errorMessage}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-600">Loading batch...</p>
        )}
      </div>
    </DashboardLayout>
  );
}
