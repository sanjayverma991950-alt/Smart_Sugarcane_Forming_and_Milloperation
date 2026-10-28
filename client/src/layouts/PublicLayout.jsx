import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Sprout, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/#faq", label: "FAQ" },
  { to: "/#contact", label: "Contact" },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-3.5 py-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-brand-700">
            <Sprout className="h-6 w-6 sm:h-7 sm:w-7 text-brand-600" /> AgroCane 360
          </Link>

          <ul className="hidden items-center gap-5 lg:gap-6 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.to} className="text-sm font-medium text-gray-600 transition hover:text-brand-700">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <NavLink to="/login" className="rounded-xl border border-brand-600 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition">
                Farmer Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/login" className="rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-700 shadow-xs transition">
                Admin Login
              </NavLink>
            </li>
          </ul>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="space-y-2 border-t border-brand-100 bg-white px-4 py-5 shadow-lg md:hidden">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-brand-600 py-2.5 font-semibold text-brand-700 hover:bg-brand-50"
              >
                Farmer Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 shadow-xs"
              >
                Farmer Registration
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-gray-300 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Admin Login (Staff Only)
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-900 py-8 text-center text-sm text-brand-100">
        <p>© {new Date().getFullYear()} AgroCane 360. A B.Tech final-year project.</p>
        <p className="mt-1 text-brand-100/70">
          Not affiliated with any government department. AI guidance is informational only.
        </p>
      </footer>
    </div>
  );
}
