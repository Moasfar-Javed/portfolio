export function SectionDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 top-0 mx-auto h-px w-2/3 max-w-3xl bg-gradient-to-r from-transparent via-border-strong to-transparent" />
    </div>
  );
}
