import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import CreateItem, { IInvoiceItem } from "./CreateItem";

interface ListingItemsInputProps {
  value?: IInvoiceItem[];
  onClickSave?: (data: IInvoiceItem) => void;
  /** Callback called by clicking remove button. */
  onRemoveClick?: (id: string) => void;
  /** Callback called by clicking the add button passing the input content on the param.  */
  onChange?: (value: IInvoiceItem[]) => void;
}

const ItemsListInput: React.FC<ListingItemsInputProps> = ({
  value = [],
  onRemoveClick,
  onClickSave,
  onChange,
}) => {
  //* memos
  const valuesWithId = useMemo(
    () =>
      value.map((item) => ({
        id: uuidv4(),
        item,
      })),
    [value]
  );

  //* render
  return (
    <div className="flex flex-col gap-y-3 border border-gray-300 text-gray-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-full ">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="flex justify-between px-3 gap-x-5 w-full pt-3">
          <div className="sm:col-span-3 w-1/2">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nome
            </label>
          </div>
          <div className="sm:col-span-3 w-1/2">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Preço
            </label>
          </div>
          <div className="w-24 invisible"></div>
        </div>
        {valuesWithId.map((item, index) => (
          <CreateItem
            defaultValue={{
              ...item.item,
              info: {
                id: item.id,
              },
            }}
            newItemLabel="Salvar"
            onClickSave={(data) => {
              onChange && onChange([...value, data]);
            }}
            onDelete={(id) => {
              const newArray = valuesWithId
                .filter((item) => {
                  return !(item.id === id);
                })
                .map((item) => item.item);
              onChange && onChange(newArray);
            }}
            editable={true}
            key={item.id}
          />
        ))}
        <CreateItem
          key={"create"}
          newItemLabel="Novo Item"
          onClickSave={(data) => {
            onChange && onChange([...value, data]);
          }}
        />
      </div>
    </div>
  );
};

export default ItemsListInput;
