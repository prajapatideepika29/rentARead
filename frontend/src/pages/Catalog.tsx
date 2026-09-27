import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { LibraryBig, Search } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Book } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";

const GENRES = [
  "All",
  "Literary Fiction",
  "Mystery & Thriller",
  "Sci-Fi & Fantasy",
  "Classics",
  "Non-Fiction",
  "Biography",
  "Indian Writing",
  "Romance",
];

const fetchBooks = () => apiGet<Book[]>("/books");

export default function Catalog() {
  const { data: books, isError } = useQuery({ queryKey: ["books"], queryFn: fetchBooks, retry: false });
  const [genre, setGenre] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = books ?? [];
    return list.filter((b) => {
      const genreOk = genre === "All" || b.genre === genre;
      const qOk =
        !q ||
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.author.toLowerCase().includes(q.toLowerCase());
      return genreOk && qOk;
    });
  }, [books, genre, q]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#0284C7]">
            <LibraryBig className="h-4 w-4" /> The catalogue
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Pick this month's four adventures
          </h1>
          <p className="mt-3 max-w-xl text-base text-[#64748B]">
            Choose any four books — they arrive together, get loved together, and go back together. No late fees, ever.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" data-testid="genre-filters">
            {GENRES.map((g) => (
              <button
                key={g}
                data-testid={`genre-filter-${g.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                onClick={() => setGenre(g)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  genre === g
                    ? "bg-[#0F172A] text-[#FDFBF7]"
                    : "border border-[#F1E8DC] bg-white text-[#64748B] hover:border-[#0284C7] hover:text-[#0284C7]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#F1E8DC] bg-white px-4 py-2.5 lg:w-72">
            <Search className="h-4 w-4 text-[#94A3B8]" />
            <input
              data-testid="catalog-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or author"
              className="w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {isError ? (
          <div className="mt-20 rounded-2xl border border-[#F1E8DC] bg-white p-12 text-center" data-testid="catalog-unavailable">
            <p className="font-heading text-lg text-[#64748B]">
              The shelves are being restocked — the catalogue will appear the moment our server is back.
            </p>
          </div>
        ) : books && filtered.length === 0 ? (
          <div className="mt-20 rounded-2xl border border-[#F1E8DC] bg-white p-12 text-center" data-testid="catalog-empty">
            <p className="font-heading text-lg text-[#64748B]">Nothing on this shelf matches — try another genre or search.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4" data-testid="book-grid">
            {filtered.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
            {!books &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="aspect-[2/3] rounded-xl bg-[#F0F9FF]" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-[#F0F9FF]" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-[#F0F9FF]" />
                </div>
              ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
