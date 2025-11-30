import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/wall-of-love', label: 'Wall of Love' },
  { href: '/tools', label: 'Free Tools' }
];

export function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-brand-700">GovContract360</Link>
        <nav className="flex items-center space-x-4 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-x-3 text-sm font-semibold">
          <Link href="/login" className="text-slate-700 hover:text-brand-600">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded bg-brand-600 px-3 py-2 text-white shadow hover:bg-brand-700"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
