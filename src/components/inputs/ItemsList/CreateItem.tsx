import { useState } from "react";
import { ZodError, z } from "zod";

export const invoiceItemValidationSchema = z.object({
  price: z.number({ required_error: "O preço é obrigatório." }),
  name: z
    .string({
      required_error: "O campo 'name' é obrigatório.",
      description: "O campo 'name' deve ser string.",
    })
    .min(1, "O campo 'nome' é obrigatório."),
});

export interface IInvoiceItem {
  price: number;
  name: string;
  info?: {
    id?: string;
    changed?: boolean;
    state?: "new" | "exists";
  };
}

interface CreateItemProps {
  defaultValue?: IInvoiceItem;
  onClickSave?: (data: IInvoiceItem) => void;
  onDelete?: (id: string) => void;
  newItemLabel?: string;
  editable?: boolean;
}

const CreateItem: React.FC<CreateItemProps> = ({
  defaultValue,
  onClickSave,
  newItemLabel,
  editable,
  onDelete,
}) => {
  //* states
  const [values, setValues] = useState<IInvoiceItem>({
    name: defaultValue?.name || "",
    price: defaultValue?.price || 0,
  });
  const [errors, setErrors] = useState({
    price: { message: "" },
    name: { message: "" },
  });

  const checkErrors = async ({ name, price }: IInvoiceItem) => {
    try {
      await invoiceItemValidationSchema.parseAsync({
        name,
        price,
      });
      return true;
    } catch (e) {
      const err = e as ZodError;

      err.issues.forEach((issue, index) => {
        if (issue.path && issue.path[0] === "name") {
          setErrors((data) => {
            return {
              ...data,
              name: { message: issue.message },
            };
          });
        }
        if (issue.path && issue.path[0] === "price") {
          setErrors((data) => {
            return {
              ...data,
              price: { message: issue.message },
            };
          });
        }
      });
      return false;
    }
  };

  //* handlers
  const handleClickNewItem = async () => {
    if ((await checkErrors(values)) && onClickSave) {
      onClickSave(values);
    }
    setValues({ price: 0, name: "" });
  };

  //* render
  return (
    <div
      className={
        "hover:bg-gray-50 transition flex flex-col gap-y-2 first:border-t border-b border-b-gray-200 items-center justify-between px-3 py-1 rounded w-full h-fit overflow-hidden"
      }
    >
      <div className="flex justify-between gap-x-5 w-full">
        <div className="sm:col-span-3 w-1/2">
          <div className="mt-2">
            <input
              type="text"
              name="name"
              defaultValue={defaultValue?.name}
              value={values.name}
              onChange={(evt) => {
                setValues((data) => {
                  return {
                    ...data,
                    name: evt.target.value,
                  };
                });
              }}
              id="description"
              className="block z-50 w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-red-500">{errors.name?.message}</p>
          )}
        </div>
        <div className="sm:col-span-3 w-1/2">
          <div className="mt-2">
            <input
              type="number"
              name="price"
              defaultValue={defaultValue?.price}
              value={values.price}
              onChange={(evt) => {
                setValues((data) => {
                  const convertedPrice = parseFloat(evt.target.value);
                  return {
                    ...data,
                    price: isNaN(convertedPrice)
                      ? 0
                      : parseFloat(convertedPrice.toFixed(2)),
                  };
                });
              }}
              id="description"
              className="block z-50 w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-red-500">{errors.price?.message}</p>
          )}
        </div>
        {editable && (
          <button
            onClick={() => {
              if (
                defaultValue &&
                defaultValue.info &&
                defaultValue.info.id &&
                onDelete
              ) {
                onDelete(defaultValue.info.id);
              }
            }}
            type="button"
            className="leading-6 w-24 z-50 text-gray-900 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Deletar
          </button>
        )}
        {!editable && (
          <button
            type="button"
            className="rounded-md w-24 leading-6 bg-indigo-600 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleClickNewItem}
          >
            {newItemLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateItem;
