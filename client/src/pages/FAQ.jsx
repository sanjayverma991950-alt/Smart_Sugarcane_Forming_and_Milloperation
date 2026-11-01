import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Mail,
  ArrowRight,
  Sparkles,
  Ticket,
  Wallet,
  ShieldCheck,
  Bot,
} from "lucide-react";

const allFaqs = [
  {
    category: "tickets",
    q: "How do I request a sugarcane supply ticket (indent)?",
    a: "Once you log into your Farmer Portal and have at least one field registered, navigate to 'Tickets' and click 'Request New Ticket'. Select the field and preferred delivery date. The sugar mill will review and approve your ticket based on active crushing quotas.",
  },
  {
    category: "tickets",
    q: "What happens if a supply ticket is rejected by the mill?",
    a: "If the mill administrators reject a ticket request (e.g. due to mill maintenance or daily capacity limit), they provide a review remark. You can view the reason in your ticket dashboard and submit a new request for the next available date.",
  },
  {
    category: "weighments",
    q: "How is the net sugarcane weight calculated at the weighbridge?",
    a: "When your vehicle arrives at the mill gate, the weighbridge records the Gross Weight (vehicle + cane). After unloading the cane at the carrier, the empty vehicle is re-weighed to record Tare Weight. The system automatically computes Net Sugarcane Weight = Gross Weight - Tare Weight.",
  },
  {
    category: "payments",
    q: "Does AgroCane 360 directly transfer money to my bank account?",
    a: "No. AgroCane 360 is a transparent management and ledger platform. It calculates your earnings based on official State Advised Price (SAP) rates and tracks disbursement vouchers entered by authorized mill accounting staff. Actual banking transfers are handled via direct bank transfer or NEFT/RTGS by the mill.",
  },
  {
    category: "payments",
    q: "How can I see my pending sugarcane payment balance?",
    a: "Open your Farmer Dashboard and click 'Payments'. You will see a summary card displaying: Total Verified Deliveries, Total Payable Amount, Total Amount Paid, and the Remaining Balance Due.",
  },
  {
    category: "ai",
    q: "How accurate is the AI Crop Disease Detection, and is it official advice?",
    a: "The AI Crop Disease scanner provides preliminary visual guidance based on leaf and stem pathology models (identifying Red Rot, Smut, Wilt, etc.). It is designed as an early warning advisory tool and does not replace official on-site agricultural extension officer inspections or lab tests.",
  },
  {
    category: "ai",
    q: "Which languages does the AI Voice Assistant support?",
    a: "The voice assistant supports English, Hindi, and Hinglish. You can speak naturally into your smartphone microphone to check your current season tickets, payments, or weather forecasts.",
  },
  {
    category: "account",
    q: "Can other farmers see my field details or payment records?",
    a: "No. AgroCane 360 enforces strict data isolation and role-based access control. Each farmer can only see their own plots, tickets, deliveries, and payment ledgers. Mill administrators only see verified data within their management domain.",
  },
  {
    category: "account",
    q: "What should I do if I forgot my farmer login password?",
    a: "Click on 'Forgot Password' on the login screen. Enter your registered 10-digit mobile number or email address to receive a secure password reset verification code and set a new password.",
  },
  {
    category: "general",
    q: "Who can I contact if I notice a discrepancy in my delivery or ticket?",
    a: "You can submit an official complaint directly through the 'Complaints' tab in your Farmer Dashboard, or contact our support team at sanjay12345@gmail.com.",
  },
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "tickets", label: "Supply Tickets" },
  { id: "weighments", label: "Weighbridge" },
  { id: "payments", label: "Payments" },
  { id: "ai", label: "AI & Advisory" },
  { id: "account", label: "Account & Security" },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIdx, setOpenIdx] = useState(null);

  const filteredFaqs = allFaqs.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-700/80 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-brand-100 backdrop-blur">
            <HelpCircle className="h-4 w-4 text-brand-300" /> Help Center & Knowledge Base
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-brand-100/90 leading-relaxed">
            Everything you need to know about sugarcane tickets, weighment receipts, payment balances, and AI tools.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. ticket, payment, disease)..."
                className="w-full rounded-2xl bg-white py-3.5 pl-12 pr-4 text-gray-800 shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:pt-16">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-6">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeCategory === c.id
                  ? "bg-brand-600 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="mt-6 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              No matching questions found for "{searchQuery}". Try different search terms or check all categories.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-gray-200 bg-white shadow-2xs transition overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-gray-900 hover:bg-brand-50/50 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-gray-600 border-t border-gray-100 leading-relaxed bg-brand-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Banner */}
        <div className="mt-14 rounded-3xl bg-brand-50 border border-brand-200 p-8 text-center">
          <Mail className="mx-auto h-10 w-10 text-brand-600" />
          <h2 className="mt-3 text-xl sm:text-2xl font-bold text-brand-900">Still Have Questions?</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Can’t find the answer you’re looking for? Reach out directly to our support team and we will be happy to assist you.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:sanjay12345@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 shadow-sm transition"
            >
              Email: sanjay12345@gmail.com
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-600 px-5 py-2.5 font-semibold text-brand-700 hover:bg-brand-100/50 transition"
            >
              Open Contact Page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
