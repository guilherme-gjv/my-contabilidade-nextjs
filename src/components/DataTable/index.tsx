/* eslint-disable indent */
/* eslint-disable react/prop-types */
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  RowModel,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Pagination from "./Pagination";
import { Menu } from "@headlessui/react";
import { useState } from "react";

interface TableProps {
  headRowClasses?: string;
  rowClasses?: string;
  mobileRowClasses?: string;
  cellClasses?: string;
  mobileCellClasses?: string;
  headersClasses?: string;
  data?: Record<string, unknown>[];
  columns: ColumnDef<Record<string, unknown>>[];
  tableClasses?: string;
  wrapperDivClasses?: string;
  totalRows?: number;
  onSortingChange?: (e: Record<string, unknown>) => Record<string, unknown>;
  getSortedRowModel?: <T = any>(table: Table<T>) => () => RowModel<T>;
  isPaginated?: boolean;
  rowsPerPage?: number;
  rowsPerPageChange?: (rowsPerPage: number) => void;
  isListEmpty?: boolean;
  emptyListMessage?: string;
  emptyListMessageClasses?: string;
  tableOptions?: {
    title?: string;
    titleClass?: string;
    icon?: React.ReactNode;
    menuClass?: string;
    menuButtonClass?: string;
    menuItemsBoxClass?: string;
    menuItemsBoxClassRegular?: string;
    menuItemsBoxClassLast?: string;
    menuItemClass?: string;
    menuItems?: {
      key?: string;
      className?: string;
      label?: string;
      onClick?: (row: Row<Record<string, unknown>>) => void;
    }[];
    isDisabled?: (values: Record<string, unknown>) => boolean;
  };
  tableOptionsInDropdown?: boolean;
  tableOptionsLabel?: string;
  headerRowsThatAppearInMobile?: string[];
  onPaginationChange?: (page: number) => void;
  currentPage?: number;
  pagesAmount?: number;
  showGotoFirstPage?: boolean;
  showGotoLastPage?: boolean;
}

const TableComponent: React.FC<TableProps> = ({
  headRowClasses,
  rowClasses,
  cellClasses,
  headersClasses,
  data,
  columns,
  isPaginated,
  tableOptions,
  onPaginationChange,
  isListEmpty,
  emptyListMessage,
  emptyListMessageClasses,
  wrapperDivClasses,
  pagesAmount,
  currentPage,
  tableClasses,
  tableOptionsLabel,
  totalRows,
  rowsPerPage,
  rowsPerPageChange,
}) => {
  //* states
  const [sorting, setSorting] = useState<SortingState>([]);

  //* hooks
  const table = useReactTable({
    data: data || [],
    columns,
    pageCount: pagesAmount,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  //* render
  return (
    <div className={wrapperDivClasses}>
      <div className="z-0 overflow-x-auto min-w-full ">
        <table className={clsx("table", tableClasses)}>
          <thead>
            {table.getHeaderGroups().map((headerGroup, index) => {
              return (
                index > 0 && (
                  <tr key={headerGroup.id} className={headRowClasses}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          className={headersClasses}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none flex gap-1 items-center justify-start"
                                  : "flex gap-1 items-center justify-start",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <FaSortAmountUp className="text-xs" />,
                                desc: <FaSortAmountDown className="text-xs" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                    {tableOptions && (
                      <th className={headersClasses}>
                        {tableOptionsLabel || ""}
                      </th>
                    )}
                  </tr>
                )
              );
            })}
          </thead>
          <tbody className="overflow-x-hidden">
            {table.getRowModel().rows.map((row, index) => {
              const lastIndex = table.getRowModel().rows.length - 1;

              return (
                <tr key={row.id} className={rowClasses}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className={cellClasses}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                  {tableOptions && (
                    <td className={cellClasses}>
                      <Menu as="div" className={tableOptions.menuClass}>
                        <Menu.Button
                          type="button"
                          className={tableOptions.menuButtonClass}
                        >
                          {tableOptions.icon}
                        </Menu.Button>
                        <Menu.Items
                          className={clsx(
                            index === lastIndex
                              ? tableOptions.menuItemsBoxClassLast
                              : tableOptions.menuItemsBoxClassRegular,
                            tableOptions.menuItemsBoxClass
                          )}
                        >
                          {tableOptions.menuItems?.map((item) => {
                            return (
                              <Menu.Item key={item.key}>
                                <button
                                  type="button"
                                  className={item.className}
                                  onClick={() =>
                                    item.onClick &&
                                    item.onClick(
                                      row as Row<Record<string, unknown>>
                                    )
                                  }
                                >
                                  {item.label}
                                </button>
                              </Menu.Item>
                            );
                          })}
                        </Menu.Items>
                      </Menu>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isPaginated && (
        <Pagination
          onPaginationChange={onPaginationChange}
          pageRows={table.getRowModel().rows.length}
          currentPage={currentPage}
          pagesAmount={pagesAmount}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={rowsPerPageChange}
          totalRows={totalRows}
        />
      )}
    </div>
  );
};

export default TableComponent;
