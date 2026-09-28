import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CheckCircle2, Compass, Package, Shuffle, Star, Trophy } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Badge } from "@/lib/types";

const BADGE_ICON: Record<string, typeof Star> = {
  first_box: Package,
  book_explorer: Compass,
  super_explorer: Trophy,
  genre_hopper: Shuffle,
  right_on_time: CheckCircle2,
};

const fetchBadges = () => apiGet<Badge[]>("/badges/me");

// Playful milestone badges earned from real rental activity (GET /api/badges/me).
export function BadgesCard() {
  const { data: badges } = useQuery({ queryKey: ["badges"], queryFn: fetchBadges, retry: false });

  if (!badges) return null;
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-6" data-testid="badges-card">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-[#0F172A]">Reading badges</h2>
        <span className="rounded-full bg-[#FFFBEB] px-3 py-1 text-xs font-extrabold text-[#78350F]" data-testid="badges-earned-count">
          {earnedCount}/{badges.length} earned
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {badges.map((badge, i) => {
          const Icon = BADGE_ICON[badge.id] ?? Star;
          return (
            <motion.div
              key={badge.id}
              data-testid={`badge-${badge.id}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 25 }}
              className={`rounded-2xl border-2 p-3.5 text-center ${
                badge.earned
                  ? "border-[#FDE68A] bg-[#FFFBEB]"
                  : "border-dashed border-[#E2E8F0] bg-[#F8FAFC] opacity-60"
              }`}
            >
              <span
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                  badge.earned ? "bg-[#F59E0B] text-white" : "bg-[#E2E8F0] text-[#94A3B8]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-2 text-xs font-bold text-[#0F172A]">{badge.name}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-[#64748B]">
                {badge.earned ? badge.description : "Keep reading to unlock"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
