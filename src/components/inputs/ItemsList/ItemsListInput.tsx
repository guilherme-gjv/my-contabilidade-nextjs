import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CreateItem, { IInvoiceItemForm } from "./CreateItem";

interface ListingItemsInputProps {
  value?: IInvoiceItemForm[];
  /** Callback called by clicking remove button. */
  onRemoveClick?: (index: number) => void;
  /** Callback called by clicking the add button passing the input content on the param.  */
  onChange?: (value: IInvoiceItemForm[]) => void;
}

const ItemsListInput: React.FC<ListingItemsInputProps> = ({
  value = [],
  onRemoveClick,
  onChange,
}) => {
  //* states
  const [inputText, setInputText] = useState<string>("");

  //* effects

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
      <div className="flex flex-wrap gap-x-2 gap-y-2 overflow-y-scroll max-h-[200px]">
        <div className="flex justify-between pt-3 px-3 gap-x-5 w-full">
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
        </div>
        {valuesWithId
          .map((item, index) => (
            <CreateItem
              defaultValue={item.item}
              newItemLabel="Salvar"
              onClickSave={(data) => {}}
              allowDisableButton={true}
              key={item.id}
            />
          ))
          .reverse()}
        <CreateItem
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
