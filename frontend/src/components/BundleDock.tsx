import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import type { Rental, Subscription } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useBundle } from "@/lib/bundle";

// Floating pill tracking this month's 4-book bundle. Owns the whole checkout action
// so it works from any page: auth -> subscription -> place rental order.
export function BundleDock() {
  const { ids, clear } = useBundle();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const order = useMutation({
    mutationFn: () => apiPost<Rental>("/rentals", { book_ids: ids }),
    onSuccess: (rental) => {
      clear();
      toast.success(`Month ${rental.cycle} bundle confirmed — check WhatsApp for updates.`);
      void queryClient.invalidateQueries({ queryKey: ["rentals"] });
      void queryClient.invalidateQueries({ queryKey: ["subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["books"] });
      void queryClient.invalidateQueries({ queryKey: ["badges"] });
      navigate("/dashboard");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const checkout = async () => {
    if (ids.length !== 4) {
      toast.error(`Pick ${4 - ids.length} more book${4 - ids.length === 1 ? "" : "s"} to complete this month's bundle.`);
      navigate("/catalog");
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    setBusy(true);
    try {
      const sub = await apiGet<Subscription | null>("/subscriptions/me");
      if (!sub || sub.status !== "active") {
        toast.info("Activate your quarterly plan first — it takes 30 seconds.");
        navigate("/subscription");
        return;
      }
      order.mutate();
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const hidden = ids.length === 0 || location.pathname === "/subscription";

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-slate-900/90 py-2.5 pl-5 pr-2.5 text-white shadow-2xl backdrop-blur-xl">
            <span data-testid="bundle-dock-counter" className="text-sm font-semibold">
              {ids.length}/4 in this month's box
            </span>
            <div className="hidden items-center gap-1.5 sm:flex">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${i < ids.length ? "bg-[#34D399]" : "bg-white/20"}`}
                />
              ))}
            </div>
            <button
              data-testid="checkout-button"
              onClick={() => void checkout()}
              disabled={busy || order.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] disabled:opacity-50"
            >
              {busy || order.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PackageCheck className="h-4 w-4" />
              )}
              Get these 4
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
