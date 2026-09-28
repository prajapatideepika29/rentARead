export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#2563EB" />
      <path
        d="M32 20c-4-3.5-9-4.5-14-4v28c5-.5 10 .5 14 4 4-3.5 9-4.5 14-4V16c-5-.5-10 .5-14 4z"
        fill="#F8FAFC"
      />
      <path d="M32 20v28" stroke="#2563EB" strokeWidth="2.5" />
    </svg>
  );
}
