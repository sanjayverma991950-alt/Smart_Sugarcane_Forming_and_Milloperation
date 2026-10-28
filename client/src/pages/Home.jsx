import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Sprout, Ticket, Wallet, CloudSun, Camera, Mic, BarChart3, Bell,
  ChevronDown, ShieldCheck, ArrowRight,
} from "lucide-react";

const features = [
  { icon: Ticket, title: "Supply Tickets", text: "Request sugarcane supply tickets and track approval and delivery status." },
  { icon: Wallet, title: "Payment Tracking", text: "See verified supply, payable amount, paid amount and balance clearly." },
  { icon: Camera, title: "Crop Disease Check", text: "Upload a leaf photo for preliminary AI guidance on possible problems." },
  { icon: CloudSun, title: "Weather & Irrigation", text: "Forecast-based alerts and irrigation suggestions for your fields." },
  { icon: Mic, title: "Hindi & English Voice", text: "Ask about tickets, payments and season dates by voice or text." },
  { icon: BarChart3, title: "Mill Analytics", text: "Admins get procurement reports and supply forecasts from real records." },
];

const steps = [
  { n: 1, title: "Register", text: "Create your farmer account and add your fields." },
  { n: 2, title: "Request a Ticket", text: "Submit a supply ticket request for the active season." },
  { n: 3, title: "Admin Review", text: "The mill reviews and approves according to its rules." },
  { n: 4, title: "Deliver & Track", text: "Verified weighments update your ticket and payment." },
];

const faqs = [
  { q: "Is the AI advice official?", a: "No. AI output is general guidance only. It is not an official instruction from a sugar mill or government, and it is not a confirmed diagnosis." },
  { q: "Can I see other farmers' data?", a: "No. You can only see your own records, and the server enforces this." },
  { q: "Does the app transfer money?", a: "No. AgroCane 360 records and tracks payments entered by authorized mill staff. It does not move money." },
  { q: "Which languages are supported?", a: "English and Hindi, including Hinglish typing in the assistant." },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-earth-100">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 px-3.5 sm:px-4 py-10 sm:py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs sm:text-sm font-medium text-brand-700">
              <Sprout className="h-4 w-4" /> AI-driven sugarcane platform
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-900 sm:text-4xl md:text-5xl">
              Smarter sugarcane farming and mill operations
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Manage fields, tickets, deliveries and payments in one place, with weather alerts,
              crop guidance and a Hindi/English voice assistant.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 sm:px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition">
                Farmer Registration <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-brand-600 px-5 sm:px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50 transition">
                Farmer Login
              </Link>
              <Link to="/admin/login" className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 sm:px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition">
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
              Illustrative preview. Replace with real photos or illustrations later.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-3.5 sm:px-4 py-12 sm:py-16">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-900">Platform features</h2>
        <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-brand-100 bg-white p-5 sm:p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-xl bg-brand-100 p-3 text-brand-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-earth-100 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-900">How it works</h2>
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white p-5 sm:p-6 text-center shadow-sm">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI notice */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-brand-600" />
        <h2 className="mt-3 text-2xl font-bold text-brand-900">AI that stays in its lane</h2>
        <p className="mt-3 text-gray-600">
          AI explains and advises. It never approves tickets, records payments or changes verified
          weights. Account numbers always come from verified database records.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-center text-3xl font-bold text-brand-900">Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-xl border bg-white">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                {f.q}
                <ChevronDown className={`h-5 w-5 transition ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-brand-50 py-12 text-center">
        <Bell className="mx-auto h-8 w-8 text-brand-600" />
        <h2 className="mt-2 text-xl font-bold text-brand-900">Contact</h2>
        <p className="mt-1 text-gray-600">Email: support@example.com (replace with your real contact)</p>
      </section>
    </>
  );
}
