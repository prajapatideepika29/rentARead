import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBundle } from "@/lib/bundle";
import { endSession } from "@/lib/session";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, loading } = useAuth();
  const { ids } = useBundle();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#F1E8DC]/80 bg-[#FDFBF7]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo" onClick={() => setMenuOpen(false)}>
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-semibold tracking-tight text-[#0F172A]">
            RentARead
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#64748B] md:flex">
          <Link to="/catalog" className="transition-colors hover:text-[#0284C7]" data-testid="nav-catalog-link">
            Catalog
          </Link>
          <Link to="/#how" className="transition-colors hover:text-[#0284C7]" data-testid="nav-how-link">
            How it works
          </Link>
          <Link to="/#pricing" className="transition-colors hover:text-[#0284C7]" data-testid="nav-pricing-link">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {ids.length > 0 && (
            <Link
              to="/catalog"
              data-testid="nav-bundle-counter"
              className="flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1.5 text-xs font-semibold text-[#FDFBF7] transition-transform hover:scale-105"
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
                className="gap-1.5 text-[#0F172A]"
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
                className="text-[#64748B]"
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
                className="hidden text-[#0F172A] sm:inline-flex"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                data-testid="nav-join-button"
                className="hidden rounded-full bg-[#0284C7] px-4 text-[#FDFBF7] hover:bg-[#0369A1] sm:inline-flex"
              >
                Join the library
              </Button>
            </>
          )}
          <button
            data-testid="nav-menu-button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full p-2 text-[#0F172A] transition-colors hover:bg-[#F0F9FF] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#F1E8DC] bg-[#FDFBF7] px-4 py-4 md:hidden" data-testid="nav-mobile-menu">
          <div className="flex flex-col gap-1 text-sm font-medium text-[#0F172A]">
            <Link to="/catalog" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F0F9FF]" data-testid="mobile-nav-catalog">
              Catalog
            </Link>
            <Link to="/#how" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F0F9FF]" data-testid="mobile-nav-how">
              How it works
            </Link>
            <Link to="/#pricing" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F0F9FF]" data-testid="mobile-nav-pricing">
              Pricing
            </Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F0F9FF]" data-testid="mobile-nav-dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F0F9FF]" data-testid="mobile-nav-login">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 font-semibold text-[#0284C7] transition-colors hover:bg-[#F0F9FF]" data-testid="mobile-nav-join">
                  Join the library
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
