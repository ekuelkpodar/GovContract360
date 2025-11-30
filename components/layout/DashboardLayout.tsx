import { ReactNode } from 'react';
import { Navbar } from '../Navbar';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/saved', label: 'Saved' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/proposals', label: 'Proposals' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/analytics/pipeline', label: 'Analytics' },
  { href: '/imports/opportunities', label: 'Imports' },
  { href: '/settings', label: 'Settings' }
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <h3 className="mb-4 text-lg font-semibold">Workspace</h3>
        <nav className="space-y-2">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="block rounded px-3 py-2 text-sm hover:bg-slate-100">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
