import { useState } from "react";
import { motion } from "motion/react";
import { Bookmark, Check } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/lib/types";
import { useBundle } from "@/lib/bundle";

export function BookCard({ book, index }: { book: Book; index: number }) {
  const { ids, toggle, has } = useBundle();
  const [imgOk, setImgOk] = useState(true);
  const selected = has(book.id);
  const full = ids.length >= 4;
  const out = book.copies_available < 1;

  const onAdd = () => {
    if (!selected && full) {
      toast.error("Your bundle holds 4 books — remove one to make room.");
      return;
    }
    toggle(book.id);
  };

  return (
    <motion.article
      data-testid="book-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden rounded-xl border border-[#E7DFD5] bg-[#F5EFEB] shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        <div className="aspect-[2/3] w-full overflow-hidden">
          {imgOk ? (
            <img
              src={book.cover_url}
              alt={`${book.title} cover`}
              loading="lazy"
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#2B533E] p-4 text-center">
              <span className="font-display text-lg italic text-[#FAF7F2]">{book.title}</span>
            </div>
          )}
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-[#FAF7F2]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#9A3412] backdrop-blur">
          {book.genre}
        </span>
        {out && (
          <span className="absolute right-3 top-3 rounded-full bg-[#1C1917]/85 px-2.5 py-1 text-[11px] font-semibold text-[#FCA5A5] backdrop-blur">
            Out on rent
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[#1C1917]/90 to-transparent p-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-3 text-xs leading-relaxed text-[#FAF7F2]/90">{book.synopsis}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="font-heading text-base font-semibold leading-snug text-[#1C1917]">{book.title}</h3>
        <p className="mt-0.5 text-sm text-[#57534E]">{book.author}</p>
        <p className="mt-1 text-xs text-[#A8A29E]">{book.pages} pages</p>
        <button
          data-testid="add-to-bundle-button"
          onClick={onAdd}
          disabled={out && !selected}
          className={`mt-3 flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors ${
            selected
              ? "bg-[#2B533E] text-[#FAF7F2]"
              : out
                ? "cursor-not-allowed bg-[#F5EFEB] text-[#A8A29E]"
                : "bg-[#1C1917] text-[#FAF7F2] hover:bg-[#9A3412]"
          }`}
        >
          {selected ? (
            <>
              <Check className="h-4 w-4" /> In your bundle
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" /> Add to bundle
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
