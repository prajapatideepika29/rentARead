import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BookOpen, MessageCircle, RefreshCcw, Star, Truck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { PincodeChecker } from "@/components/PincodeChecker";
import { ToysTeaser } from "@/components/ToysTeaser";

const KIDS_IMG =
  "https://images.unsplash.com/photo-1610500796385-3ffc1ae2f046?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHw0fHxjaGlsZHJlbiUyMHJlYWRpbmclMjBjb2xvcmZ1bCUyMGJvb2tzfGVufDB8fHx8MTc5MDQ2OTM1NXww&ixlib=rb-4.1.0&q=85";
const STORYTIME_IMG =
  "https://images.unsplash.com/photo-1532789339108-2ebc484efbf1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwzfHxjaGlsZHJlbiUyMHJlYWRpbmclMjBjb2xvcmZ1bCUyMGJvb2tzfGVufDB8fHx8MTc5MDQ2OTM1NXww&ixlib=rb-4.1.0&q=85";

function MaskedLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const STEPS = [
  { icon: BookOpen, color: "bg-[#0284C7]", title: "Pick your 4", body: "Browse the shelf together and choose this month's four adventures." },
  { icon: Truck, color: "bg-[#16A34A]", title: "We deliver", body: "Your book box arrives at your doorstep within 48 hours — free both ways." },
  { icon: MessageCircle, color: "bg-[#F59E0B]", title: "Read & enjoy", body: "Thirty whole days of story time. We send a friendly WhatsApp nudge before pickup." },
  { icon: RefreshCcw, color: "bg-[#F43F5E]", title: "Swap & repeat", body: "Hand back the set and pick the next four. Twelve books every quarter!" },
];

