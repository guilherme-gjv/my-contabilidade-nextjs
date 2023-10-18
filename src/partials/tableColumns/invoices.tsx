import { ColumnDef } from "@tanstack/react-table";

interface TableColumn {
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
          <span className="self-start text-left text-sm text-strong-blue py-3 px-1.5">
            #
          </span>
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
        id: "total_value",
        header: () => (
          <span className="self-start text-left text-sm text-strong-blue py-3">
            Valor Total
          </span>
        ),
        cell: (info) => (
          <div className="flex font-semibold flex-row items-center justify-start gap-2 text-spacie-rose">
            {info?.row?.original.value}
          </div>
        ),
        accessorFn: (row) => row.value,
        footer: (props) => props.column.id,
      },
      {
        id: "enterprise_cnpj",
        header: () => (
          <span className="self-start text-left text-sm text-strong-blue py-3">
            CNPJ da Empresa
          </span>
        ),
        cell: (info) => (
          <div className="flex font-semibold flex-row items-center justify-start gap-2 text-spacie-rose">
            {info?.row?.original.enterpriseCnpj}
          </div>
        ),
        accessorFn: (row) => row.enterpriseCnpj,
        footer: (props) => props.column.id,
      },
      {
        id: "description",
        header: () => (
          <span className="self-start text-left text-sm text-strong-blue py-3">
            Descrição
          </span>
        ),
        cell: (info) => (
          <div className="flex font-semibold flex-row items-center justify-start gap-2 text-spacie-rose">
            {info?.row?.original.description}
          </div>
        ),
        accessorFn: (row) => row.description,
        footer: (props) => props.column.id,
      },
      {
        id: "createdAt",
        header: () => (
          <span className="self-start text-left text-sm text-strong-blue py-3">
            Criado Em
          </span>
        ),
        cell: (info) => (
          <div className="flex font-semibold flex-row items-center justify-start gap-2 text-spacie-rose">
            {info?.row?.original.createdAt?.toString()}
          </div>
        ),
        accessorFn: (row) => row.createdAt,
        footer: (props) => props.column.id,
      },
      {
        id: "updatedAt",
        header: () => (
          <span className="self-start text-left text-sm text-strong-blue py-3">
            Atualizado em
          </span>
        ),
        cell: (info) => (
          <div className="flex font-semibold flex-row items-center justify-start gap-2 text-spacie-rose">
            {info?.row?.original.updatedAt?.toString()}
          </div>
        ),
        accessorFn: (row) => row.updatedAt,
        footer: (props) => props.column.id,
      },
    ],
  },
];

export default tableData;
