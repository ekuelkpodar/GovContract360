import Link from 'next/link';
import { Opportunity } from '@prisma/client';

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/opportunity/${opportunity.id}`} className="text-lg font-semibold text-brand-700">
            {opportunity.title}
          </Link>
          <p className="text-sm text-slate-600">
            {opportunity.agency} {opportunity.department ? `• ${opportunity.department}` : ''}
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {opportunity.noticeType}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-700">{opportunity.description}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 md:grid-cols-4">
        <span>Set-aside: {opportunity.setAside || 'N/A'}</span>
        <span>
          Value: ${opportunity.estimatedValueMin?.toLocaleString()} - ${
            opportunity.estimatedValueMax?.toLocaleString()
          }
        </span>
        <span>Deadline: {new Date(opportunity.responseDeadline).toLocaleDateString()}</span>
        <span>Status: {opportunity.status}</span>
      </div>
      <div className="mt-3 flex space-x-3 text-sm">
        <Link href={`/opportunity/${opportunity.id}`} className="text-brand-700 hover:text-brand-800">
          View details
        </Link>
        <button className="text-slate-600 hover:text-brand-700">Save</button>
      </div>
    </div>
  );
}
