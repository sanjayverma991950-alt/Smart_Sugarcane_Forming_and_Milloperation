import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Sprout, Menu, X, Mail } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
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
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-medium transition pb-1 ${
                      isActive
                        ? "text-brand-700 font-bold border-b-2 border-brand-600"
                        : "text-gray-600 hover:text-brand-700"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/login"
                className="rounded-xl border border-brand-600 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition"
              >
                Farmer Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/login"
                className="rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-700 shadow-xs transition"
              >
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
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-base font-medium transition ${
                    isActive
                      ? "bg-brand-100 text-brand-800 font-bold"
                      : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
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

      <footer className="bg-brand-900 py-10 text-brand-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-brand-800 pb-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <Sprout className="h-7 w-7 text-brand-400" /> AgroCane 360
            </Link>

            <ul className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-sm font-medium text-brand-200">
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-center md:text-right">
              <span className="text-xs text-brand-300 block">Support & Inquiries</span>
              <a
                href="mailto:sanjay12345@gmail.com"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-brand-200 underline mt-0.5"
              >
                <Mail className="h-4 w-4 text-brand-400" /> sanjay12345@gmail.com
              </a>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-brand-200/70 space-y-1">
            <p>© {new Date().getFullYear()} AgroCane 360. A B.Tech final-year project.</p>
            <p>
              Not affiliated with any government department. AI guidance is informational only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
