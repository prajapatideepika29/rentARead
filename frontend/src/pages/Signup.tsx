import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Loader2, Package, RefreshCcw } from "lucide-react";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import type { PincodeCheck, User } from "@/lib/types";
import { Logo } from "@/components/Logo";
import { PincodeChecker } from "@/components/PincodeChecker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PERKS = [
  { icon: BookOpen, text: "4 books every month — 12 across the quarter" },
  { icon: Package, text: "Free doorstep delivery and return pickup" },
  { icon: RefreshCcw, text: "Swap sets monthly; renew or return in month 3" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [pinOk, setPinOk] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onPinResult = (res: PincodeCheck) => {
    setPincode(res.pincode);
    setPinOk(res.serviceable);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiPost<User>("/auth/register", { name, email, password, phone, pincode });
      beginSession();
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/subscription");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      <div className="relative hidden w-[42%] bg-[#0F172A] p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl font-semibold text-[#FDFBF7]">RentARead</span>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FDE047]">The quarterly plan</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#FDFBF7]">
            3 months.
            <br />
            12 books.
            <br />
            <span className="italic text-[#FDE047]">₹1,499 flat.</span>
          </h2>
          <ul className="mt-10 space-y-5">
            {PERKS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-[#CBD5E1]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDFBF7]/10">
                  <p.icon className="h-4 w-4 text-[#FDE047]" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-[#94A3B8]">No deposit. No late fees. No fine print worth squinting at.</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <Logo className="h-8 w-8" />
            <span className="font-display text-lg font-semibold text-[#0F172A]">RentARead</span>
          </Link>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0F172A]">Claim your shelf</h1>
          <p className="mt-2 text-sm text-[#64748B]">First, tell us where the books should go.</p>

          <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5" data-testid="signup-form">
            <div className="space-y-2">
              <Label>Delivery pincode</Label>
              <PincodeChecker onResult={onPinResult} />
              <input type="hidden" data-testid="signup-pincode-value" value={pincode} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" data-testid="signup-name-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Asha Rao" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" data-testid="signup-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-phone">WhatsApp number</Label>
              <Input id="signup-phone" data-testid="signup-phone-input" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 15))} placeholder="98765 43210" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" data-testid="signup-password-input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" className="bg-white" />
            </div>
            {error && (
              <p data-testid="signup-error-message" className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
                {error}
              </p>
            )}
            <button
              data-testid="signup-form-submit-button"
              type="submit"
              disabled={busy || !pinOk}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0284C7] py-3.5 text-sm font-semibold text-[#FDFBF7] transition-colors hover:bg-[#0369A1] disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {pinOk ? "Create my account" : "Check your pincode to continue"}
            </button>
          </form>

          <p className="mt-8 text-sm text-[#64748B]">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-[#0284C7] underline-offset-4 hover:underline" data-testid="signup-login-link">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
