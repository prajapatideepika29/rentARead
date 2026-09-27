import { useState } from "react";
import { MapPin, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { PincodeCheck } from "@/lib/types";

interface Props {
  dark?: boolean;
  onResult?: (result: PincodeCheck) => void;
}

export function PincodeChecker({ dark = false, onResult }: Props) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PincodeCheck | null>(null);

  const check = async () => {
    if (!/^\d{6}$/.test(pin) || loading) return;
    setLoading(true);
    try {
      const res = await apiGet<PincodeCheck>(`/pincodes/check/${pin}`);
      setResult(res);
      onResult?.(res);
    } catch {
      setResult({
        pincode: pin,
        serviceable: false,
        hub: null,
        city: null,
        eta_days: null,
        message: "Couldn't check right now — please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div
        className={`flex items-center gap-2 rounded-full border-2 p-1.5 pl-4 transition-colors ${
          dark
            ? "border-[#FDFBF7]/25 bg-[#FDFBF7]/10 focus-within:border-[#FDE047]"
            : "border-[#BAE6FD] bg-white focus-within:border-[#0284C7]"
        }`}
      >
        <MapPin className={`h-4 w-4 shrink-0 ${dark ? "text-[#FDE047]" : "text-[#0284C7]"}`} />
        <input
          data-testid="pincode-input"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && void check()}
          placeholder="Enter your 6-digit pincode"
          inputMode="numeric"
          className={`w-full bg-transparent text-sm outline-none placeholder:text-sm ${
            dark ? "text-[#FDFBF7] placeholder:text-[#CBD5E1]/60" : "text-[#0F172A] placeholder:text-[#94A3B8]"
          }`}
        />
        <button
          data-testid="pincode-check-button"
          onClick={() => void check()}
          disabled={!/^\d{6}$/.test(pin) || loading}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#0284C7] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0369A1] active:translate-y-0.5 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check delivery"}
        </button>
      </div>

      {result && (
        <p
          data-testid="pincode-status-message"
          className={`mt-3 flex items-start gap-2 text-sm leading-relaxed ${
            result.serviceable
              ? dark
                ? "text-[#86EFAC]"
                : "text-[#15803D]"
              : dark
                ? "text-[#FCA5A5]"
                : "text-[#DC2626]"
          }`}
        >
          {result.serviceable ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {result.message}
        </p>
      )}
    </div>
  );
}
