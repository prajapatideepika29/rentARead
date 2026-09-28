import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { apiGet } from "@/lib/api";
import { useBundle } from "@/lib/bundle";
import type { Child } from "@/lib/types";

const CHIP_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#F43F5E", "#8B5CF6", "#0EA5E9"];

const fetchChildren = () => apiGet<Child[]>("/children/me").catch(() => null);

// "Reading for" switcher on the catalog: picking a child snaps the catalogue to their
// age band and attributes the order (and badges) to them. Hidden when logged out or no profiles.
export function ChildSwitcher() {
  const { ageGroup, setAgeGroup, childId, setChildId } = useBundle();
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren, retry: false });

  if (!children || children.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="child-switcher">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Reading for</span>
      <button
        data-testid="child-switch-everyone"
        onClick={() => {
          setChildId(null);
          setAgeGroup("all");
        }}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
          childId === null
            ? "bg-[#0F172A] text-white shadow-sm"
            : "border border-slate-200 bg-white text-slate-500 hover:text-slate-900"
        }`}
      >
        Everyone
      </button>
      {children.map((child, i) => (
        <motion.button
          key={child.id}
          data-testid={`child-switch-${child.id}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setChildId(child.id);
            setAgeGroup(child.age_group);
          }}
          className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
            childId === child.id
              ? "text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          }`}
          style={childId === child.id ? { backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] } : undefined}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: childId === child.id ? "rgba(255,255,255,0.25)" : CHIP_COLORS[i % CHIP_COLORS.length],
              color: "#fff",
            }}
          >
            {child.name.charAt(0).toUpperCase()}
          </span>
          {child.name}
          <span className={childId === child.id ? "text-white/75" : "text-slate-400"}>· Ages {child.age_group}</span>
        </motion.button>
      ))}
    </div>
  );
}
