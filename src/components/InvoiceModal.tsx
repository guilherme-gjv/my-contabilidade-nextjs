import { Transition } from "@headlessui/react";
import { Fragment } from "react";

interface InvoiceModalProps {
  invoice?: IInvoice;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  console.log("modal data: ");
  console.log(invoice);

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <div className="fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-96 h-52 p-4 rounded-lg shadow-lg">
        <button onClick={onClose} title="Fechar">
          X
        </button>
        <h2 className="font-bold">Nota Fiscal</h2>
        <p>{invoice && invoice.id}</p>
        <p>{invoice && invoice.description}</p>
        <p>{invoice && invoice.enterpriseCnpj}</p>
      </div>
    </Transition>
  );
};

export default InvoiceModal;
