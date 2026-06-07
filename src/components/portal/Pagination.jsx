"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
  showItemsPerPage = true,
}) {
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-100">
      {/* Left: Items per page */}
      {showItemsPerPage && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition hover:border-slate-400"
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>
      )}

      {/* Center: Page info */}
      <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
        {Math.max(1, startItem)}–{endItem} of {total}
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center justify-between sm:justify-end gap-1.5">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed rounded-lg transition"
          title="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-slate-400 font-medium">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-sm transition ${
                  currentPage === page
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Mobile: show current / total instead of full number list */}
        <span className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white font-semibold text-sm">
          {currentPage}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed rounded-lg transition"
          title="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
