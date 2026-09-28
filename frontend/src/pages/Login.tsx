import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@/lib/types";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SIDE_IMG =
  "https://images.unsplash.com/photo-1588243291559-c4a0c36bc2dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMGNhZmUlMjBsaWJyYXJ5fGVufDB8fHx8MTc5MDI3MjE5NHww&ixlib=rb-4.1.0&q=85";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiPost<User>("/auth/login", { email, password });
      beginSession();
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="relative hidden w-[42%] overflow-hidden bg-[#0F172A] lg:block">
        <img src={SIDE_IMG} alt="Hands holding an open novel over a warm drink" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/40 to-[#0F172A]/60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-xl font-semibold text-[#F8FAFC]">RentARead</span>
          </Link>
          <div>
            <p className="font-display text-3xl font-bold leading-snug text-[#F8FAFC]">
              “Once you learn to read, you will be forever free.”
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-[#CBD5E1]">— Frederick Douglass</p>
          </div>
        </div>
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0F172A]">Welcome back, reader</h1>
          <p className="mt-2 text-sm text-[#64748B]">Your next four books are waiting on the shelf.</p>

          <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5" data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                data-testid="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  to="/forgot-password"
                  data-testid="forgot-password-link"
                  className="text-xs font-semibold text-[#2563EB] underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                data-testid="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white"
              />
            </div>
            {error && (
              <p data-testid="login-error-message" className="rounded-lg bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
                {error}
              </p>
            )}
            <button
              data-testid="login-form-submit-button"
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-3.5 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Log in
            </button>
          </form>

          <p className="mt-8 text-sm text-[#64748B]">
            New to RentARead?{" "}
            <Link to="/signup" className="font-semibold text-[#2563EB] underline-offset-4 hover:underline" data-testid="login-signup-link">
              Join the library
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
