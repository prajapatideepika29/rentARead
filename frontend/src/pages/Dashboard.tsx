import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays, format } from "date-fns";
import { motion } from "motion/react";
import { ArrowRight, CalendarClock, MessageCircle, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import type { AppNotification, Rental, Subscription } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BadgesCard } from "@/components/BadgesCard";

const fetchSubscription = () => apiGet<Subscription | null>("/subscriptions/me");
const fetchRentals = () => apiGet<Rental[]>("/rentals/me");
const fetchNotifications = () => apiGet<AppNotification[]>("/notifications/me");

const KIND_ICON: Record<string, typeof MessageCircle> = {
  subscription_started: PackageCheck,
  order_confirmed: PackageCheck,
  out_for_delivery: Truck,
  return_reminder: CalendarClock,
  pickup_complete: RotateCcw,
  renewal_reminder: CalendarClock,
  next_cycle: ArrowRight,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const enabled = !!user;
  const { data: sub } = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription, retry: false, enabled });
  const { data: rentals } = useQuery({ queryKey: ["rentals"], queryFn: fetchRentals, retry: false, enabled });
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications, retry: false, enabled });

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  const returnMutation = useMutation({
    mutationFn: (rentalId: string) => apiPost<Rental>(`/rentals/${rentalId}/return`),
    onSuccess: (rental) => {
      toast.success(rental.cycle >= 3 ? "Final set returned — your quarter is complete." : "Pickup scheduled! Month unlocked.");
      void queryClient.invalidateQueries({ queryKey: ["rentals"] });
      void queryClient.invalidateQueries({ queryKey: ["subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["books"] });
      void queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const active = sub?.status === "active";
  const currentRental = rentals?.find((r) => r.status === "delivered");
  const daysLeft = currentRental ? differenceInCalendarDays(new Date(currentRental.due_date), new Date()) : null;
  const canOrderNext = active && !currentRental && (sub?.current_cycle ?? 0) < 3;
  const cycle = sub?.current_cycle ?? 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8" data-testid="dashboard">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#2563EB]">Your family's reading corner</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            {user ? `Good to see you, ${user.name.split(" ")[0]}` : "Your shelf"}
          </h1>
          {sub && (
            <div
              data-testid="dashboard-quota-badge"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFFBEB] px-4 py-2 text-sm font-semibold text-[#78350F]"
            >
              {active ? `Month ${Math.min(cycle + (currentRental ? 0 : 1), 3)} of 3` : "Plan complete"} · {sub.books_rented_total} of 12 books rented
            </div>
          )}
        </motion.div>

        {!sub ? (
          <div className="mt-12 rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center" data-testid="dashboard-no-plan">
            <p className="font-display text-2xl font-semibold text-[#0F172A]">Your shelf is empty — for now</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
              Activate the Quarterly Reading Plan and your first four books could be at your door in 48 hours.
            </p>
            <button
              data-testid="dashboard-subscribe-cta"
              onClick={() => navigate("/subscription")}
              className="mt-6 rounded-full bg-[#2563EB] px-8 py-3.5 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#1D4ED8]"
            >
              See the plan — ₹1,499
            </button>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              {currentRental ? (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-8"
                  data-testid="current-rental-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#16A34A]">
                        Month {currentRental.cycle} — currently with you
                      </p>
                      <p className="mt-2 font-display text-4xl font-semibold text-[#0F172A]">
                        {daysLeft !== null && daysLeft >= 0 ? daysLeft : 0}
                        <span className="ml-2 text-base font-normal text-[#64748B]">days left · due {format(new Date(currentRental.due_date), "d MMM yyyy")}</span>
                      </p>
                    </div>
                    <button
                      data-testid="swap-books-trigger"
                      onClick={() => returnMutation.mutate(currentRental.id)}
                      disabled={returnMutation.isPending}
                      className="rounded-full bg-[#0F172A] px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#2563EB] disabled:opacity-50"
                    >
                      {currentRental.cycle >= 3 ? "Return final set" : "Return & unlock next 4"}
                    </button>
                  </div>

                  {daysLeft !== null && daysLeft <= 3 && (
                    <p data-testid="dashboard-return-reminder" className="mt-5 rounded-xl bg-[#FFFBEB] px-5 py-3.5 text-sm font-medium text-[#78350F]">
                      Pickup is coming up — keep the four books together by the door. We messaged you on WhatsApp too.
                    </p>
                  )}

                  <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {currentRental.books.map((b) => (
                      <div key={b.id} className="overflow-hidden rounded-xl border border-[#E2E8F0]">
                        <img src={b.cover_url} alt={b.title} className="aspect-[2/3] w-full object-cover" />
                        <p className="truncate px-2.5 py-2 text-xs font-semibold text-[#0F172A]">{b.title}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : canOrderNext ? (
                <div className="rounded-2xl border border-dashed border-[#2563EB]/40 bg-[#EFF6FF] p-12 text-center" data-testid="next-cycle-cta">
                  <p className="font-display text-2xl font-semibold text-[#0F172A]">
                    Month {cycle + 1} is unlocked
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
                    Four new books, chosen by you, delivered within 48 hours.
                  </p>
                  <button
                    data-testid="choose-books-button"
                    onClick={() => navigate("/catalog")}
                    className="mt-6 rounded-full bg-[#2563EB] px-8 py-3.5 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#1D4ED8]"
                  >
                    Choose your 4 books
                  </button>
                </div>
              ) : sub.status === "completed" ? (
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center" data-testid="plan-complete-card">
                  <p className="font-display text-2xl font-semibold text-[#0F172A]">Quarter complete — 12 books read</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
                    That's a shelf's worth of stories. Renew to start a fresh quarter.
                  </p>
                  <button
                    data-testid="renew-plan-button"
                    onClick={() => navigate("/subscription")}
                    className="mt-6 rounded-full bg-[#2563EB] px-8 py-3.5 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#1D4ED8]"
                  >
                    Renew for another 3 months
                  </button>
                </div>
              ) : null}

              {rentals && rentals.length > 0 && (
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8" data-testid="rental-history">
                  <h2 className="font-heading text-lg font-semibold text-[#0F172A]">Your reading trail</h2>
                  <ul className="mt-5 divide-y divide-[#E2E8F0]">
                    {rentals.map((r) => (
                      <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-[#0F172A]">Month {r.cycle} bundle</p>
                          <p className="mt-0.5 text-xs text-[#64748B]">{r.books.map((b) => b.title).join(" · ")}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            r.status === "delivered" ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#EFF6FF] text-[#64748B]"
                          }`}
                        >
                          {r.status === "delivered" ? "With you" : `Returned ${r.returned_at ? format(new Date(r.returned_at), "d MMM") : ""}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-8 lg:col-span-4">
              <div className="rounded-2xl bg-[#0F172A] p-8 text-[#F8FAFC]" data-testid="plan-timeline">
                <h2 className="font-heading text-base font-semibold">Plan timeline</h2>
                <div className="mt-6 space-y-0">
                  {[1, 2, 3].map((m) => (
                    <div key={m} className="relative pb-6 pl-7 last:pb-0">
                      <span
                        className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                          m <= cycle ? "border-[#60A5FA] bg-[#60A5FA]" : m === cycle + 1 && active ? "border-[#60A5FA] bg-transparent" : "border-[#F8FAFC]/25 bg-transparent"
                        }`}
                      />
                      <p className="text-sm font-semibold">Month {m}</p>
                      <p className="text-xs text-[#CBD5E1]">
                        {m <= cycle ? "4 books delivered" : active && m === cycle + 1 ? "Up next" : "Locked"}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-[#F8FAFC]/10 pt-4 text-xs text-[#94A3B8]">
                  Plan ends {format(new Date(sub.end_date), "d MMM yyyy")}
                </p>
              </div>

              <BadgesCard />

              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white" data-testid="whatsapp-log">
                <div className="flex items-center gap-2 bg-[#075E54] px-5 py-3.5 text-white">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <p className="text-sm font-semibold">WhatsApp updates</p>
                  <span className="ml-auto rounded-full bg-[#25D366]/20 px-2 py-0.5 text-[10px] font-semibold text-[#25D366]">SIMULATED</span>
                </div>
                <ul className="max-h-96 space-y-3 overflow-y-auto bg-[#ECE5DD] p-4">
                  {notifications && notifications.length > 0 ? (
                    [...notifications].reverse().map((n) => {
                      const Icon = KIND_ICON[n.kind] ?? MessageCircle;
                      return (
                        <li key={n.id} data-testid="whatsapp-alert-item" className="ml-auto max-w-[90%] rounded-xl rounded-tr-sm bg-[#DCF8C6] px-4 py-3 shadow-sm">
                          <p className="flex items-center gap-1.5 text-xs font-bold text-[#075E54]">
                            <Icon className="h-3.5 w-3.5" /> {n.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#0F172A]">{n.body}</p>
                          <p className="mt-1.5 text-right text-[10px] text-[#64748B]">{format(new Date(n.created_at), "d MMM, h:mm a")} ✓✓</p>
                        </li>
                      );
                    })
                  ) : (
                    <li className="rounded-xl bg-white/70 px-4 py-6 text-center text-xs text-[#64748B]">
                      Order updates, delivery alerts and return reminders land here — and on your WhatsApp.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
