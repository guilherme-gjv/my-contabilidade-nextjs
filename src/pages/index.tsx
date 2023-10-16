import Image from "next/image";
import { Inter } from "next/font/google";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

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

  return {
    props: {},
  };
};

export default function Home() {
  const { isAuthenticated, signOut } = useContext(AuthContext);

  //* render
  return isAuthenticated === null ? (
    <div>loading</div>
  ) : (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      Home page :D
      <button
        className="bg-black hover:bg-gray-900 w-32 h-16 text-white rounded-xl"
        onClick={signOut}
      >
        Sair
      </button>
    </main>
  );
}
