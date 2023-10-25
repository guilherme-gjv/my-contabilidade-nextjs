import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IInvoiceItemWithInfoId } from "./CreateItem";
import EditItem from "./EditItem";

interface ListingItemsInputProps {
  value?: IInvoiceItemWithInfoId[];
  onClickSave?: (data: IInvoiceItemWithInfoId) => void;
  /** Callback called by clicking remove button. */
  onRemoveClick?: (id: string) => void;
  /** Callback called by clicking the add button passing the input content on the param.  */
  onChange?: (value: IInvoiceItemWithInfoId[]) => void;
  onChangeItems?: (
    newItems?: IInvoiceItemWithInfoId[],
    editedItems?: IInvoiceItemWithInfoId[],
    deletedItems?: IInvoiceItemWithInfoId[]
  ) => void;
}

const EditItemsListInput: React.FC<ListingItemsInputProps> = ({
  value = [],
  onChangeItems,
  onChange,
}) => {
  //* states
  const [displayedItems, setDisplayedItems] =
    useState<IInvoiceItemWithInfoId[]>(value);
  const [deletedItems, setDeletedItems] = useState<IInvoiceItemWithInfoId[]>(
    []
  );
  const [editedItems, setEditedItems] = useState<IInvoiceItemWithInfoId[]>([]);
  const [newItems, setNewItems] = useState<IInvoiceItemWithInfoId[]>([]);

  //* lifecycle
  useEffect(() => {
    console.log("effect list");
    console.log("newItems", newItems);

    console.log("editedItems", editedItems);

    console.log("deletedItems", deletedItems);

    onChangeItems && onChangeItems(newItems, editedItems, deletedItems);
  }, [newItems, editedItems, deletedItems, onChangeItems]);

  //* memos
  const valuesWithId = useMemo(
    () =>
      displayedItems.map((item) => ({
        id: uuidv4(),
        item,
      })),
    [displayedItems]
  );

  //* callbacks
  const onDelete = useCallback(
    (id: number) => {
      setDisplayedItems((items) => {
        const updatedItems = items.filter((item) => item.id !== id);
        const deletedItem = items.find((item) => item.id === id);

        const updateEditedItems = editedItems.filter((item) => item.id !== id);
        setEditedItems(updateEditedItems.slice());

        if (deletedItem) {
          setDeletedItems((deleted) => {
            const alreadyDeleted = (deleted || []).some(
              (item) => item.id === deletedItem.id
            );

            if (!alreadyDeleted) {
              return [...(deleted || []), deletedItem];
            } else {
              return deleted;
            }
          });
        }
        return updatedItems;
      });
    },
    [editedItems]
  );

  const handleChangeItem = useCallback((data: IInvoiceItemWithInfoId) => {
    setDisplayedItems((items) => {
      data.info_id = uuidv4();
      const index = items.findIndex((item) => item.id === data.id);
      if (index === -1) {
        return items;
      } else {
        const alreadyEdited = (items || []).some(
          (item) => item.info_id === data.info_id
        );
        if (!alreadyEdited) {
          setEditedItems((editedItems) => {
            const alreadyEditedItem = editedItems.some(
              (editedItem) => editedItem.info_id === data.info_id
            );
            if (!alreadyEditedItem) {
              let array = editedItems || [];
              const foundIndex = editedItems.findIndex(
                (item) => item.id === data.id
              );
              if (foundIndex === -1) {
                array.push(data);
                return array.slice();
              } else {
                array[foundIndex] = data;
                return array.slice();
              }
            } else {
              return editedItems.slice();
            }
          });
          items[index] = data;
          return [...items].slice();
        } else {
          return items;
        }
      }
    });
  }, []);

  const handleNewItem = useCallback((data: IInvoiceItemWithInfoId) => {
    setDisplayedItems((items) => {
      data.info_id = uuidv4();
      const isDuplicate = items.some((item) => item.info_id === data.info_id);
      if (!isDuplicate) {
        let newArray = items || [];
        setNewItems((newItems) => {
          const isNewItemDuplicate = newItems.some(
            (newItem) => newItem.info_id === data.info_id
          );
          if (!isNewItemDuplicate) {
            let newItemsArray = newItems || [];
            newItemsArray.push(data);
            return newItemsArray.slice();
          } else {
            return newItems?.slice();
          }
        });
        newArray.push(data);
        return newArray.slice();
      } else {
        return items.slice();
      }
    });
  }, []);

  const handleDeleteNewItem = useCallback(
    (id: string) => {
      const updateNewItems = newItems.filter((item) => {
        return item.info_id !== id;
      });
      const updateDisplayedItems = displayedItems.filter(
        (item) => item.info_id !== id
      );
      setNewItems(updateNewItems.slice());
      setDisplayedItems(updateDisplayedItems.slice());
    },
    [displayedItems, newItems]
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
          <EditItem
            defaultValue={{
              ...item.item,
              info_id: item.item.info_id || item.id,
            }}
            newItemLabel="Salvar"
            onChangeItem={handleChangeItem}
            onDelete={onDelete}
            onDeleteNewItem={handleDeleteNewItem}
            editable={true}
            key={item.id}
          />
        ))}
        <EditItem
          key={"create"}
          newItemLabel="Novo Item"
          onClickSave={handleNewItem}
        />
      </div>
    </div>
  );
};

export default EditItemsListInput;
