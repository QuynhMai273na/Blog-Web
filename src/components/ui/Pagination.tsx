import Link from "next/link";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
  summary?: string;
  className?: string;
  controlsClassName?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  getHref,
  summary,
  className,
  controlsClassName,
}: PaginationProps) {
  if (totalPages <= 1 && !summary) return null;

  return (
    <section className={cn("w-full bg-[#fdfcf8] py-4", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 px-4 md:flex-row md:justify-between",
          !summary && "md:justify-center",
        )}
      >
        {summary ? (
          <p className="text-sm font-medium text-sage-800/70">{summary}</p>
        ) : null}

        {totalPages > 1 ? (
          <nav
            aria-label="Phân trang"
            className={cn(
              "flex flex-wrap items-center justify-center gap-2.5",
              controlsClassName,
            )}
          >
            {currentPage > 1 ? (
              <Link href={getHref(currentPage - 1)} className={navButtonClass}>
                ← Trước
              </Link>
            ) : (
              <span className={disabledButtonClass}>← Trước</span>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <Link
                  key={page}
                  href={getHref(page)}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? activePageClass : pageButtonClass}
                >
                  {page}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link href={getHref(currentPage + 1)} className={navButtonClass}>
                Sau →
              </Link>
            ) : (
              <span className={disabledButtonClass}>Sau →</span>
            )}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

const navButtonClass =
  "rounded-full border border-[#f1ddd8] bg-white px-4 py-2 text-[13px] font-medium text-sage-800 shadow-sm transition-colors hover:bg-[#fff5f6] hover:text-[#d96e83]";

const disabledButtonClass =
  "rounded-full border border-[#f1ddd8] bg-white px-4 py-2 text-[13px] font-medium text-sage-800/35 shadow-sm";

const pageButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-[#f1ddd8] bg-white text-[13px] font-medium text-sage-800 shadow-sm transition-colors hover:bg-[#fff5f6] hover:text-[#d96e83]";

const activePageClass =
  "flex h-9 w-9 items-center justify-center rounded-full bg-[#d96e83] text-[13px] font-bold text-white shadow-md transition-colors hover:bg-[#c85f70]";
