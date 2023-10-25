import { useCallback, useRef, useState } from "react";
import { ZodError, z } from "zod";
import { IInvoiceItemWithInfoId } from "./CreateItem";

export const invoiceItemValidationSchema = z.object({
  price: z
    .number({ required_error: "O preço é obrigatório." })
    .min(0, "O preço deve ser um valor positivo."),
  name: z
    .string({
      required_error: "O campo 'name' é obrigatório.",
      description: "O campo 'name' deve ser string.",
    })
    .min(1, "O campo 'nome' é obrigatório."),
});

interface EditItemProps {
  defaultValue?: IInvoiceItemWithInfoId;
  onClickSave?: (data: IInvoiceItemWithInfoId) => void;
  onChangeItem?: (data: IInvoiceItemWithInfoId) => void;
  onDelete?: (id: number) => void;
  onDeleteNewItem?: (id: string) => void;
  newItemLabel?: string;
  editable?: boolean;
}

const EditItem: React.FC<EditItemProps> = ({
  defaultValue,
  onClickSave,
  newItemLabel,
  onChangeItem,
  editable,
  onDelete,
  onDeleteNewItem,
}) => {
  //* states
  const [errors, setErrors] = useState({
    price: { message: "" },
    name: { message: "" },
  });

  //* refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  //* handlers
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
  const handleClickNewItem = useCallback(async () => {
    let price = 0;
    let name = "";
    if (priceInputRef && priceInputRef.current && priceInputRef.current.value) {
      price = parseFloat(priceInputRef.current.value);
    }
    if (nameInputRef && nameInputRef.current && nameInputRef.current.value) {
      name = nameInputRef.current.value;
    }
    const values = {
      price,
      name,
    };
    if ((await checkErrors(values)) && onClickSave) {
      setErrors({ name: { message: "" }, price: { message: "" } });
      onClickSave(values);
      if (
        priceInputRef &&
        priceInputRef.current &&
        priceInputRef.current.value
      ) {
        priceInputRef.current.value = "";
      }
      if (nameInputRef && nameInputRef.current && nameInputRef.current.value) {
        nameInputRef.current.value = "";
      }
    }
  }, [onClickSave]);

  const handleOnChangeItem = async () => {
    let price = 0;
    let name = "";
    if (priceInputRef && priceInputRef.current && priceInputRef.current.value) {
      price = parseFloat(priceInputRef.current.value);
    }
    if (nameInputRef && nameInputRef.current && nameInputRef.current.value) {
      name = nameInputRef.current.value;
    }
    const values = {
      id: defaultValue?.id,
      price,
      name,
    };
    if ((await checkErrors(values)) && onChangeItem) {
      onChangeItem(values);
    }
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
              ref={nameInputRef}
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
              defaultValue={defaultValue?.price || 0}
              ref={priceInputRef}
              id="description"
              className="block z-50 w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-red-500">{errors.price?.message}</p>
          )}
        </div>
        {editable && (
          <div className="flex gap-x-3">
            <button
              onClick={handleOnChangeItem}
              type="button"
              title="salvar"
              disabled={!defaultValue?.id}
              className="leading-6 w-11 z-50 text-gray-900 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="green"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                if (defaultValue && defaultValue.id && onDelete) {
                  onDelete(defaultValue.id);
                } else if (
                  defaultValue &&
                  defaultValue.info_id &&
                  onDeleteNewItem
                ) {
                  onDeleteNewItem(defaultValue.info_id);
                }
              }}
              type="button"
              className="leading-6 w-11 z-50 text-gray-900 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="red"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
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

export default EditItem;
