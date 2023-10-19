import { Inter } from "next/font/google";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import TableComponent from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import tableData from "@/partials/tableColumns/invoices";
import { api } from "@/services/api";
import { getErrorMessage } from "@/functions/getErrorMessage";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

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
    const { data } = await api.get(`/invoice`, {
      params: {
        rows,
        page,
      },
    });

    const invoicesWithValue = data.data.map((invoice: any) => {
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
  invoices?: any[];
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

  const { push } = useRouter();

  useEffect(() => {
    setList(invoices);
  }, [invoices]);

  const { signOut } = useContext(AuthContext);

  const handleOnRequestSearch = useCallback(
    () => push(`/?page=${currentPage}${rowsPerPage && "&rows=" + rowsPerPage}`),
    [currentPage, push, rowsPerPage]
  );

  useEffect(() => {
    handleOnRequestSearch();
  }, []);

  //* render
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white text-white shadow w-full p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              src="https://www.emprenderconactitud.com/img/POC%20WCS%20(1).png"
              alt="Logo"
              className="w-28 h-18 mr-2"
            />
            <h2 className="font-bold text-xl">Nombre de la Aplicación</h2>
          </div>
          <div className="md:hidden flex items-center">
            <button id="menuBtn">
              <i className="fas fa-bars text-gray-500 text-lg"></i>
            </button>
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
        {/* {nota: essa  div pode ter a classe 'flex' ou 'hidden''} */}
        <div
          className="p-2 bg-white w-full md:w-60 flex flex-col md:flex"
          id="sideNav"
        >
          <nav>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="#"
            >
              <i className="fas fa-home mr-2"></i>Inicio
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="#"
            >
              <i className="fas fa-file-alt mr-2"></i>Autorizaciones
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="#"
            >
              <i className="fas fa-users mr-2"></i>Usuarios
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="#"
            >
              <i className="fas fa-store mr-2"></i>Comercios
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="#"
            >
              <i className="fas fa-exchange-alt mr-2"></i>Transacciones
            </a>
          </nav>

          <button
            onClick={signOut}
            className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white mt-auto"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </button>

          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mt-2"></div>

          <p className="mb-1 px-5 py-3 text-left text-xs text-cyan-500">
            Copyright WCSLAT@2023
          </p>
        </div>

        <div className="flex-1 p-4 w-full md:w-1/2">
          <div className="relative max-w-md w-full">
            <div className="absolute top-1 left-2 inline-flex items-center p-2">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              className="w-full h-10 pl-10 pr-4 py-1 text-base placeholder-gray-500 border rounded-full focus:shadow-outline"
              type="search"
              placeholder="Buscar..."
            />
          </div>

          <div className="mt-8 flex flex-wrap space-x-0 space-y-2 md:space-x-4 md:space-y-0">
            <div className="flex-1 bg-white p-4 shadow rounded-lg md:w-1/2">
              <h2 className="text-gray-500 text-lg font-semibold pb-1">
                Usuarios
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

            <div className="flex-1 bg-white p-4 shadow rounded-lg md:w-1/2">
              <h2 className="text-gray-500 text-lg font-semibold pb-1">
                Comercios
              </h2>
              <div className="my-1"></div>
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
              <div
                className="chart-container"
                style={{ position: "relative", height: 150, width: "100%" }}
              >
                <canvas id="commercesChart"></canvas>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-4 shadow rounded-lg">
            <div className="my-1"></div>
            <div className=" flex items-center justify-between pb-6">
              <div>
                <h2 className="text-gray-500 text-lg font-semibold">
                  Products Oder
                </h2>
                <span className="text-xs">All products item</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex bg-gray-50 items-center p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <input
                    className="bg-gray-50 outline-none ml-1 block "
                    type="text"
                    name=""
                    id=""
                    placeholder="search..."
                  />
                </div>
                <div className="lg:ml-40 ml-10 space-x-8">
                  <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                    New Report
                  </button>
                  <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                    Create
                  </button>
                </div>
              </div>
            </div>
            <TableComponent
              wrapperDivClasses="relative shadow rounded"
              tableClasses="min-w-full leading-normal"
              headRowClasses="text-sm leading-normal font-thin"
              rowClasses="hover:bg-gray-50 font-thin"
              cellClasses="px-5 py-5 border-b border-gray-200 text-sm"
              headersClasses="px-5 py-3 border-b-2 first:rounded-l last:rounded-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              //tableOptions={tableSelectOptions}
              rowsPerPageChange={setRowsPerPage}
              rowsPerPage={rowsPerPage}
              isPaginated
              tableOptionsLabel="Ação"
              pagesAmount={pagesAmount}
              currentPage={currentPage}
              totalRows={aLength}
              onPaginationChange={setCurrentPage}
              data={list ? (list as Record<string, unknown>[]) : []}
              isListEmpty={list?.length === 0 || !list}
              columns={
                tableData as ColumnDef<Record<string, unknown>, unknown>[]
              }
            ></TableComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
