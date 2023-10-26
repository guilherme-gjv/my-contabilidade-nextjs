import { CustomToastTypes, customToast } from "@/services/customToast";
import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getErrorMessage } from "@/functions/getErrorMessage";
import Link from "next/link";
import clsx from "clsx";

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

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O e-mail é obrigatório" })
    .email("E-mail inválido"),
  password: z
    .string({
      required_error: "O campo 'password' é obrigatório.",
      description: "O campo 'email' deve ser string.",
    })
    .min(8, { message: "A senha deve possuir ao menos 8 caracteres." }),
});
type ILoginFormData = z.infer<typeof validationSchema>;

const Login: React.FC = () => {
  //* hooks
  const { push } = useRouter();
  const { signIn } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormData>({ resolver: zodResolver(validationSchema) });

  //* states
  const [showPassword, setShowPassword] = useState(false);

  //* callbacks
  const handleOnSubmit = useCallback(
    async ({ email, password }: ILoginFormData) => {
      const { updateToast } = customToast(
        "Autenticando",
        CustomToastTypes.LOADING
      );
      try {
        await signIn({ email, password });
        updateToast({
          render: "Autenticado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        push("/");
      } catch (error) {
        updateToast({
          render: "Houve um erro no login! " + getErrorMessage(error),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [signIn, push]
  );

  //* render
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="font-thin italic text-xl text-center">
          My Contabilidade
        </h2>
        <img
          className="mx-auto h-10 w-auto"
          src="https://clipartcraft.com/images/transparent-emojis-money.png"
          width={100}
          height={100}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Entre em sua conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(handleOnSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              E-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                {...register("email")}
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="mt-1 text-red-500">{errors.email?.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-start">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Senha
              </label>
              {/* {<div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>} */}
            </div>
            <div className="mt-2">
              <input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="flex gap-x-2 mt-1 w-full justify-end">
                <p className="text-sm">Mostrar senha</p>
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  className={clsx(
                    showPassword ? "" : "bg-indigo-600",
                    "right-1.5 rounded-full border border-indigo-600 w-5 h-5"
                  )}
                ></button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500">{errors.password?.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Não tem uma conta?
          <Link
            href={"/auth/registrar"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            registre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
