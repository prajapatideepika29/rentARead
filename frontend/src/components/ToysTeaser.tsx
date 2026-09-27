import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Blocks, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";

// Books are live; toys are the reserved second vertical. The waitlist endpoint is real
// (POST /api/waitlist) so demand is measurable before the toy catalogue exists.
export function ToysTeaser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiPost<{ message: string }>("/waitlist", { email, pincode, interest: "toys" });
      setJoined(true);
      toast.success(res.message);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" data-testid="collections-section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A3412]">One membership, growing shelves</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl">
          Books today. Toys tomorrow.
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col rounded-2xl bg-[#9A3412] p-10 text-[#FAF7F2]"
        >
          <div className="flex items-center justify-between">
            <BookOpen className="h-8 w-8" />
            <span className="rounded-full bg-[#FAF7F2]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Live now</span>
          </div>
          <h3 className="mt-8 font-display text-2xl font-semibold">The book library</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#FAF7F2]/85">
            4 books a month, 12 a quarter, free doorstep swaps. This is the shelf you know and love.
          </p>
          <button
            data-testid="books-collection-cta"
            onClick={() => navigate("/catalog")}
            className="group mt-8 flex w-fit items-center gap-2 rounded-full bg-[#FAF7F2] px-6 py-3 text-sm font-semibold text-[#9A3412] transition-colors hover:bg-white"
          >
            Browse books
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col rounded-2xl bg-[#2B533E] p-10 text-[#FAF7F2]"
        >
          <div className="flex items-center justify-between">
            <Blocks className="h-8 w-8" />
            <span className="rounded-full bg-[#FAF7F2]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Coming soon</span>
          </div>
          <h3 className="mt-8 font-display text-2xl font-semibold">The toy library</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#FAF7F2]/85">
            Same idea, smaller readers: rent 4 toys a month, swap when they're outgrown, skip the clutter.
            Leave your details and you'll be first in line when toys reach your pincode.
          </p>

          {joined ? (
            <p data-testid="toys-waitlist-status" className="mt-8 flex items-center gap-2 rounded-xl bg-[#FAF7F2]/10 px-5 py-4 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#86EFAC]" />
              You're on the list — we'll message you the day toys launch near {pincode}.
            </p>
          ) : (
            <form onSubmit={(e) => void join(e)} className="mt-8 space-y-3" data-testid="toys-waitlist-form">
              <input
                data-testid="toys-waitlist-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-full border border-[#FAF7F2]/25 bg-[#FAF7F2]/10 px-5 py-3 text-sm text-[#FAF7F2] outline-none placeholder:text-[#FAF7F2]/50 focus:border-[#FAF7F2]/60"
              />
              <div className="flex gap-3">
                <input
                  data-testid="toys-waitlist-pincode-input"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Pincode"
                  inputMode="numeric"
                  className="w-full rounded-full border border-[#FAF7F2]/25 bg-[#FAF7F2]/10 px-5 py-3 text-sm text-[#FAF7F2] outline-none placeholder:text-[#FAF7F2]/50 focus:border-[#FAF7F2]/60"
                />
                <button
                  data-testid="toys-waitlist-submit-button"
                  type="submit"
                  disabled={busy || pincode.length !== 6}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-[#FAF7F2] px-6 py-3 text-sm font-semibold text-[#2B533E] transition-colors hover:bg-white disabled:opacity-40"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Notify me"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
