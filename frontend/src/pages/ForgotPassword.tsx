import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, MailCheck } from "lucide-react";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiPost("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="mb-10 flex items-center justify-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl font-semibold text-[#0F172A]">RentARead</span>
        </Link>

        {sent ? (
          <div className="text-center" data-testid="forgot-success">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]/10">
              <MailCheck className="h-8 w-8 text-[#16A34A]" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-[#0F172A]">Check your inbox</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              If an account exists for <span className="font-semibold text-[#0F172A]">{email}</span>, a reset link is
              on its way. It expires in one hour.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-block rounded-full bg-[#0F172A] px-8 py-3 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#2563EB]"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-display text-3xl font-semibold tracking-tight text-[#0F172A]">
              Forgot your password?
            </h1>
            <p className="mt-3 text-center text-sm text-[#64748B]">
              Happens to the best of readers. Tell us your email and we'll send a reset link.
            </p>
            <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5" data-testid="forgot-form">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  data-testid="forgot-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white"
                />
              </div>
              {error && (
                <p data-testid="forgot-error-message" className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
                  {error}
                </p>
              )}
              <button
                data-testid="forgot-submit-button"
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-3.5 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Send reset link
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-[#64748B]">
              Remembered it after all?{" "}
              <Link to="/login" className="font-semibold text-[#2563EB] underline-offset-4 hover:underline" data-testid="forgot-login-link">
                Log in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
