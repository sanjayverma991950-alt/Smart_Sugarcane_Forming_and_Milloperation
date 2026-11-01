import { Link } from "react-router-dom";
import {
  Ticket,
  Wallet,
  Camera,
  CloudSun,
  Mic,
  BarChart3,
  MapPin,
  Scale,
  ShieldCheck,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck,
} from "lucide-react";

const coreFeatures = [
  {
    icon: Ticket,
    badge: "Supply Management",
    title: "Digital Sugarcane Supply Tickets",
    desc: "Eliminates physical slips and middlemen. Farmers can request supply tickets directly from their mobile devices for active crushing seasons and track status in real time.",
    highlights: [
      "Real-time ticket approval workflow",
      "Assigned calendar dispatch dates",
      "Quota management based on verified field acreage",
      "Instant SMS and in-app status notifications",
    ],
  },
  {
    icon: Scale,
    badge: "Weighbridge Operations",
    title: "Automated Weighment & Digital Slips",
    desc: "Connects mill weighbridge operations directly to farmer ledgers. Authorized operators record Gross and Tare weights with automatic Net Cane Weight calculation.",
    highlights: [
      "Tamper-proof weighbridge records",
      "Instant electronic weighment receipts",
      "Detailed truck/tractor vehicle logging",
      "Zero manual data re-entry errors",
    ],
  },
  {
    icon: Wallet,
    badge: "Financial Transparency",
    title: "Transparent Payment Ledger & Passbook",
    desc: "Clear and transparent accounting based on official State Advised Price (SAP) rates per quintal. Farmers see gross earnings, advance deductions, and live balances.",
    highlights: [
      "Automatic SMP / SAP calculation per quintal",
      "Detailed history of disbursed installments",
      "Real-time pending balance tracking",
      "Downloadable financial summary statements",
    ],
  },
  {
    icon: Camera,
    badge: "AI Agronomy",
    title: "AI Sugarcane Crop Disease Detection",
    desc: "Point-and-click crop pathology assistant. Upload a photo of sugarcane leaves or stems to receive immediate preliminary AI diagnostics and safe treatment measures.",
    highlights: [
      "Detects Red Rot, Smut, Wilt, and Grassy Shoot",
      "Actionable cultural and organic treatment advice",
      "Historical photo diagnostic log per field",
      "Clear safety disclaimers for field application",
    ],
  },
  {
    icon: CloudSun,
    badge: "Smart Farming",
    title: "Live Weather & Irrigation Advisory",
    desc: "Hyperlocal weather forecasts powered by high-resolution meteorological models. Receive rain alerts and customized watering schedules to protect your crop.",
    highlights: [
      "7-day hourly temperature, humidity, and wind forecasts",
      "Precipitation probability and storm alerts",
      "Soil moisture-based irrigation recommendations",
      "Water conservation guidance for cane tillering phases",
    ],
  },
  {
    icon: Mic,
    badge: "Voice Technology",
    title: "Bilingual Voice & Text AI Assistant",
    desc: "Speech-enabled assistant supporting English, Hindi, and Hinglish. Farmers can speak into their microphone to inquire about ticket status, payments, and crushing dates.",
    highlights: [
      "Natural voice recognition and text-to-speech output",
      "Strict grounding in verified database records",
      "Understands regional dialects and agricultural terms",
      "Fast answers to complex queries in seconds",
    ],
  },
  {
    icon: MapPin,
    badge: "Plot Registry",
    title: "Comprehensive Land & Field Mapping",
    desc: "Register each agricultural plot with crop variety (e.g., Co 0238, Co 86032, CoSe 92423), planting date, soil type, and exact acreage in acres or hectares.",
    highlights: [
      "Detailed multi-field management per farmer",
      "Cane variety and ratoon cycle tracking",
      "Acreage-to-yield ratio calculations",
      "Complete historical harvest records",
    ],
  },
  {
    icon: BarChart3,
    badge: "Mill Intelligence",
    title: "Admin Analytics & Supply Forecasting",
    desc: "Provides sugar mill management with actionable intelligence. Monitor crushing progress, daily gate arrivals, payment disbursements, and statistical supply forecasts.",
    highlights: [
      "Real-time crushing season performance charts",
      "Statistical supply forecasting from registered acreage",
      "Audit trail logs for administrative accountability",
      "Exportable regulatory compliance reports",
    ],
  },
  {
    icon: Bell,
    badge: "Communication",
    title: "Grievance Redressal & Announcements",
    desc: "Two-way communication channel between farmers and mill management. File formal tickets for weighment or payment queries and receive broadcast advisories.",
    highlights: [
      "Formal grievance tracking with mill responses",
      "Mill-wide broadcast announcements (rates, holidays)",
      "Automated push notifications for key actions",
      "Audit logs for dispute resolutions",
    ],
  },
];

const highlights = [
  { label: "100% Transparent", desc: "No hidden deductions or unaccounted deliveries." },
  { label: "Bilingual Support", desc: "Native English and Hindi voice & text navigation." },
  { label: "Mobile First", desc: "Runs smoothly on all smartphones and low-bandwidth connections." },
  { label: "Data Security", desc: "Strict role-based access control protecting farmer records." },
];

export default function Features() {
  return (
    <div className="bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-700/80 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-brand-100 backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-300" /> Platform Capabilities
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Features Built for Modern Sugarcane Farming
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-brand-100/90 leading-relaxed">
            AgroCane 360 brings together digital indenting, automated weighbridge integration,
            transparent payment passbooks, and AI agricultural intelligence into one unified platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-800 shadow-md hover:bg-brand-50 transition"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-400/40 bg-brand-800/40 px-6 py-3 text-sm font-bold text-white hover:bg-brand-800/80 transition"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metric Highlights */}
      <section className="mx-auto -mt-8 max-w-6xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-5 shadow-sm text-center"
            >
              <p className="text-base sm:text-lg font-bold text-brand-800">{h.label}</p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:pt-20">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
            Everything You Need From Sowing to Settlement
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Explore the specialized modules designed specifically for sugarcane growers, field supervisors,
            and sugar mill administration.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand-200"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-xl bg-brand-100 p-3 text-brand-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {f.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.desc}</p>

                <div className="mt-5 border-t border-gray-100 pt-4 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Key Highlights</p>
                  <ul className="mt-3 space-y-2">
                    {f.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action & Support note */}
      <section className="mx-auto max-w-4xl px-4 mt-20">
        <div className="rounded-3xl bg-brand-50 border border-brand-200 p-8 sm:p-10 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-brand-600" />
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-brand-900">
            Ready to Streamline Your Sugarcane Harvest?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-gray-600">
            Join hundreds of progressive sugarcane farmers and mills utilizing AgroCane 360 for higher efficiency and total transparency.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition"
            >
              Register Farmer Account
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-brand-600 px-6 py-3 font-semibold text-brand-700 hover:bg-brand-100/50 transition"
            >
              Contact Support Team
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Have questions about features? Email us at{" "}
            <a href="mailto:sanjay12345@gmail.com" className="font-semibold text-brand-700 underline">
              sanjay12345@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
