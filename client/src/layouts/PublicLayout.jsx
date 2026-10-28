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
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
            <Sprout className="h-7 w-7" /> AgroCane 360
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.to} className="text-sm font-medium text-gray-600 hover:text-brand-700">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <NavLink to="/login" className="rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
                Farmer Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/login" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                Admin Login
              </NavLink>
            </li>
          </ul>

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <div className="space-y-2 border-t border-brand-100 bg-white px-4 py-4 md:hidden">
            {links.map((l) => (
              <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="block py-2 text-gray-700">
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="block py-2 font-medium text-brand-700">Farmer Login</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="block py-2 font-medium text-brand-700">Farmer Registration</Link>
            <Link to="/admin/login" onClick={() => setOpen(false)} className="block py-2 font-medium text-brand-700">Admin Login</Link>
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
