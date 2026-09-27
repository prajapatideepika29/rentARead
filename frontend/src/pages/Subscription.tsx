import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { BadgeCheck, CreditCard, Loader2, MessageCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import type { Subscription } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fetchSubscription = () => apiGet<Subscription | null>("/subscriptions/me");

const TIMELINE = [
  ["Month 1", "Pick 4 books. Delivered within 48 hours."],
  ["Month 2", "Return the set at pickup, choose your next 4."],
  ["Month 3", "Final set. Renew the quarter or hand the books back."],
];

export default function Subscription() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const { data: sub } = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription, retry: false, enabled: !!user });
  const [payOpen, setPayOpen] = useState(false);
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  const subscribe = useMutation({
    mutationFn: () => apiPost<Subscription>("/subscriptions", { payment_method: method }),
    onSuccess: () => {
      toast.success("Plan active — your first 4 books are one click away.");
      void queryClient.invalidateQueries({ queryKey: ["subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      navigate("/catalog");
    },
    onError: (e) => {
      setPaying(false);
      toast.error(apiErrorMessage(e));
    },
  });

  const pay = () => {
    // Mocked gateway: brief spinner, then instant confirmation.
    setPaying(true);
    setTimeout(() => subscribe.mutate(), 1200);
  };

  const active = sub?.status === "active";

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0284C7]">Membership</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              The Quarterly Reading Plan
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#64748B]">
              One payment, a whole season of reading. Four books a month, delivered and collected
              from your doorstep, with WhatsApp keeping the dates straight so you don't have to.
            </p>

            <ol className="mt-10 space-y-0 border-l-2 border-[#F1E8DC]">
              {TIMELINE.map(([title, body], i) => (
                <li key={title} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0284C7] bg-[#FDFBF7]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
                  </span>
                  <p className="font-heading text-base font-semibold text-[#0F172A]">
                    {title} <span className="ml-2 text-xs font-normal uppercase tracking-wide text-[#94A3B8]">cycle {i + 1} of 3</span>
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">{body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex items-start gap-3 rounded-xl bg-[#075E54]/10 p-5">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#075E54]" />
              <p className="text-sm leading-relaxed text-[#0F172A]">
                We message you on WhatsApp four times a month — order confirmed, out for delivery,
                a reminder 3 days before pickup, and pickup complete. Nothing else, ever.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-[#0F172A] p-10 text-[#FDFBF7] shadow-2xl lg:sticky lg:top-24"
            data-testid="subscription-card"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FDE047]">Quarterly Reading Plan</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-semibold tracking-tight">₹1,499</span>
              <span className="text-sm text-[#CBD5E1]">one-time, 3 months</span>
            </div>
            <ul className="mt-8 space-y-3 border-t border-[#FDFBF7]/10 pt-8 text-sm text-[#CBD5E1]">
              {[
                "12 books total — 4 each month",
                "Free delivery & return pickup",
                "Zero security deposit",
                "WhatsApp reminders on day 27 and day 29",
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-[#FDE047]" />
                  {line}
                </li>
              ))}
            </ul>

            {active ? (
              <div className="mt-8" data-testid="subscription-active-state">
                <p className="rounded-xl bg-[#16A34A] px-5 py-4 text-sm font-medium">
                  Your plan is active — {sub.books_rented_total} of 12 books rented so far.
                </p>
                <button
                  data-testid="go-to-catalog-button"
                  onClick={() => navigate("/catalog")}
                  className="mt-4 w-full rounded-full bg-[#0284C7] py-4 text-sm font-semibold transition-colors hover:bg-[#0EA5E9]"
                >
                  Choose this month's books
                </button>
              </div>
            ) : (
              <button
                data-testid="subscribe-now-button"
                onClick={() => setPayOpen(true)}
                className="mt-8 w-full rounded-full bg-[#0284C7] py-4 text-sm font-semibold transition-colors hover:bg-[#0EA5E9]"
              >
                Pay ₹1,499 & start
              </button>
            )}
            <p className="mt-4 text-center text-xs text-[#94A3B8]">Demo checkout — no real money moves.</p>
          </motion.div>
        </div>
      </section>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="bg-[#FDFBF7] sm:max-w-md" data-testid="payment-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#0F172A]">Checkout — ₹1,499</DialogTitle>
          </DialogHeader>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              data-testid="pay-method-upi"
              onClick={() => setMethod("upi")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                method === "upi" ? "border-[#0284C7] bg-[#0284C7]/10 text-[#0284C7]" : "border-[#F1E8DC] bg-white text-[#64748B]"
              }`}
            >
              <Smartphone className="h-4 w-4" /> UPI
            </button>
            <button
              data-testid="pay-method-card"
              onClick={() => setMethod("card")}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                method === "card" ? "border-[#0284C7] bg-[#0284C7]/10 text-[#0284C7]" : "border-[#F1E8DC] bg-white text-[#64748B]"
              }`}
            >
              <CreditCard className="h-4 w-4" /> Card
            </button>
          </div>
          {method === "upi" ? (
            <div className="mt-4 space-y-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input id="upi-id" data-testid="upi-id-input" placeholder="name@okhdfc" className="bg-white" />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input id="card-number" data-testid="card-number-input" placeholder="4242 4242 4242 4242" className="bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Input id="card-expiry" placeholder="12/28" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input id="card-cvv" placeholder="123" className="bg-white" />
                </div>
              </div>
            </div>
          )}
          <button
            data-testid="payment-mock-submit"
            onClick={pay}
            disabled={paying}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] py-3.5 text-sm font-semibold text-[#FDFBF7] transition-colors hover:bg-[#0284C7] disabled:opacity-60"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Talking to your bank…
              </>
            ) : (
              "Pay ₹1,499"
            )}
          </button>
          <p className="text-center text-xs text-[#94A3B8]">Mocked payment — instant confirmation, zero charge.</p>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
