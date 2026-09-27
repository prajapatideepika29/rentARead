import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Link2Off, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await apiPost("/auth/reset-password", { token, new_password: password });
      toast.success("Password updated — log in with your new password.");
      navigate("/login");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="mb-10 flex items-center justify-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl font-semibold text-[#1C1917]">RentARead</span>
        </Link>

        {!token ? (
          <div className="text-center" data-testid="reset-invalid">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#B91C1C]/10">
              <Link2Off className="h-8 w-8 text-[#B91C1C]" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-[#1C1917]">This link is incomplete</h1>
            <p className="mt-3 text-sm text-[#57534E]">Use the full link from your reset email, or request a fresh one.</p>
            <Link
              to="/forgot-password"
              className="mt-8 inline-block rounded-full bg-[#1C1917] px-8 py-3 text-sm font-semibold text-[#FAF7F2] transition-colors hover:bg-[#9A3412]"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-display text-3xl font-semibold tracking-tight text-[#1C1917]">Choose a new password</h1>
            <p className="mt-3 text-center text-sm text-[#57534E]">At least 6 characters — make it a good one.</p>
            <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5" data-testid="reset-form">
              <div className="space-y-2">
                <Label htmlFor="reset-password">New password</Label>
                <Input
                  id="reset-password"
                  data-testid="reset-password-input"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ characters"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-confirm">Confirm new password</Label>
                <Input
                  id="reset-confirm"
                  data-testid="reset-confirm-input"
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Same as above"
                  className="bg-white"
                />
              </div>
              {error && (
                <p data-testid="reset-error-message" className="rounded-lg bg-[#B91C1C]/10 px-4 py-3 text-sm text-[#B91C1C]">
                  {error}
                </p>
              )}
              <button
                data-testid="reset-submit-button"
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#9A3412] py-3.5 text-sm font-semibold text-[#FAF7F2] transition-colors hover:bg-[#7C2D12] disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Update password
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
