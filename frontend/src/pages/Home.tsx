import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BookOpen, MessageCircle, Package, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { PincodeChecker } from "@/components/PincodeChecker";

const HERO_IMG =
  "https://images.unsplash.com/photo-1544456203-0af5a69f5789?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMGNhZmUlMjBsaWJyYXJ5fGVufDB8fHx8MTc5MDI3MjE5NHww&ixlib=rb-4.1.0&q=85";
const COZY_IMG =
  "https://images.unsplash.com/photo-1603950227760-e609ce8e15b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHx2aW50YWdlJTIwYm9va3MlMjBzdGFjayUyMGNvZmZlZSUyMGNvenklMjByZWFkaW5nfGVufDB8fHx8MTc5MDI3MjE5NHww&ixlib=rb-4.1.0&q=85";
const STACK_IMG =
  "https://images.unsplash.com/photo-1529590003495-b2646e2718bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHx2aW50YWdlJTIwYm9va3MlMjBzdGFjayUyMGNvZmZlZSUyMGNvenklMjByZWFkaW5nfGVufDB8fHx8MTc5MDI3MjE5NHww&ixlib=rb-4.1.0&q=85";

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
  { icon: BookOpen, title: "Pick your 4", body: "Browse the catalogue and build this month's bundle of four books." },
  { icon: Package, title: "We deliver", body: "Your bundle arrives at your doorstep within 48 hours, free both ways." },
  { icon: MessageCircle, title: "We remind you", body: "WhatsApp nudges 3 days and 1 day before your return date." },
  { icon: RefreshCcw, title: "Swap & repeat", body: "Hand back the set and pick your next four. Twelve books a quarter." },
];

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#14110F]" data-testid="hero-section">
        <motion.img
          src={HERO_IMG}
          alt="A reader lost in a book in a warm bookshop"
          style={{ y: imgY }}
          className="absolute inset-0 h-[115%] w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#14110F]/95 via-[#1C1917]/85 to-[#292524]/70" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 pb-24 pt-36 sm:px-6 lg:flex-row lg:items-end lg:px-8 lg:pb-32 lg:pt-44">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FDBA74]"
            >
              A neighbourhood library, delivered
            </motion.p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[#FAF7F2] sm:text-5xl lg:text-6xl">
              <MaskedLine delay={0.25}>Twelve books.</MaskedLine>
              <MaskedLine delay={0.37}>Three months.</MaskedLine>
              <MaskedLine delay={0.49}>
                <span className="italic text-[#FDBA74]">One doorstep.</span>
              </MaskedLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg text-base leading-relaxed text-[#D6CEBF] md:text-lg"
            >
              Rent four books every month, keep them for thirty days, and swap them for the next
              four — with free pickup, delivery and gentle WhatsApp reminders. All for ₹1,499 a quarter.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <PincodeChecker dark />
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  data-testid="hero-browse-cta"
                  onClick={() => navigate("/catalog")}
                  className="group flex items-center gap-2 rounded-full bg-[#9A3412] px-7 py-3.5 text-sm font-semibold text-[#FAF7F2] transition-colors hover:bg-[#C2410C]"
                >
                  Browse the catalogue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  to="/#pricing"
                  data-testid="hero-pricing-cta"
                  className="text-sm font-semibold text-[#FDBA74] underline-offset-4 transition-colors hover:text-[#FAF7F2] hover:underline"
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
            className="relative hidden w-72 shrink-0 lg:block"
          >
            <div className="overflow-hidden rounded-2xl border border-[#FAF7F2]/15 shadow-2xl">
              <img src={STACK_IMG} alt="A stack of well-loved hardcovers" className="aspect-[3/4] w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-8 -rotate-3 rounded-xl bg-[#FAF7F2] px-5 py-3 shadow-xl">
              <p className="font-display text-2xl font-semibold text-[#9A3412]">₹125</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#57534E]">per book, per month</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A3412]">How it works</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl">
            A library habit, without the late fees
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-t-2 border-[#1C1917] pt-6"
              data-testid={`how-step-${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <step.icon className="h-6 w-6 text-[#9A3412]" />
                <span className="font-display text-4xl font-semibold text-[#E7DFD5]">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-[#1C1917]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#57534E]">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento perks */}
      <section className="bg-[#1C1917] py-24" data-testid="perks-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-[#FAF7F2] sm:text-4xl"
          >
            Built for people who dog-ear pages
          </motion.h2>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2"
            >
              <img src={COZY_IMG} alt="An open book resting on warm linen" className="h-full min-h-[320px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-8">
                <p className="font-display text-2xl font-semibold italic text-[#FAF7F2]">
                  “The best books are the ones someone hands you.”
                </p>
                <p className="mt-2 text-sm text-[#D6CEBF]">Curated monthly picks from your local hub, not an algorithm.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl bg-[#9A3412] p-8 text-[#FAF7F2]"
            >
              <p className="font-display text-5xl font-semibold">12</p>
              <p className="mt-2 text-sm text-[#FAF7F2]/80">books every quarter — four at a time, always fresh.</p>
              <div className="mt-8 border-t border-[#FAF7F2]/20 pt-6">
                <p className="font-display text-3xl font-semibold">₹0</p>
                <p className="mt-1 text-sm text-[#FAF7F2]/80">security deposit, delivery or pickup fee. Ever.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="rounded-2xl border border-[#FAF7F2]/10 bg-[#292524] p-8"
            >
              <MessageCircle className="h-7 w-7 text-[#25D366]" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-[#FAF7F2]">WhatsApp, not spam</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#D6CEBF]">
                Order confirmed, out for delivery, a nudge on day 27, pickup done. Four messages a month, nothing more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" data-testid="pricing-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A3412]">One simple plan</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl">
              A quarter of reading, priced like one night out
            </h2>
            <ul className="mt-8 space-y-4 text-base text-[#57534E]">
              {[
                "4 books every month, 12 across the quarter",
                "Free doorstep delivery and return pickup",
                "WhatsApp reminders before every due date",
                "Renew in month three, or simply hand the last set back",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A3412]" />
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
            className="rounded-2xl border border-[#E7DFD5] bg-white p-10 shadow-xl"
            data-testid="plan-card"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2B533E]">Quarterly Reading Plan</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-semibold tracking-tight text-[#1C1917]">₹1,499</span>
              <span className="text-sm text-[#57534E]">/ 3 months</span>
            </div>
            <p className="mt-3 text-sm text-[#57534E]">
              That's ₹125 per book — less than the bookmark you'd lose inside a bought one.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-[#E7DFD5] py-6 text-center">
              {[
                ["3", "months"],
                ["12", "books"],
                ["0", "deposit"],
              ].map(([n, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-semibold text-[#9A3412]">{n}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-[#57534E]">{label}</p>
                </div>
              ))}
            </div>
            <button
              data-testid="pricing-subscribe-cta"
              onClick={() => navigate("/subscription")}
              className="mt-8 w-full rounded-full bg-[#1C1917] py-4 text-sm font-semibold text-[#FAF7F2] transition-colors hover:bg-[#9A3412]"
            >
              Start reading this week
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
