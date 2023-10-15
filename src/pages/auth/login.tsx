import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

import { useCallback, useContext } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "mycontabilidade.token": token } = parseCookies(ctx);
  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

const Login: React.FC = () => {
  const { push } = useRouter();
  const { signIn } = useContext(AuthContext);

  const handleLogin = useCallback(async () => {
    console.log("logando");

    await signIn({ email: "guigui@email.com", password: "12345678" });
    console.log("logou");

    push("/");
  }, [signIn, push]);

  //* render
  return (
    <main>
      <button onClick={handleLogin}>Logar</button>
    </main>
  );
};

export default Login;
