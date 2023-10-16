import { CustomToastTypes, customToast } from "@/services/customToast";
import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

import { useCallback, useContext } from "react";
import { AxiosError } from "axios";
import { getErrorFromAPI } from "@/services/axios";

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
    const { updateToast } = customToast(
      "Autenticando",
      CustomToastTypes.LOADING
    );
    try {
      await signIn({ email: "guigo@email.com", password: "12345678" });
      updateToast({
        render: "Autenticado com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      push("/");
    } catch (error) {
      updateToast({
        render:
          "Houve um erro no login! " + getErrorFromAPI(error as AxiosError),
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }, [signIn, push]);

  //* render
  return (
    <main>
      <button onClick={handleLogin}>Logar</button>
    </main>
  );
};

export default Login;
