import { CustomToastTypes, customToast } from "@/services/customToast";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getErrorMessage } from "@/functions/getErrorMessage";
import Link from "next/link";
import { api } from "@/services/api";
import CpfCnpjInput from "@/components/inputs/CpfCnpjInput";

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

const validationSchema = z
  .object({
    email: z
      .string({
        required_error: "O campo 'email' é obrigatório.",
      })
      .email({ message: "email inválido." }),
    cpf: z
      .string({ description: "O campo 'CPF' é obrigatório." })
      .refine(
        (data) => data.length === 11 || data.length === 14 || data.length === 0,
        {
          message: "O CPF ou CNPJ deve possuir 11 ou 14 dígitos.",
        }
      )
      .optional(),
    name: z
      .string({
        required_error: "O campo 'name' é obrigatório",
      })
      .min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
    password: z
      .string({
        required_error: "O campo 'password' é obrigatório.",
      })
      .min(8, { message: "A senha deve possuir ao menos 8 caracteres." }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não combinam.",
    path: ["confirm_password"],
  });

type ISignupFormData = z.infer<typeof validationSchema>;

const Signup: React.FC = () => {
  //* hooks
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISignupFormData>({ resolver: zodResolver(validationSchema) });

  //* callbacks
  const handleOnSubmit = useCallback(
    async ({ name, email, cpf, password }: ISignupFormData) => {
      const { updateToast } = customToast(
        "Registrando",
        CustomToastTypes.LOADING
      );
      try {
        let requestData = { name, email, cpf, password };
        if (!cpf) {
          delete requestData["cpf"];
        }
        await api.post("/user", requestData);
        updateToast({
          render: "Registrado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });

        push("/auth/login");
      } catch (error) {
        updateToast({
          render: "Houve um erro no login! " + getErrorMessage(error),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
    [push]
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
          Registrar
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(handleOnSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nome
            </label>
            <div className="mt-2">
              <input
                id="name"
                {...register("name")}
                type="name"
                autoComplete="name"
                required
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.name && (
                <p className="mt-1 text-red-500">{errors.name?.message}</p>
              )}
            </div>
          </div>
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
            <label
              htmlFor="cpf"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              CPF/CNPJ {"(opcional)"}
            </label>
            <div className="mt-2">
              <Controller
                name="cpf"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CpfCnpjInput value={value || ""} onChange={onChange} />
                )}
              />

              {errors.cpf && (
                <p className="mt-1 text-red-500">{errors.cpf?.message}</p>
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
                type="password"
                autoComplete="password"
                required
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <p className="mt-1 text-red-500">{errors.password?.message}</p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-start">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirmar Senha
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
                id="confirm_password"
                {...register("confirm_password")}
                type="password"
                autoComplete="confirm_password"
                required
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-red-500">
                  {errors.confirm_password?.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Já tem uma conta?
          <Link
            href={"/auth/login"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
