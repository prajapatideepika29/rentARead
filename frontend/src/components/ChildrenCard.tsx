import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import type { Child } from "@/lib/types";

const AGE_GROUPS = ["2-4", "5-7", "8-10", "11-14"];
const CHIP_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#F43F5E", "#8B5CF6", "#0EA5E9"];

const fetchChildren = () => apiGet<Child[]>("/children/me");

// Parent-managed reader profiles. Selected on the catalog to filter by the child's age,
// and attached to orders so badges accrue per child.
export function ChildrenCard() {
  const queryClient = useQueryClient();
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren, retry: false });
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("5-7");

  const addChild = useMutation({
    mutationFn: () => apiPost<Child>("/children", { name, age_group: ageGroup }),
    onSuccess: (child) => {
      setName("");
      setAdding(false);
      toast.success(`${child.name} is ready to read!`);
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const removeChild = useMutation({
    mutationFn: (id: string) => apiDelete(`/children/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
      void queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6" data-testid="children-card">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-[#0F172A]">Your little readers</h2>
        {!adding && (
          <button
            data-testid="add-child-button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add child
          </button>
        )}
      </div>

      {children && children.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {children.map((child, i) => (
            <li
              key={child.id}
              data-testid={`child-chip-${child.id}`}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }}
              >
                {child.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#0F172A]">{child.name}</p>
                <p className="text-[11px] text-slate-500">Ages {child.age_group}</p>
              </div>
              <button
                data-testid={`delete-child-${child.id}`}
                onClick={() => removeChild.mutate(child.id)}
                aria-label={`Remove ${child.name}`}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-[#DC2626]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {children?.length === 0 && !adding && (
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Add your kids and the catalogue will show books for exactly their age — badges track each reader separately.
        </p>
      )}

      {adding && (
        <form
          data-testid="add-child-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) addChild.mutate();
          }}
          className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
        >
          <input
            data-testid="child-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Child's name"
            maxLength={40}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          />
          <div className="flex flex-wrap gap-1.5">
            {AGE_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                data-testid={`child-age-${g}`}
                onClick={() => setAgeGroup(g)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  ageGroup === g
                    ? "bg-[#2563EB] text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB]"
                }`}
              >
                Ages {g}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              data-testid="save-child-button"
              type="submit"
              disabled={addChild.isPending || !name.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] disabled:opacity-50"
            >
              {addChild.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookOpen className="h-3.5 w-3.5" />}
              Save reader
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
