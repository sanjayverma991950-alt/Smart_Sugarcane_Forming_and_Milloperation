import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "general",
    message: "",
  });

  const contactEmail = "sanjay12345@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `[AgroCane 360 Inquiry] ${formData.topic.toUpperCase()}: ${formData.name || "Farmer Query"}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <div className="bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-700/80 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-brand-100 backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-300" /> Support & Communications
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Contact AgroCane 360
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-brand-100/90 leading-relaxed">
            Have questions regarding your farmer account, supply tickets, weighbridge weighments,
            or sugar mill registration? We are ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 -mt-10 sm:-mt-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Contact Cards */}
          <div className="space-y-4 lg:col-span-1">
            {/* Direct Email Card */}
            <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Official Email</p>
                  <p className="text-base font-bold text-gray-900">Direct Support</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3.5 flex items-center justify-between gap-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm font-bold text-brand-700 hover:underline break-all"
                >
                  {contactEmail}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="rounded-lg bg-white p-2 text-gray-600 hover:text-brand-700 hover:bg-brand-100/60 shadow-2xs transition cursor-pointer"
                  title="Copy email address"
                >
                  {copied ? <Check className="h-4 w-4 text-brand-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {copied && (
                <p className="mt-2 text-xs font-semibold text-brand-600 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Email copied to clipboard!
                </p>
              )}

              <a
                href={`mailto:${contactEmail}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-700 transition"
              >
                <Mail className="h-4 w-4" /> Send Email Directly
              </a>
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Helpdesk Availability</p>
                  <p className="text-base font-bold text-gray-900">Operating Hours</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-600">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Monday – Saturday</span>
                  <span>8:00 AM – 7:00 PM IST</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-800">Sunday</span>
                  <span>10:00 AM – 4:00 PM IST</span>
                </li>
                <li className="flex justify-between pt-1">
                  <span className="font-medium text-brand-700">Crushing Season Gate</span>
                  <span className="font-bold text-brand-700">24 / 7 Active</span>
                </li>
              </ul>
            </div>

            {/* Quick Links Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Fast Resolution</h3>
              <p className="mt-1 text-sm text-gray-600">Need immediate answers or want to log in?</p>
              <div className="mt-4 space-y-2">
                <Link
                  to="/faq"
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition"
                >
                  <span>Browse FAQs</span>
                  <HelpCircle className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition"
                >
                  <span>Farmer Portal Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition"
                >
                  <span>Sugar Mill Staff Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Send an Inquiry or Feedback</h2>
              <p className="mt-1 text-sm text-gray-600">
                Fill in your details below. For direct responses, your message will reach our support inbox at{" "}
                <strong className="text-brand-700">{contactEmail}</strong>.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-2xl bg-brand-50 border border-brand-200 p-6 sm:p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-brand-900">Message Prepared!</h3>
                  <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                    Thank you, {formData.name || "Farmer"}! You can also click below to open your email client
                    and deliver this message directly to <strong>{contactEmail}</strong>.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                      <Send className="h-4 w-4" /> Open in Email App
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", phone: "", email: "", topic: "general", message: "" });
                      }}
                      className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="ticket">Sugarcane Supply Ticket (Indent)</option>
                        <option value="weighment">Weighbridge Delivery / Weight Issue</option>
                        <option value="payment">Payment Ledger & Balance</option>
                        <option value="disease">Crop Disease Detection</option>
                        <option value="mill">Sugar Mill Administrative Onboarding</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe your question or issue in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      Direct inquiries are routed to <span className="font-semibold text-brand-700">{contactEmail}</span>
                    </p>
                    <button
                      type="submit"
                      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 transition cursor-pointer"
                    >
                      <Send className="h-4 w-4" /> Submit Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
    </svg>
  );
}