const PILLS = [
  { icon: BookOpen, label: "4 books every month" },
  { icon: Truck, label: "Free pickup & delivery" },
  { icon: MessageCircle, label: "WhatsApp reminders" },
];

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#FDFBF7]" data-testid="hero-section">
        <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#F0F9FF]" />
        <div className="pointer-events-none absolute -right-24 top-72 h-80 w-80 rounded-full bg-[#FEFCE8]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#F0FDF4]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 pb-24 pt-32 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:pb-28 lg:pt-40">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, rotate: -4, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -2, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block rounded-full bg-[#FEF9C3] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-[#78350F] shadow-sm"
            >
              Storybooks delivered to your door
            </motion.span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              <MaskedLine delay={0.25}>Fresh stories,</MaskedLine>
              <MaskedLine delay={0.37}>every month,</MaskedLine>
              <MaskedLine delay={0.49}>
                <span className="relative inline-block text-[#0284C7]">
                  at your door.
                  <svg viewBox="0 0 220 12" className="absolute -bottom-2 left-0 w-full text-[#F59E0B]" aria-hidden="true">
                    <path d="M3 8c30-6 60 4 90-2s60 4 90-2 30 2 34 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </MaskedLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg text-base leading-relaxed text-[#64748B] md:text-lg"
            >
              Rent four books every month, keep them for thirty days, and swap them for the next
              four — with free pickup, delivery and friendly WhatsApp reminders. All for ₹1,499 a quarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 flex flex-wrap gap-2.5"
            >
              {PILLS.map((p) => (
                <span
                  key={p.label}
                  className="flex items-center gap-1.5 rounded-full border-2 border-[#F1E8DC] bg-white px-4 py-2 text-xs font-bold text-[#0F172A]"
                >
                  <p.icon className="h-3.5 w-3.5 text-[#0284C7]" />
                  {p.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <PincodeChecker />
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  data-testid="hero-browse-cta"
                  onClick={() => navigate("/catalog")}
                  className="group flex items-center gap-2 rounded-full bg-[#0284C7] px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)] transition-all hover:bg-[#0369A1] hover:shadow-[0_6px_20px_rgba(2,132,199,0.45)] active:translate-y-0.5"
                >
                  Explore the books
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  to="/#pricing"
                  data-testid="hero-pricing-cta"
                  className="text-sm font-bold text-[#0284C7] underline-offset-4 transition-colors hover:text-[#0369A1] hover:underline"
                >
                  See the plan — ₹1,499
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, rotate: 4, y: 40 }}
            animate={{ opacity: 1, rotate: 2, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-72 shrink-0 sm:w-80 lg:mx-0"
          >
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
              <img src={KIDS_IMG} alt="Children reading colorful storybooks together" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -left-8 -top-4 rotate-[-4deg] rounded-full bg-[#F59E0B] px-5 py-2.5 shadow-lg">
              <p className="font-display text-sm font-bold text-[#78350F]">4 books / month</p>
            </div>
            <div className="absolute -bottom-5 -right-3 rotate-3 rounded-2xl border-2 border-[#F1E8DC] bg-white px-4 py-3 shadow-xl">
              <div className="flex items-center gap-0.5 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-[11px] font-semibold text-[#64748B]">Loved by 500+ families</p>
            </div>
          </motion.div>
        </div>

        <svg viewBox="0 0 1440 60" className="block w-full text-[#F0F9FF]" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 C240,60 480,0 720,16 C960,32 1200,60 1440,32 L1440,60 L0,60 Z" fill="currentColor" />
        </svg>
      </section>

      <Marquee />

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" data-testid="how-it-works">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0284C7]">How it works</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            As easy as story time
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border-2 border-[#F1E8DC] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              data-testid={`how-step-${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${step.color} font-display text-lg font-bold text-white shadow-md`}>
                  {i + 1}
                </span>
                <step.icon className="h-6 w-6 text-[#0284C7]" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-[#0F172A]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento perks */}
      <section className="bg-[#0F172A] py-24" data-testid="perks-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl font-display text-3xl font-bold tracking-tight text-[#FDFBF7] sm:text-4xl"
          >
            Made for little bookworms (and their parents)
          </motion.h2>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl lg:col-span-2 lg:row-span-2"
            >
              <img src={STORYTIME_IMG} alt="Children reading together, cosy on a couch" className="h-full min-h-[320px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-8">
                <p className="font-display text-2xl font-bold text-[#FDFBF7]">
                  “The best books are the ones someone hands you.”
                </p>
                <p className="mt-2 text-sm text-[#CBD5E1]">Curated monthly picks from your local hub — real humans, not an algorithm.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-[#0284C7] p-8 text-white"
            >
              <p className="font-display text-5xl font-bold">12</p>
              <p className="mt-2 text-sm text-white/85">books every quarter — four at a time, always fresh.</p>
              <div className="mt-8 border-t border-white/20 pt-6">
                <p className="font-display text-3xl font-bold">₹0</p>
                <p className="mt-1 text-sm text-white/85">security deposit, delivery or pickup fee. Ever.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="rounded-3xl border border-white/10 bg-[#1E293B] p-8"
            >
              <MessageCircle className="h-7 w-7 text-[#25D366]" />
              <h3 className="mt-4 font-heading text-lg font-bold text-[#FDFBF7]">WhatsApp, not spam</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                Order confirmed, out for delivery, a nudge on day 27, pickup done. Four messages a month, nothing more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <ToysTeaser />

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" data-testid="pricing-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0284C7]">One simple plan</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              A quarter of stories, for the price of one pizza night
            </h2>
            <ul className="mt-8 space-y-4 text-base text-[#64748B]">
              {[
                "4 books every month, 12 across the quarter",
                "Free doorstep delivery and return pickup",
                "Friendly WhatsApp reminders before every due date",
                "Renew in month three, or simply hand the last set back",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#16A34A]" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border-2 border-[#F1E8DC] bg-white p-10 shadow-xl"
            data-testid="plan-card"
          >
            <span className="absolute -top-3.5 left-10 rotate-[-2deg] rounded-full bg-[#F59E0B] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#78350F] shadow-md">
              Best value
            </span>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#16A34A]">Quarterly Reading Plan</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold tracking-tight text-[#0F172A]">₹1,499</span>
              <span className="text-sm text-[#64748B]">/ 3 months</span>
            </div>
            <p className="mt-3 text-sm text-[#64748B]">
              That's ₹125 per book — less than a single new picture book.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-y-2 border-[#F1E8DC] py-6 text-center">
              {[
                ["3", "months"],
                ["12", "books"],
                ["0", "deposit"],
              ].map(([n, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-[#0284C7]">{n}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
                </div>
              ))}
            </div>
            <button
              data-testid="pricing-subscribe-cta"
              onClick={() => navigate("/subscription")}
              className="mt-8 w-full rounded-full bg-[#0284C7] py-4 text-sm font-bold text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)] transition-all hover:bg-[#0369A1] active:translate-y-0.5"
            >
              Start your family's plan
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
