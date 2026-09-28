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
  { icon: BookOpen, color: "bg-[#2563EB]", title: "Pick your 4", body: "Browse the shelf together and choose this month's four adventures." },
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
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden" data-testid="hero-section">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 700px at 12% 15%, rgba(37,99,235,0.08), transparent 70%), radial-gradient(circle 550px at 88% 25%, rgba(14,165,233,0.09), transparent 65%), radial-gradient(circle 500px at 50% 95%, rgba(244,114,182,0.06), transparent 60%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-40">
          <div className="max-w-2xl lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
              Storybooks delivered to your door
            </motion.span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-5xl lg:text-[56px]">
              <MaskedLine delay={0.25}>Fresh stories,</MaskedLine>
              <MaskedLine delay={0.37}>every month,</MaskedLine>
              <MaskedLine delay={0.49}>
                <span className="bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] bg-clip-text text-transparent">
                  at your door.
                </span>
              </MaskedLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg"
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
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  <p.icon className="h-3.5 w-3.5 text-[#2563EB]" />
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
                  className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1D4ED8] active:scale-[0.98]"
                >
                  Explore the books
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  to="/#pricing"
                  data-testid="hero-pricing-cta"
                  className="text-sm font-semibold text-[#2563EB] underline-offset-4 transition-colors hover:text-[#1D4ED8] hover:underline"
                >
                  See the plan — ₹1,499
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:col-span-5"
          >
            <div className="overflow-hidden rounded-2xl border border-white/85 bg-white/75 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] backdrop-blur-md">
              <img src={KIDS_IMG} alt="Children reading colorful storybooks together" className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">This month's box</p>
                  <p className="text-xs text-slate-500">Curated for your child's age</p>
                </div>
                <span className="rounded-lg bg-slate-900 px-3 py-1.5 font-mono text-xs font-medium text-white">4 books</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-2 flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md sm:-right-6">
              <div className="flex items-center gap-0.5 text-[#F59E0B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-slate-500">Loved by 500+ families</p>
            </div>
          </motion.div>
        </div>
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How it works</p>
          <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl">
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
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_8px_30px_-4px_rgba(15,23,42,0.08)]"
              data-testid={`how-step-${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.color} font-display text-base font-bold text-white`}>
                  {i + 1}
                </span>
                <step.icon className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
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
            className="max-w-2xl font-display text-2xl font-semibold tracking-[-0.02em] text-slate-50 sm:text-3xl lg:text-4xl"
          >
            Made for little bookworms (and their parents)
          </motion.h2>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2"
            >
              <img src={STORYTIME_IMG} alt="Children reading together, cosy on a couch" className="h-full min-h-[320px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-8">
                <p className="font-display text-2xl font-semibold text-white">
                  “The best books are the ones someone hands you.”
                </p>
                <p className="mt-2 text-sm text-slate-300">Curated monthly picks from your local hub — real humans, not an algorithm.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl bg-[#2563EB] p-8 text-white"
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
              className="rounded-2xl border border-white/10 bg-slate-800/60 p-8"
            >
              <MessageCircle className="h-7 w-7 text-[#25D366]" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-white">WhatsApp, not spam</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">One simple plan</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl">
              A quarter of stories, for the price of one pizza night
            </h2>
            <ul className="mt-8 space-y-4 text-base text-slate-600">
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
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-slate-200/80 bg-white p-10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]"
            data-testid="plan-card"
          >
            <span className="absolute -top-3 left-10 rounded-full bg-[#FFFBEB] px-4 py-1.5 text-xs font-semibold text-[#92400E] ring-1 ring-amber-200">
              Best value
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#16A34A]">Quarterly Reading Plan</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold tracking-tight text-slate-900">₹1,499</span>
              <span className="text-sm text-slate-500">/ 3 months</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              That's ₹125 per book — less than a single new picture book.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-slate-200 py-6 text-center">
              {[
                ["3", "months"],
                ["12", "books"],
                ["0", "deposit"],
              ].map(([n, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-[#2563EB]">{n}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <button
              data-testid="pricing-subscribe-cta"
              onClick={() => navigate("/subscription")}
              className="mt-8 w-full rounded-xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1D4ED8] active:scale-[0.98]"
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
