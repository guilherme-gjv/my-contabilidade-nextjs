import { formatDate } from "@/services/dateHandlers";
import { ColumnDef } from "@tanstack/react-table";
import { mask } from "remask";

interface TableColumn {
  id?: string;
  value?: string;
  enterpriseCnpj?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const tableData: ColumnDef<TableColumn>[] = [
  {
    id: "Information",
    footer: (props) => props.column.id,
    columns: [
      {
        id: "id",
        header: () => (
          <span className="self-start text-left text-sm px-1.5">#</span>
        ),
        cell: (info) => (
          <>
            {/* desktop */}
            <div className="flex gap-3.5 justify-start items-center">
              <div className="inline-block shrink-0 relative text-xs rounded-md truncate">
                {info?.row?.index + 1}
              </div>
            </div>
          </>
        ),
        footer: (props) => props.column.id,
      },
      {
        id: "invoice_id",
        header: () => <span className="self-start text-left text-sm">ID</span>,
        cell: (info) => (
          <div className="flex font-thin flex-row items-center justify-start gap-2">
            {info?.row?.original.id}
          </div>
        ),
        accessorFn: (row) => row.id,
        footer: (props) => props.column.id,
      },
      {
        id: "total_value",
        header: () => (
          <span className="self-start text-left text-sm">Valor Total</span>
        ),
        cell: (info) => (
          <div className="flex font-thin flex-row items-center justify-start gap-2">
            {info?.row?.original.value}
          </div>
        ),
        accessorFn: (row) => row.value,
        footer: (props) => props.column.id,
      },
      {
        id: "enterprise_cnpj",
        header: () => (
          <span className="self-start text-left text-sm">CNPJ da Empresa</span>
        ),
        cell: (info) => (
          <div className="flex font-thin flex-row items-center justify-start gap-2">
            {mask(info?.row?.original.enterpriseCnpj || "", [
              "999.999.999-99",
              "99.999.999/9999-99",
            ])}
          </div>
        ),
        accessorFn: (row) => row.enterpriseCnpj,
        footer: (props) => props.column.id,
      },
      {
        id: "description",
        header: () => (
          <span className="self-start text-left text-sm">Descrição</span>
        ),
        cell: (info) => (
          <div className="flex font-thin flex-row items-center justify-start gap-2">
            {info?.row?.original.description}
          </div>
        ),
        accessorFn: (row) => row.description,
        footer: (props) => props.column.id,
      },
      {
        id: "createdAt",
        header: () => (
          <span className="self-start text-left text-sm">Criado Em</span>
        ),
        cell: (info) => (
          <div className="flex font-thin flex-row items-center justify-start gap-2">
            {info?.row?.original.createdAt &&
              formatDate(info?.row?.original.createdAt.toString())}
          </div>
        ),
        accessorFn: (row) => row.createdAt,
        footer: (props) => props.column.id,
      },
      {
        id: "updatedAt",
        header: () => (
          <span className="self-start text-left text-sm">Atualizado em</span>
        ),
        cell: (info) => (
          <div className="flex font-thin flex-row items-center justify-start gap-2">
            {info?.row?.original.updatedAt &&
              formatDate(info?.row?.original.updatedAt.toString())}
          </div>
        ),
        accessorFn: (row) => row.updatedAt,
        footer: (props) => props.column.id,
      },
    ],
  },
];

export default tableData;
