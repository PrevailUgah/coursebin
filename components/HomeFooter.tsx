export default function HomeFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-white px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink sm:text-sm">
            © With love by Prevail
          </p>
          <p className="mt-0.5 truncate text-[10px] text-muted sm:text-xs">
            CourseBin — resources shared for students.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-right">
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
              MU GINA Community product
            </p>
            <p className="mt-0.5 hidden text-[10px] text-muted sm:block sm:text-xs">
              Built with community and care.
            </p>
          </div>
          <img
            src="/mu-gina-logo.svg"
            alt="MU GINA Community logo"
            className="h-8 w-8 rounded-lg object-cover sm:h-12 sm:w-12 sm:rounded-xl"
          />
        </div>
      </div>
    </footer>
  );
}
