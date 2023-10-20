import { Inter } from "next/font/google";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { api } from "@/services/api";
import { getErrorMessage } from "@/functions/getErrorMessage";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import TableComponent from "@/components/DataTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import tableData from "@/partials/tableColumns/invoices";
import InvoiceModal from "@/components/InvoiceModal";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "mycontabilidade.token": token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
      props: {},
    };
  }

  const page = ctx.query.page ? parseInt(ctx.query.page as string, 10) : 1;
  const rows = ctx.query.rows ? parseInt(ctx.query.rows as string) : 10;

  try {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const { data } = await api.get<{ data: IInvoice[] }>(`/invoice`, {
      params: {
        rows,
        page,
      },
    });

    const invoicesWithValue = data.data.map((invoice: IInvoice) => {
      let value = 0;

      invoice.items.forEach((item: any) => {
        value += item.price;
      });

      const invoiceWithValue = {
        ...invoice,
        value,
      };
      return invoiceWithValue;
    });

    return {
      props: {
        invoices: invoicesWithValue,
        page,
        rows,
        aLength: 98, // data.data.count,
      },
    };
  } catch (e) {
    console.log((e as Error).message);

    return {
      redirect: {
        destination: "/auth/login?error=" + getErrorMessage(e),
        permanent: false,
      },
      props: {},
    };
  }
};

const Home: React.FC<{
  page: number;
  rows: number;
  invoices?: IInvoice[];
  aLength: number;
  //filterData?: any;
  //filterStatus: boolean;
}> = ({ invoices, aLength, page, rows }) => {
  const pagesAmount = useMemo(() => {
    return !(Math.ceil(aLength / rows) === 0) ? Math.ceil(aLength / rows) : 1;
  }, [aLength, rows]);

  const [rowsPerPage, setRowsPerPage] = useState(rows);
  const [currentPage, setCurrentPage] = useState(
    page > pagesAmount ? pagesAmount : page
  );
  const [list, setList] = useState(invoices);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState<IInvoice | null>(null);

  const { push } = useRouter();

  useEffect(() => {
    setList(invoices);
  }, [invoices]);

  const { signOut, user } = useContext(AuthContext);

  const handleOnRequestSearch = useCallback(
    () => push(`/?page=${currentPage}${rowsPerPage && "&rows=" + rowsPerPage}`),
    [currentPage, push, rowsPerPage]
  );

  const handleRowOnClick = (row: Row<Record<string, unknown>>) => {
    const foundInvoice = invoices?.find((invoice) => {
      const convertedId = parseInt(row.original.id as unknown as string);
      if (invoice.id === convertedId) {
        return invoice;
      }
    });

    if (foundInvoice) {
      setModalData(foundInvoice);
      setModalIsOpen(true);
    }
  };

  useEffect(() => {
    handleOnRequestSearch();
  }, []);

  //* render
  return (
    <div className="relative flex flex-col w-full h-screen bg-gray-100">
      {modalIsOpen && modalData && <InvoiceModal invoice={modalData} />}
      <div className="bg-white text-black shadow w-full p-2 flex items-center justify-between">
        <div className="flex items-center justify-between  w-full">
          <div className="flex items-center">
            <img
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
              className="w-16 h-16 object-contain rounded-full mr-2"
            />
            <h2 className="font-bold text-xl">My Contabilidade</h2>
          </div>
          <div className="relative">
            <Menu>
              <Menu.Button>
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src="https://github.com/guilherme-gjv.png"
                  alt="user-photo"
                  title="profile photo"
                />
              </Menu.Button>
              <Menu.Items className="absolute top-[100%] right-0 w-48 rounded bg-white shadow-lg ">
                <div className="flex items-center h-10 w-full px-2 rounded-t bg-indigo-500">
                  <p className="text-white text-center w-full">
                    {user ? user.email : ""}
                  </p>
                </div>
                <Menu.Item>
                  <button className="h-10 px-2 w-full hover:bg-gray-100 transition-colors">
                    Editar Perfil
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={signOut}
                    className="h-10 px-2 w-full hover:bg-gray-100 transition-colors"
                  >
                    Sair
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        <div className="space-x-5">
          <button>
            <i className="fas fa-bell text-gray-500 text-lg"></i>
          </button>
          <button>
            <i className="fas fa-user text-gray-500 text-lg"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-wrap">
        <div className="flex-1 p-4 w-full md:w-1/2">
          <div className="mt-8 bg-white p-4 shadow rounded-lg">
            <div className="my-1"></div>
            <div className=" flex items-center justify-between pb-6">
              <div>
                <h2 className="text-gray-500 text-lg font-semibold">
                  Notas Fiscais
                </h2>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <div className="flex bg-gray-50 items-center p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    className="bg-gray-50 outline-none ml-1 block "
                    type="text"
                    placeholder="pesquisar..."
                  />
                </div>
                <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                  Nova
                </button>
              </div>
            </div>
            <TableComponent
              wrapperDivClasses="relative shadow rounded"
              tableClasses="min-w-full leading-normal"
              headRowClasses="text-sm leading-normal font-thin"
              rowClasses="hover:bg-gray-50 transition-colors cursor-pointer font-thin"
              rowTitle="Abrir"
              rowOnClick={handleRowOnClick}
              cellClasses="px-5 py-5 border-b border-gray-200 text-sm"
              headersClasses="px-5 py-3 border-b-2 first:rounded-l last:rounded-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              rowsPerPageChange={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              isPaginated
              pagesAmount={pagesAmount}
              currentPage={currentPage}
              totalRows={aLength}
              onPaginationChange={setCurrentPage}
              data={list ? (list as unknown as Record<string, unknown>[]) : []}
              isListEmpty={list?.length === 0 || !list}
              columns={
                tableData as ColumnDef<Record<string, unknown>, unknown>[]
              }
            ></TableComponent>
          </div>
          <div className="mt-8 flex flex-wrap space-x-0 space-y-2 md:space-x-4 md:space-y-0">
            <div className="flex-1 bg-white p-4 shadow rounded-lg md:w-1/2">
              <h2 className="text-gray-500 text-lg font-semibold pb-1">
                Gastos este mês
              </h2>
              <div className="my-1"></div>
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
              <div
                className="chart-container"
                style={{ position: "relative", height: 150, width: "100%" }}
              >
                <canvas id="usersChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
