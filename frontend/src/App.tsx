import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { BundleDock } from "@/components/BundleDock";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Catalog from "@/pages/Catalog";
import Subscription from "@/pages/Subscription";
import Dashboard from "@/pages/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// Lenis momentum scrolling + scroll management: hash links glide to their section,
// plain navigations reset to the top.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60);
        return () => clearTimeout(t);
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <BundleDock />
      <Toaster />
    </>
  );
}
