/* eslint-disable react/no-unused-prop-types */
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PaginationProps {
  onPaginationChange?: (page: number) => void;
  rowsPerPage?: number;
  pageRows?: number;
  setRowsPerPage?: (rowsPerPage: number) => void;
  totalRows?: number;
  currentPage?: number;
  pagesAmount?: number;
}

//* constants

const Pagination: React.FC<PaginationProps> = ({
  onPaginationChange,
  currentPage,
  totalRows,
  pagesAmount,
  rowsPerPage,
  setRowsPerPage,
  pageRows,
}) => {
  //* memos
  const defaultPageNumbers: number[] = useMemo(() => {
    return [];
  }, []);

  //* states
  const [pgsAmount, setPgsAmount] = useState(pagesAmount || 1);
  const [pageNumbers, setPageNumbers] = useState(defaultPageNumbers);

  //* handlers
  const handleSetPageNumbers = useCallback(() => {
    defaultPageNumbers.splice(0, defaultPageNumbers.length);
    const max = (pgsAmount || 0) >= 5 ? 5 : pgsAmount || 0;
    for (let index = 0; index < max; index++) {
      defaultPageNumbers.push(index + 1);
    }
    setPageNumbers(defaultPageNumbers);
    onPaginationChange &&
      onPaginationChange(
        currentPage && currentPage > pgsAmount ? pgsAmount : currentPage || 1
      );
  }, [pgsAmount]);

  const navigateFirstPage = () => {
    setPageNumbers(defaultPageNumbers);
    onPaginationChangeCallback(1);
  };

  const onPaginationChangeCallback = useCallback(
    (pageIndex: number) => onPaginationChange && onPaginationChange(pageIndex),
    [pgsAmount, pageNumbers]
  );

  const navigatePreviousPage = useCallback(() => {
    setPageNumbers(
      pageNumbers.map((number) => {
        return number - 1;
      })
    );
  }, [pageNumbers]);

  const navigateNextPage = useCallback(() => {
    setPageNumbers(
      pageNumbers.map((number) => {
        return number + 1;
      })
    );
  }, [pageNumbers]);

  const navigateLastPage = useCallback(() => {
    if (!(pgsAmount <= pageNumbers[5])) {
      if (pgsAmount <= 5) {
        setPageNumbers(defaultPageNumbers);
      } else {
        setPageNumbers(
          pageNumbers.map((_number, index) => {
            return pgsAmount - (4 - index);
          })
        );
      }
    }
    onPaginationChangeCallback(pgsAmount);
  }, [pgsAmount, pageNumbers]);

  //* effects
  useEffect(() => {
    setPgsAmount(pagesAmount || 1);
  }, [pagesAmount]);

  useEffect(handleSetPageNumbers, [pgsAmount]);

  //* render
  return currentPage &&
    onPaginationChange &&
    pagesAmount &&
    rowsPerPage &&
    setRowsPerPage ? (
    <div className="shadow-lg relative w-full min-w-full rounded-b-lg flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5 text-navy-700 dark:text-navy-100 bg-white dark:bg-navy-700 transition-colors ">
      <div className="flex justify-between space-x-2 text-xs">
        <select
          title="Selecione o número de linhas por página"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
          }}
          aria-label="label for the select"
          className="form-select rounded border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <p className="font-normal text-base">
          {!totalRows || totalRows === 0
            ? "Nenhum resultado encontrado."
            : `Mostrando ${pageRows} de ${totalRows}`}
        </p>
      </div>
      <ol className="pagination flex space-x-1.5">
        <li>
          <button
            type="button"
            title="Ir para a primeira página"
            onClick={navigateFirstPage}
            disabled={currentPage === 1}
            className="flex h-8 w-8 -space-x-2 items-center justify-center rounded bg-gray-200 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </li>
        <li>
          <button
            type="button"
            title="Página anterior"
            onClick={navigatePreviousPage}
            disabled={pageNumbers[0] === 1}
            className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </li>
        {pageNumbers.map((pageIndex) => {
          return (
            <li key={pageIndex}>
              <button
                type="button"
                className={clsx(
                  currentPage === pageIndex
                    ? "bg-primary hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200/90 dark:bg-gray-400 dark:hover:bg-gray-400 dark:focus:bg-gray-400 dark:active:bg-gray-400/90"
                    : "bg-gray-300 hover:bg-gray-400 focus:bg-gray-300 active:bg-gray-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90",
                  "flex h-8 min-w-[2rem] items-center justify-center rounded px-3 leading-tight text-navy-750 dark:text-white transition-colors "
                )}
                onClick={() => onPaginationChangeCallback(pageIndex)}
              >
                {pageIndex}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            title="Próxima página"
            onClick={navigateNextPage}
            disabled={
              currentPage === pgsAmount ||
              pgsAmount <= 5 ||
              pageNumbers[pageNumbers.length - 1] === pgsAmount
            }
            className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </li>
        <li>
          <button
            type="button"
            title="Ir para a última página"
            onClick={navigateLastPage}
            disabled={currentPage === pgsAmount}
            className="flex h-8 w-8 -space-x-2 items-center justify-center rounded bg-gray-200 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </li>
      </ol>
    </div>
  ) : (
    <></>
  );
};

export default Pagination;