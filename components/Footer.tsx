export function Footer() {
  return (
    <footer className="mt-16 border-t bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 text-sm text-slate-600 md:flex-row">
        <p>© {new Date().getFullYear()} GovContract360. Built for modern GovCon teams.</p>
        <div className="flex space-x-4">
          <a className="hover:text-brand-600" href="/pricing">
            Pricing
          </a>
          <a className="hover:text-brand-600" href="/solutions">
            Solutions
          </a>
          <a className="hover:text-brand-600" href="/wall-of-love">
            Testimonials
          </a>
        </div>
      </div>
    </footer>
  );
}
