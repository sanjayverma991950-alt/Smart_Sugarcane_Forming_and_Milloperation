import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  CalendarDays,
  TicketCheck,
  Truck,
  CreditCard,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Building2,
  Users,
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: UserPlus,
    badge: "Step 1: Onboarding",
    title: "Farmer Registration & Land Plot Mapping",
    desc: "Create your verified farmer account with your 10-digit mobile number. Register your agricultural plots with exact acreage, planting date, and sugarcane variety (e.g. Co 0238, Co 86032).",
    details: [
      "Instant mobile-based authentication with secure password",
      "Plot-by-plot registry with village and district details",
      "Automatic calculation of estimated seasonal yield",
    ],
  },
  {
    step: 2,
    icon: CalendarDays,
    badge: "Step 2: Season Kickoff",
    title: "Crushing Season Announcement & Quota",
    desc: "The sugar mill opens the annual crushing season, defining active operational dates, mill processing capacity, and the government-approved State Advised Price (SAP) per quintal.",
    details: [
      "Transparent announcement of season start and closure dates",
      "Official procurement rates set in the system",
      "Real-time visibility into mill intake schedules",
    ],
  },
  {
    step: 3,
    icon: TicketCheck,
    badge: "Step 3: Supply Indent",
    title: "Request & Receive Digital Supply Tickets",
    desc: "Instead of waiting for paper parchis that can get lost or delayed, farmers submit digital supply ticket requests. The mill reviews requests and issues approved dispatch schedules.",
    details: [
      "One-click ticket generation tied to registered fields",
      "Automated queue and quota management by mill rules",
      "Specific delivery dates assigned to prevent mill gate congestion",
    ],
  },
  {
    step: 4,
    icon: Truck,
    badge: "Step 4: Weighment",
    title: "Cane Delivery & Weighbridge Measurement",
    desc: "The farmer delivers harvested cane to the sugar mill gate. The certified weighbridge captures Gross Weight upon entry and Tare Weight after unloading.",
    details: [
      "Automatic subtraction computes Net Sugarcane Weight accurately",
      "Delivery slip generated with vehicle number and timestamp",
      "Immutable digital record saved directly to the database",
    ],
  },
  {
    step: 5,
    icon: CreditCard,
    badge: "Step 5: Settlement",
    title: "Automated Payment Ledger & Bank Credit",
    desc: "The system calculates the payable amount instantly (Net Weight × Procurement Rate). Mill finance teams record disbursements, and farmers track gross earnings and remaining balance.",
    details: [
      "Total transparency into verified deliveries and payable amounts",
      "Detailed passbook tracking every installment and voucher",
      "Clear status tags for Pending, Partial, and Completed payouts",
    ],
  },
  {
    step: 6,
    icon: Sparkles,
    badge: "Step 6: AI Protection",
    title: "Continuous AI Advisory & Diagnostics",
    desc: "Throughout the crop lifecycle, farmers can upload leaf photos for instant disease detection, check 7-day weather forecasts for irrigation planning, or ask voice questions in Hindi or English.",
    details: [
      "AI diagnosis for Red Rot, Smut, Wilt, and leaf pathologies",
      "Precipitation radar and soil-friendly irrigation alerts",
      "Voice assistant giving verified balance and ticket answers",
    ],
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("farmer");

  return (
    <div className="bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-700/80 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-brand-100 backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-300" /> Transparent Operations
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            How AgroCane 360 Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-brand-100/90 leading-relaxed">
            A step-by-step transparent bridge connecting sugarcane farmers and sugar mill operations
            from plot registration to final payment disbursement.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-800 shadow-md hover:bg-brand-50 transition"
            >
              Start As A Farmer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-400/40 bg-brand-800/40 px-6 py-3 text-sm font-bold text-white hover:bg-brand-800/80 transition"
            >
              Read Common FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Step by Step Timeline */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:pt-20">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
            The Complete 6-Step Journey
          </h2>
          <p className="mt-2 text-gray-600">
            Every step is designed for ease of use on mobile phones and verified by authorized mill administrators.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative flex flex-col md:flex-row gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md"
              >
                {/* Step indicator */}
                <div className="flex md:flex-col items-center md:items-center gap-4 md:w-48 shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-xl shadow-inner">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-800">
                    {s.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{s.desc}</p>

                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">What Happens Here</p>
                    <ul className="mt-2 space-y-2">
                      {s.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Perspectives: Farmer vs Sugar Mill */}
      <section className="mx-auto max-w-5xl px-4 pt-20">
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
              Designed for Both Farmers and Sugar Mills
            </h2>
            <p className="mt-2 text-gray-600">
              Select your role to see how AgroCane 360 simplifies your specific daily operations.
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab("farmer")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition cursor-pointer ${
                activeTab === "farmer"
                  ? "bg-brand-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Users className="h-4 w-4" /> For Farmers
            </button>
            <button
              onClick={() => setActiveTab("mill")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition cursor-pointer ${
                activeTab === "mill"
                  ? "bg-brand-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Building2 className="h-4 w-4" /> For Sugar Mill Staff
            </button>
          </div>

          <div className="mt-8 rounded-2xl bg-brand-50/70 border border-brand-100 p-6 sm:p-8">
            {activeTab === "farmer" ? (
              <div>
                <h3 className="text-xl font-bold text-brand-900">Farmer Experience</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Everything a cane grower needs directly on their smartphone, without traveling to the mill office.
                </p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">No Paper Parchi Confusion</p>
                    <p className="mt-1 text-xs text-gray-600">
                      View all approved, pending, and completed supply tickets online anytime.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Clear Payment Ledger</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Know your exact net weight, rate applied, and balance due right after delivery.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Free AI Crop Doctor</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Check suspicious leaves for early disease signs with actionable remedies.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Hindi Voice Assistant</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Speak in Hindi or English to check payments or ticket status without typing.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-brand-900">Sugar Mill Admin Experience</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Complete administrative control over season schedules, weighbridge data, and financial disbursements.
                </p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Controlled Gate Intake</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Approve ticket requests based on daily crushing capacity to eliminate traffic congestion.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Accurate Weighbridge Records</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Log Gross/Tare weight in seconds with zero math errors and instant receipt generation.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Live Supply Forecasting</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Analyze registered acreage and variety distribution to forecast crushing tonnage.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-brand-100 shadow-2xs">
                    <p className="font-semibold text-brand-800">Audit & Dispute Resolution</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Maintain complete audit trails of all ticket approvals and payment disbursements.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Need Help CTA */}
      <section className="mx-auto max-w-4xl px-4 mt-16 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <HelpCircle className="mx-auto h-10 w-10 text-brand-600" />
          <h3 className="mt-3 text-xl font-bold text-gray-900">Have Questions About The Process?</h3>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            Check out our detailed answers to common questions or reach out to our team at{" "}
            <a href="mailto:sanjay12345@gmail.com" className="font-semibold text-brand-700 underline">
              sanjay12345@gmail.com
            </a>
            .
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              to="/faq"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Browse All FAQs
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
