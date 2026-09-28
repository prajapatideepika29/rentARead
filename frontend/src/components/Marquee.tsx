const QUOTES = [
  "“So many books, so little time.” — Frank Zappa",
  "“A reader lives a thousand lives before he dies.” — George R.R. Martin",
  "12 books · 3 months · ₹1,499 · zero deposit",
  "“There is no friend as loyal as a book.” — Ernest Hemingway",
  "Free doorstep delivery & pickup, every month",
  "“I have always imagined that Paradise will be a kind of library.” — Borges",
  "WhatsApp reminders so a due date never sneaks up on you",
];

// One slow editorial ribbon. Content rendered twice so the -50% loop is seamless.
export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[#E2E8F0] bg-[#EFF6FF] py-4" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-12">
        {[...QUOTES, ...QUOTES].map((q, i) => (
          <span
            key={i}
            className="flex items-center gap-12 whitespace-nowrap font-heading text-sm text-[#64748B]"
          >
            {q}
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
          </span>
        ))}
      </div>
    </div>
  );
}
