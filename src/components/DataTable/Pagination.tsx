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
    setPageNumbers(defaultPageNumbers.slice());
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
      pageNumbers
        .map((number) => {
          return number - 1;
        })
        .slice()
    );
  }, [pageNumbers]);

  const navigateNextPage = useCallback(() => {
    setPageNumbers(
      pageNumbers
        .map((number) => {
          return number + 1;
        })
        .slice()
    );
  }, [pageNumbers]);

  const navigateLastPage = useCallback(() => {
    if (!(pgsAmount <= pageNumbers[5])) {
      if (pgsAmount <= 5) {
        setPageNumbers(defaultPageNumbers.slice());
      } else {
        setPageNumbers(
          pageNumbers
            .map((_number, index) => {
              return pgsAmount - (4 - index);
            })
            .slice()
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
    <div className="relative overflow-x-auto w-full min-w-full rounded-b-lg flex flex-col justify-between space-y-4 px-4 py-4 sm:items-center sm:space-y-0 sm:px-5 text-navy-700 dark:text-navy-100 bg-white dark:bg-navy-700 transition-colors ">
      <div className="px-5 py-5 bg-white flex flex-col xs:flex-row items-center xs:justify-between">
        <p className="text-xs xs:text-sm text-gray-900 mb-2">
          {!totalRows || totalRows === 0
            ? "Nenhum resultado encontrado."
            : `Mostrando ${pageRows} de ${totalRows}`}
        </p>
        <select
          title="Selecione o número de linhas por página"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
          }}
          aria-label="label for the select"
          className="form-select rounded border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
      <ol className="pagination flex justify-start sm:justify-center space-x-1.5">
        <li>
          <button
            type="button"
            title="Ir para a primeira página"
            onClick={navigateFirstPage}
            disabled={currentPage === 1}
            className="flex h-8 w-8 -space-x-2 items-center text-sm justify-center rounded text-indigo-50  hover:bg-indigo-500 bg-indigo-600 font-semibold transition duration-150 focus:bg-indigo-500 active:bg-indigo-500/80"
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
            className="flex h-8 w-8 -space-x-2 items-center text-sm justify-center rounded text-indigo-50  hover:bg-indigo-500 bg-indigo-600 font-semibold transition duration-150 focus:bg-indigo-500 active:bg-indigo-500/80"
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
                    ? "bg-indigo-400 hover:bg-indigo-400 focus:bg-indigo-400 active:bg-indigo-400/90"
                    : "bg-indigo-600 hover:bg-indigo-400 focus:bg-indigo-600 active:bg-indigo-600/80",
                  "flex h-8 min-w-[2rem] items-center justify-center rounded px-3 leading-tight text-white transition-colors "
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
            className="flex h-8 w-8 -space-x-2 items-center text-sm justify-center rounded text-indigo-50  hover:bg-indigo-500 bg-indigo-600 font-semibold transition duration-150 focus:bg-indigo-500 active:bg-indigo-500/80"
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
            className="flex h-8 w-8 -space-x-2 items-center text-sm justify-center rounded text-indigo-50  hover:bg-indigo-500 bg-indigo-600 font-semibold transition duration-150 focus:bg-indigo-500 active:bg-indigo-500/80"
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
