import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { z } from "zod";
import CpfCnpjInput from "./CpfCnpjInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const invoiceValidationSchema = z.object({
  enterpriseCnpj: z
    .string({ description: "O campo 'cpf' deve ser string." })
    .refine((data) => data.length === 0 || data.length === 14, {
      message: "O cnpj deve possuir 14 dígitos.",
    })
    .optional(),
  description: z
    .string({ description: "O campo 'description' deve ser string." })
    .optional(),
});
export type IInvoiceFormData = z.infer<typeof invoiceValidationSchema>;

interface InvoiceFormProps {
  isOpen: boolean;
  onSubmit: (data: IInvoiceFormData) => void;
  onClose: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  isOpen,
  onSubmit,
  onClose,
}) => {
  //* hooks
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IInvoiceFormData>({
    resolver: zodResolver(invoiceValidationSchema),
  });

  //* render
  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-100 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <div className="fixed w-full h-screen z-10">
        <div className="fixed z-20 w-full h-screen bg-black/10"></div>
        <Dialog
          className="fixed z-30 top-28 left-1/2 transform -translate-x-1/2 -translate-y-20 bg-white w-[90%] sm:w-3/4 h-[90vh] overflow-y-auto p-4 rounded-lg shadow-lg"
          onClose={onClose}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Criar Nota Fiscal
                </h2>
              </div>

              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Informações da Nota
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="enterpriseCnpj"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      CNPJ da Empresa {"(opcional)"}
                    </label>
                    <div className="mt-2">
                      <Controller
                        name="enterpriseCnpj"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CpfCnpjInput
                            value={value || ""}
                            disable={{ cpf: true }}
                            onChange={onChange}
                          />
                        )}
                      />

                      {errors.enterpriseCnpj && (
                        <p className="mt-1 text-red-500">
                          {errors.enterpriseCnpj.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Descrição
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("description")}
                        id="description"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.description && (
                      <p className="mt-1 text-red-500">
                        {errors.description?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Notifications
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We will always let you know about important changes, but you
                  pick what else you want to hear about.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={() => onClose()}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog>
      </div>
    </Transition>
  );
};

export default InvoiceForm;