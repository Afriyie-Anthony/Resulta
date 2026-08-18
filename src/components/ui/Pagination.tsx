import React from 'react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = '',
}) => {
  const { isLight } = useAdminTheme();

  if (totalItems === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const startItem = (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < safeTotalPages - 2) pages.push('...');
      pages.push(safeTotalPages);
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-1 border-t text-xs font-semibold ${
      isLight ? 'border-slate-200/80 text-slate-600' : 'border-slate-800/80 text-slate-400'
    } ${className}`}>
      {/* Information & Items per page */}
      <div className="flex items-center gap-3 flex-wrap">
        <span>
          Showing <strong className={isLight ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'}>{startItem}</strong> to{' '}
          <strong className={isLight ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'}>{endItem}</strong> of{' '}
          <strong className={isLight ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'}>{totalItems}</strong> entries
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="opacity-70 text-[11px]">Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className={`px-2 py-1 rounded-lg text-xs font-bold focus:outline-none transition-colors border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#0F8B8D]'
                  : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-teal-500'
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1}
          title="First Page"
          className={`p-1.5 rounded-lg transition-all ${
            safeCurrentPage === 1
              ? 'opacity-30 cursor-not-allowed'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700 active:scale-95'
              : 'hover:bg-slate-800 text-slate-300 active:scale-95'
          }`}
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          title="Previous Page"
          className={`p-1.5 rounded-lg transition-all ${
            safeCurrentPage === 1
              ? 'opacity-30 cursor-not-allowed'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700 active:scale-95'
              : 'hover:bg-slate-800 text-slate-300 active:scale-95'
          }`}
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((page, idx) => (
            typeof page === 'number' ? (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-black transition-all ${
                  safeCurrentPage === page
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white shadow-xs'
                      : 'bg-teal-500 text-slate-950 font-black shadow-xs'
                    : isLight
                    ? 'hover:bg-slate-200/70 text-slate-700'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-400 select-none">
                ...
              </span>
            )
          ))}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          title="Next Page"
          className={`p-1.5 rounded-lg transition-all ${
            safeCurrentPage === safeTotalPages
              ? 'opacity-30 cursor-not-allowed'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700 active:scale-95'
              : 'hover:bg-slate-800 text-slate-300 active:scale-95'
          }`}
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages}
          title="Last Page"
          className={`p-1.5 rounded-lg transition-all ${
            safeCurrentPage === safeTotalPages
              ? 'opacity-30 cursor-not-allowed'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700 active:scale-95'
              : 'hover:bg-slate-800 text-slate-300 active:scale-95'
          }`}
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
