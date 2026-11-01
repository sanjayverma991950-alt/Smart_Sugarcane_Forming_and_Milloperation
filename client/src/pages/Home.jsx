import { Link } from "react-router-dom";
import {
  Sprout,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Route,
  HelpCircle,
  Mail,
  UserCheck,
  Scale,
  Wallet,
} from "lucide-react";

const portalCards = [
  {
    icon: Layers,
    title: "Platform Features",
    desc: "Explore digital supply tickets, weighbridge integration, transparent payment ledgers, and AI agronomy tools.",
    link: "/features",
    cta: "Explore Features",
    badge: "Capabilities",
  },
  {
    icon: Route,
    title: "How It Works",
    desc: "Follow the step-by-step workflow connecting farmers, field supervisors, and sugar mill operations from indent to payout.",
    link: "/how-it-works",
    cta: "View Workflow",
    badge: "Process",
  },
  {
    icon: HelpCircle,
    title: "Help & FAQ",
    desc: "Find clear answers to common questions regarding ticket quotas, delivery weighments, payments, and data privacy.",
    link: "/faq",
    cta: "Browse Answers",
    badge: "Help Center",
  },
  {
    icon: Mail,
    title: "Support & Contact",
    desc: "Need direct assistance? Get in touch with our support team at sanjay12345@gmail.com or send an inquiry.",
    link: "/contact",
    cta: "Get In Touch",
    badge: "Contact",
  },
];

const highlights = [
  {
    icon: Scale,
    title: "Verified Weighbridge Sync",
    desc: "Zero arithmetic errors with automated Gross, Tare, and Net Cane weight recording at the mill gate.",
  },
  {
    icon: Wallet,
    title: "Transparent SAP Accounting",
    desc: "Complete ledger tracking verified deliveries, official rates per quintal, advance deductions, and balances.",
  },
  {
    icon: UserCheck,
    title: "Role-Based Data Privacy",
    desc: "Strict isolation ensures farmers only access their personal plot records and financial ledgers.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-earth-100">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 px-3.5 sm:px-4 py-12 sm:py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1 text-xs sm:text-sm font-semibold text-brand-700">
              <Sprout className="h-4 w-4" /> AI-driven sugarcane platform
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-900 sm:text-4xl md:text-5xl">
              Smarter sugarcane farming and mill operations
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Manage fields, digital supply tickets, weighbridge deliveries, and payments in one unified place—with
              AI crop disease scanning, weather alerts, and a bilingual voice assistant.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 sm:px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition"
              >
                Farmer Registration <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-brand-600 px-5 sm:px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50 transition"
              >
                Farmer Login
              </Link>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 sm:px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Admin Login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-lg border border-brand-100">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-center">
              {[
                ["Fields", "Track all your plots"],
                ["Tickets", "Live status updates"],
                ["Payments", "Clear balances"],
                ["AI Help", "Hindi & English"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-2xl bg-brand-50 p-3 sm:p-5">
                  <p className="text-base sm:text-lg font-semibold text-brand-700">{t}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{s}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">
              Live operational dashboard for registered sugarcane growers and sugar mill administrations.
            </p>
          </div>
        </div>
      </section>

      {/* Explore Modules (Portal Navigation) */}
      <section className="mx-auto max-w-6xl px-3.5 sm:px-4 py-16 sm:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3.5 py-1 text-xs font-bold text-brand-800">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" /> Platform Directory
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-brand-900">
            Explore AgroCane 360
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Choose a section below to learn more about our features, process, answers to common questions, or contact support.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {portalCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex rounded-xl bg-brand-100 p-3 text-brand-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 hover:gap-2 transition-all"
                  >
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Transparency Pillars */}
      <section className="bg-earth-100/60 py-16 sm:py-20 border-y border-brand-100/60">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">
              Built on Trust, Accuracy, and Transparency
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Bridging the gap between sugarcane producers and mill management with modern digital standards.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="rounded-2xl bg-white p-6 shadow-sm border border-brand-100">
                  <div className="inline-flex rounded-xl bg-brand-100 p-3 text-brand-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900 text-lg">{h.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Safeguard Notice */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-brand-600" />
        <h2 className="mt-3 text-2xl font-bold text-brand-900">AI that stays in its lane</h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-relaxed">
          AI explains and advises. It never approves tickets, records payments, or changes verified
          weights. All financial accounting and weighment figures come strictly from verified database records.
        </p>
      </section>
    </>
  );
}
