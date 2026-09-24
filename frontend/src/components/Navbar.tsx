import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBundle } from "@/lib/bundle";
import { endSession } from "@/lib/session";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, loading } = useAuth();
  const { ids } = useBundle();
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E7DFD5]/80 bg-[#FAF7F2]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo">
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-semibold tracking-tight text-[#1C1917]">
            RentARead
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#57534E] md:flex">
          <Link to="/catalog" className="transition-colors hover:text-[#9A3412]" data-testid="nav-catalog-link">
            Catalog
          </Link>
          <Link to="/#how" className="transition-colors hover:text-[#9A3412]" data-testid="nav-how-link">
            How it works
          </Link>
          <Link to="/#pricing" className="transition-colors hover:text-[#9A3412]" data-testid="nav-pricing-link">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {ids.length > 0 && (
            <Link
              to="/catalog"
              data-testid="nav-bundle-counter"
              className="flex items-center gap-1.5 rounded-full bg-[#1C1917] px-3 py-1.5 text-xs font-semibold text-[#FAF7F2] transition-transform hover:scale-105"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {ids.length}/4
            </Link>
          )}
          {loading ? null : user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                data-testid="nav-dashboard-button"
                className="gap-1.5 text-[#1C1917]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => void endSession("/")}
                data-testid="nav-logout-button"
                aria-label="Log out"
                className="text-[#57534E]"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                data-testid="nav-login-button"
                className="text-[#1C1917]"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                data-testid="nav-join-button"
                className="rounded-full bg-[#9A3412] px-4 text-[#FAF7F2] hover:bg-[#7C2D12]"
              >
                Join the library
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
