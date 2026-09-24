import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

const PINCODES = [
  { code: "560001", hub: "MG Road, Bengaluru" },
  { code: "560034", hub: "Koramangala, Bengaluru" },
  { code: "110001", hub: "Connaught Place, Delhi" },
  { code: "400050", hub: "Bandra West, Mumbai" },
  { code: "500081", hub: "HITEC City, Hyderabad" },
  { code: "411001", hub: "Pune Camp, Pune" },
];

export function Footer() {
  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-display text-2xl font-semibold">RentARead</span>
            </div>
            <p className="mt-5 max-w-sm font-heading text-lg italic leading-relaxed text-[#D6CEBF]">
              “A room without books is like a body without a soul.”
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#A8A29E]">— Cicero</p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D6CEBF]">
              Now delivering in
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#A8A29E]">
              {PINCODES.map((p) => (
                <li key={p.code} data-testid={`footer-pincode-${p.code}`}>
                  <span className="font-mono text-[#FDBA74]">{p.code}</span> · {p.hub}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D6CEBF]">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#A8A29E]">
              <li><Link to="/catalog" className="transition-colors hover:text-[#FDBA74]">Browse the catalog</Link></li>
              <li><Link to="/subscription" className="transition-colors hover:text-[#FDBA74]">Quarterly plan</Link></li>
              <li><Link to="/dashboard" className="transition-colors hover:text-[#FDBA74]">Member dashboard</Link></li>
              <li>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#25D366]"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[#FAF7F2]/10 pt-6 text-xs text-[#A8A29E] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} RentARead. Twice-read, thrice-loved.</span>
          <span>3 months · 12 books · ₹1,499 · zero deposit</span>
        </div>
      </div>
    </footer>
  );
}
